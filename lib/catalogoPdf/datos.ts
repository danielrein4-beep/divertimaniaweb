// Datos del catálogo PDF: lee lo mismo que muestra la web (todas las fichas activas, con sus shows y dinámicas) y las
// organiza en grupos con una página fija por cada 6 fichas, para que el directorio sepa en qué página está cada una.
// Las fotos salen, por orden: del diseño original de los dueños (lib/catalogoPdf/diseno), del mejor fotograma de cada
// video ya mejorado (lib/catalogoPdf/fotos, ver scripts/fotos-pdf.mjs) o de la foto de la ficha.
import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import sharp from "sharp";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { getCategorias } from "@/lib/categorias";
import { getConfigSitio, numerosWhatsApp } from "@/lib/configSitio";
import { buildWhatsAppLink, formatTelefono } from "@/lib/telefono";
import { UPLOADS_DIR } from "@/lib/uploads";
import { PERFIL_IG } from "@/lib/site";

/** Cuántas fichas caben por página (2 columnas × 3 filas, cada una con su foto). */
export const FICHAS_POR_PAGINA = 6;
/** Dinámicas por página. */
export const DINAMICAS_POR_PAGINA = 8;
/** Líneas del directorio por página (dos columnas). */
export const LINEAS_DIRECTORIO = 88;
/** Páginas antes del directorio: portada (1) y bienvenida (2). */
const PAGINAS_INICIALES = 2;

export type FichaPdf = {
  id: string;
  nombre: string;
  descripcion: string;
  incluye: string[];
  duracion: string | null;
  edadIdeal: string | null;
  soloAdultos: boolean;
  masPedido: boolean;
  foto: Buffer | null;
  /** Página donde aparece (la calcula `planificar`). */
  pagina: number;
};

export type GrupoPdf = {
  id: string;
  titulo: string;
  /** Título grande de las páginas (más corto que `titulo`, que sale en el directorio y la etiqueta). */
  corto: string;
  /** Línea corta en verde bajo el título. */
  lema: string;
  numero: number;
  color: string;
  fichas: FichaPdf[];
  /** Fotos de la página de apertura del grupo (1 a 4). */
  hero: Buffer[];
  /** Página de apertura del grupo; sus fichas empiezan en la siguiente. */
  pagina: number;
  paginasFichas: number;
};

export type DinamicasPdf = {
  id: string;
  titulo: string;
  color: string;
  items: { nombre: string; descripcion: string }[];
  pagina: number;
};

/** Cada bloque del documento, en orden. */
export type BloquePdf = { tipo: "grupo"; grupo: GrupoPdf } | { tipo: "dinamicas"; dinamicas: DinamicasPdf };

export type LineaDirectorio = { tipo: "grupo" | "ficha"; texto: string; pagina: number; destino: string };

export type QrPdf = { texto: string; qr: Buffer };

export type SeccionIndice = { numero: number; titulo: string; detalle: string; pagina: number; destino: string };

export type CatalogoPdf = {
  bloques: BloquePdf[];
  directorio: LineaDirectorio[][];
  paginasDirectorio: number;
  indice: SeccionIndice[];
  totalFichas: number;
  telefonos: string[];
  qrs: QrPdf[];
  logo: Buffer;
  portada: Buffer | null;
  bienvenida: Buffer | null;
  cierre: Buffer | null;
  seguidores: string;
  /** Degradados a negro (PNG con transparencia): hacia abajo, hacia arriba, hacia la derecha y velo parejo. */
  degradados: { abajo: Buffer; arriba: Buffer; derecha: Buffer; velo: Buffer };
};

const MENSAJE_PDF = "Hola Divertimania, vi su catálogo en PDF y quiero cotizar para mi evento.";
const RAIZ = path.join(process.cwd(), "lib", "catalogoPdf");
const FOTOS_PDF = path.join(RAIZ, "fotos");
const DISENO = path.join(RAIZ, "diseno");

export const clave = (t: string) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const leer = (ruta: string) => readFile(ruta).catch(() => null);

/** Foto del diseño original, o el mejor fotograma ya mejorado, o la de la ficha en JPEG liviano. */
async function foto(nombre: string, url: string | null): Promise<Buffer | null> {
  const k = clave(nombre);
  const preparada = (await leer(path.join(DISENO, `${k}.jpg`))) ?? (await leer(path.join(FOTOS_PDF, `${k}.jpg`)));
  if (preparada) return preparada;
  if (!url) return null;
  const ruta = url.startsWith("/media/")
    ? path.join(UPLOADS_DIR, path.basename(url))
    : path.join(process.cwd(), "public", path.normalize(url).replace(/^([/\\])+/, ""));
  try {
    const original = await readFile(ruta);
    return await sharp(original).resize(640, 800, { fit: "cover", kernel: "lanczos3" }).sharpen({ sigma: 0.8 }).jpeg({ quality: 80 }).toBuffer();
  } catch {
    return null;
  }
}

/** Filas que definen el PDF; si no cambian, el PDF guardado sigue sirviendo. */
export async function leerFilas() {
  const [categorias, servicios, config, fotosPreparadas, disenoPreparado] = await Promise.all([
    getCategorias(),
    prisma.servicio.findMany({
      where: { activo: true, enPdf: true },
      orderBy: { orden: "asc" },
      select: {
        id: true, nombre: true, categoria: true, subcategoria: true, descripcion: true, incluye: true, duracion: true,
        edadIdeal: true, soloAdultos: true, masPedido: true, fotoUrl: true,
        opciones: {
          orderBy: { orden: "asc" },
          select: { id: true, tipo: true, nombre: true, descripcion: true, fotoUrl: true },
        },
      },
    }),
    getConfigSitio(),
    stat(path.join(FOTOS_PDF, "index.json")).then((s) => s.mtimeMs, () => 0),
    stat(path.join(DISENO, "portada.jpg")).then((s) => s.mtimeMs, () => 0),
  ]);
  return { categorias, servicios, whatsapp: config.whatsapp, numeros: numerosWhatsApp(config), fotosPreparadas, disenoPreparado };
}

type Filas = Awaited<ReturnType<typeof leerFilas>>;
type ServicioFila = Filas["servicios"][number];

/** El texto de relleno («Elige cómo lo quieres…») no se muestra, igual que en la web. */
const textoUtil = (t: string) => (t.startsWith("Elige cómo lo quieres") ? "" : t);

const lineas = (texto: string | null) => (texto ?? "").split("\n").map((l) => l.trim()).filter(Boolean);

async function ficha(s: ServicioFila): Promise<FichaPdf> {
  return {
    id: s.id,
    nombre: s.nombre,
    descripcion: textoUtil(s.descripcion),
    incluye: lineas(s.incluye),
    duracion: s.duracion,
    edadIdeal: s.edadIdeal,
    soloAdultos: s.soloAdultos,
    masPedido: s.masPedido,
    foto: await foto(s.nombre, s.fotoUrl),
    pagina: 0,
  };
}

/** Fichas que se prefieren para la foto de apertura de cada grupo (si no están, se usan las primeras con foto). */
const PREFERIDAS: Record<string, string[]> = {
  "personajes-infantiles": ["Show de Paw Patrol", "Super Mario Bros", "Muñecas LOL", "Toy Story"],
  "personajes-adultos": ["Catrinas", "Daft Punk", "La Casa de Papel", "Guerreras K-Pop"],
  "servicios-para-tu-fiesta": ["Espumanía", "Día de Piscina Infantil", "Castillos Inflables", "Pelotas Boom"],
  celebraciones: ["Baby Shower", "Revelación de Género"],
  shows: ["Show de Rapunzel con Madre Gothel y Flynn", "Show con la Bestia", "Show de toda la película La Sirenita", "Show de toda la película de Frozen"],
};

function heroDe(id: string, fichas: FichaPdf[]): Buffer[] {
  const conFoto = fichas.filter((f) => f.foto);
  const preferidas = (PREFERIDAS[id.startsWith("shows-") ? "shows" : id] ?? []).map((n) => conFoto.find((f) => f.nombre === n)).filter((f): f is FichaPdf => Boolean(f));
  const resto = conFoto.filter((f) => !preferidas.includes(f));
  // Celebraciones: sus fotos son del mismo momento; una sola, grande, luce mejor.
  return [...preferidas, ...resto].slice(0, id === "celebraciones" ? 1 : 4).map((f) => f.foto as Buffer);
}

function lemaDe(id: string, total: number): string {
  if (id === "personajes-infantiles") return `Más de ${Math.max(total - (total % 5), 5)} para elegir`;
  if (id.startsWith("shows-")) return "Disney, en persona";
  if (id === "personajes-adultos") return "La pista se enciende";
  if (id === "servicios-para-tu-fiesta") return "Súmalo a tu fiesta";
  if (id === "celebraciones") return "La noche que todos recuerdan";
  return `${total} para elegir`;
}

/** Reparte las páginas: portada (1), bienvenida (2), directorio, y luego cada grupo con su apertura y 6 fichas por página. */
function planificar(bloques: BloquePdf[]) {
  const lineasDir: LineaDirectorio[] = [];
  const indice: SeccionIndice[] = [];
  const rellenar = (inicio: number) => {
    let pagina = inicio;
    lineasDir.length = 0;
    indice.length = 0;
    for (const b of bloques) {
      if (b.tipo === "grupo") {
        const g = b.grupo;
        g.pagina = pagina;
        g.paginasFichas = Math.max(1, Math.ceil(g.fichas.length / FICHAS_POR_PAGINA));
        lineasDir.push({ tipo: "grupo", texto: g.titulo, pagina: g.pagina, destino: `g-${g.id}` });
        indice.push({ numero: g.numero, titulo: g.titulo, detalle: `${g.fichas.length} fichas`, pagina: g.pagina, destino: `g-${g.id}` });
        g.fichas.forEach((f, i) => {
          f.pagina = g.pagina + 1 + Math.floor(i / FICHAS_POR_PAGINA);
          lineasDir.push({ tipo: "ficha", texto: f.nombre, pagina: f.pagina, destino: `f-${g.id}-${f.id}` });
        });
        pagina += 1 + g.paginasFichas;
      } else {
        const d = b.dinamicas;
        d.pagina = pagina;
        lineasDir.push({ tipo: "grupo", texto: d.titulo, pagina: d.pagina, destino: `d-${d.id}` });
        pagina += Math.max(1, Math.ceil(d.items.length / DINAMICAS_POR_PAGINA));
      }
    }
  };
  rellenar(PAGINAS_INICIALES + 2);
  const paginasDirectorio = Math.max(1, Math.ceil(lineasDir.length / LINEAS_DIRECTORIO));
  rellenar(PAGINAS_INICIALES + 1 + paginasDirectorio);
  const directorio: LineaDirectorio[][] = [];
  for (let i = 0; i < lineasDir.length; i += LINEAS_DIRECTORIO) directorio.push(lineasDir.slice(i, i + LINEAS_DIRECTORIO));
  return { directorio, paginasDirectorio, indice: indice.map((x) => ({ ...x })) };
}

/** Degradado de transparente a negro (o al revés) como PNG: se pinta igual en cualquier visor de PDF. */
async function degradado(direccion: "abajo" | "arriba" | "derecha" | "velo"): Promise<Buffer> {
  const ancho = direccion === "derecha" ? 256 : 4;
  const alto = direccion === "derecha" || direccion === "velo" ? 4 : 256;
  const px = Buffer.alloc(ancho * alto * 4);
  for (let y = 0; y < alto; y++) {
    for (let x = 0; x < ancho; x++) {
      const t = direccion === "derecha" ? x / (ancho - 1) : direccion === "velo" ? 0 : y / (alto - 1);
      const a = direccion === "velo" ? 0.82 : direccion === "arriba" ? 1 - t : t;
      const i = (y * ancho + x) * 4;
      px[i] = 11;
      px[i + 1] = 11;
      px[i + 2] = 11;
      px[i + 3] = Math.round(255 * a);
    }
  }
  return sharp(px, { raw: { width: ancho, height: alto, channels: 4 } }).png().toBuffer();
}

export async function armarCatalogo(filas: Filas): Promise<CatalogoPdf> {
  const { categorias, servicios, numeros } = filas;
  const colorDe = (nombre: string) => categorias.find((c) => c.nombre === nombre)?.color ?? "#a8ff30";

  // Secciones en el orden del panel; las que no están en la lista de categorías van al final.
  const nombres = [...new Set([...categorias.map((c) => c.nombre), ...servicios.map((s) => s.categoria)])];
  const bloques: BloquePdf[] = [];
  let totalFichas = 0;
  let numeroGrupo = 0;

  const agregarGrupo = async (id: string, titulo: string, color: string, delGrupo: ServicioFila[]) => {
    if (delGrupo.length === 0) return;
    const fichas = await Promise.all(delGrupo.map(ficha));
    totalFichas += fichas.length;
    bloques.push({
      tipo: "grupo",
      grupo: { id, titulo, corto: titulo, lema: lemaDe(id, fichas.length), numero: ++numeroGrupo, color, fichas, hero: heroDe(id, fichas), pagina: 0, paginasFichas: 1 },
    });
    // Los shows de cada ficha (por ejemplo, de cada princesa) y las dinámicas van justo después, cada uno con su foto.
    for (const s of delGrupo) {
      const variantes = s.opciones.filter((o) => o.tipo === "VARIANTE");
      if (variantes.length > 0) {
        const fichasShows = await Promise.all(
          variantes.map(async (o): Promise<FichaPdf> => ({
            id: o.id,
            nombre: o.nombre,
            descripcion: o.descripcion ?? "",
            incluye: [],
            duracion: null,
            edadIdeal: null,
            soloAdultos: false,
            masPedido: false,
            foto: await foto(`${s.nombre} · ${o.nombre}`, o.fotoUrl ?? s.fotoUrl),
            pagina: 0,
          }))
        );
        totalFichas += fichasShows.length;
        const idShows = `shows-${s.id}`;
        bloques.push({
          tipo: "grupo",
          grupo: {
            id: idShows,
            titulo: `${s.nombre} · todos los shows`,
            corto: s.nombre,
            lema: `Todos los shows · ${lemaDe(idShows, fichasShows.length)}`,
            numero: ++numeroGrupo,
            color,
            fichas: fichasShows,
            hero: heroDe(idShows, fichasShows),
            pagina: 0,
            paginasFichas: 1,
          },
        });
      }
      const dinamicas = s.opciones.filter((o) => o.tipo === "DINAMICA");
      if (dinamicas.length > 0) {
        bloques.push({
          tipo: "dinamicas",
          dinamicas: {
            id: s.id,
            titulo: `${s.nombre} · dinámicas`,
            color,
            items: dinamicas.map((o) => ({ nombre: o.nombre, descripcion: o.descripcion ?? "" })),
            pagina: 0,
          },
        });
      }
    }
  };

  for (const nombre of nombres) {
    const delaSeccion = servicios.filter((s) => s.categoria === nombre);
    const color = colorDe(nombre);
    if (nombre === "Personajes") {
      await agregarGrupo("personajes-infantiles", "Personajes · Infantiles", color, delaSeccion.filter((s) => s.subcategoria !== "Adultos"));
      await agregarGrupo("personajes-adultos", "Personajes · Adultos", color, delaSeccion.filter((s) => s.subcategoria === "Adultos"));
    } else {
      await agregarGrupo(clave(nombre), nombre, color, delaSeccion);
    }
  }

  const plan = planificar(bloques);
  const qrs = await Promise.all(
    numeros.map(async (n) => ({
      texto: formatTelefono(n),
      qr: await QRCode.toBuffer(buildWhatsAppLink(n, MENSAJE_PDF), { margin: 1, width: 360, color: { dark: "#0b0b0b", light: "#a8ff30" } }),
    }))
  );
  return {
    bloques,
    ...plan,
    totalFichas,
    telefonos: numeros.map(formatTelefono),
    qrs,
    logo: await readFile(path.join(process.cwd(), "public", "logo.png")),
    portada: await leer(path.join(DISENO, "portada.jpg")),
    bienvenida: await leer(path.join(DISENO, "bienvenida.jpg")),
    cierre: await leer(path.join(DISENO, "cierre.jpg")),
    seguidores: PERFIL_IG.seguidores,
    degradados: { abajo: await degradado("abajo"), arriba: await degradado("arriba"), derecha: await degradado("derecha"), velo: await degradado("velo") },
  };
}
