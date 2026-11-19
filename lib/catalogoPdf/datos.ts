// Datos del catálogo PDF: lee lo mismo que muestra la web (todas las fichas activas, con sus shows y dinámicas) y las
// organiza en grupos con una página fija por cada 3 fichas, para que el directorio del inicio sepa en qué página está cada una.
import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import sharp from "sharp";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { getCategorias } from "@/lib/categorias";
import { getConfigSitio, numerosWhatsApp } from "@/lib/configSitio";
import { buildWhatsAppLink, formatTelefono } from "@/lib/telefono";
import { UPLOADS_DIR } from "@/lib/uploads";

/** Cuántas fichas caben por página (una por fila, con su foto grande). */
export const FICHAS_POR_PAGINA = 3;
/** Dinámicas por página. */
export const DINAMICAS_POR_PAGINA = 8;
/** Líneas del directorio por página (dos columnas). */
export const LINEAS_DIRECTORIO = 92;

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
  color: string;
  fichas: FichaPdf[];
  /** Primera página del grupo y cuántas ocupa. */
  pagina: number;
  paginas: number;
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

export type CatalogoPdf = {
  bloques: BloquePdf[];
  directorio: LineaDirectorio[][];
  paginasDirectorio: number;
  totalFichas: number;
  whatsappTextoTodos: string;
  qrs: QrPdf[];
  logo: Buffer;
};

const MENSAJE_PDF = "Hola Divertimania, vi su catálogo en PDF y quiero cotizar para mi evento.";
const FOTOS_PDF = path.join(process.cwd(), "lib", "catalogoPdf", "fotos");

export const clave = (t: string) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Foto ya preparada (mejor fotograma del video, mejorada) o, si no hay, la de la ficha en JPEG liviano. */
async function foto(nombre: string, url: string | null): Promise<Buffer | null> {
  try {
    return await readFile(path.join(FOTOS_PDF, `${clave(nombre)}.jpg`));
  } catch {
    /* sin foto preparada: se usa la de la ficha */
  }
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
  const [categorias, servicios, config, fotosPreparadas] = await Promise.all([
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
  ]);
  return { categorias, servicios, whatsapp: config.whatsapp, numeros: numerosWhatsApp(config), fotosPreparadas };
}

type Filas = Awaited<ReturnType<typeof leerFilas>>;
type ServicioFila = Filas["servicios"][number];

const lineas = (texto: string | null) => (texto ?? "").split("\n").map((l) => l.trim()).filter(Boolean);

async function ficha(s: ServicioFila): Promise<FichaPdf> {
  return {
    id: s.id,
    nombre: s.nombre,
    descripcion: s.descripcion,
    incluye: lineas(s.incluye),
    duracion: s.duracion,
    edadIdeal: s.edadIdeal,
    soloAdultos: s.soloAdultos,
    masPedido: s.masPedido,
    foto: await foto(s.nombre, s.fotoUrl),
    pagina: 0,
  };
}

/** Reparte las páginas: portada (1), directorio (2…) y luego cada grupo con FICHAS_POR_PAGINA fichas por página. */
function planificar(bloques: BloquePdf[]) {
  const lineasDir: LineaDirectorio[] = [];
  const rellenar = (inicio: number) => {
    let pagina = inicio;
    lineasDir.length = 0;
    for (const b of bloques) {
      if (b.tipo === "grupo") {
        const g = b.grupo;
        g.pagina = pagina;
        g.paginas = Math.max(1, Math.ceil(g.fichas.length / FICHAS_POR_PAGINA));
        lineasDir.push({ tipo: "grupo", texto: g.titulo, pagina: g.pagina, destino: `g-${g.id}` });
        g.fichas.forEach((f, i) => {
          f.pagina = g.pagina + Math.floor(i / FICHAS_POR_PAGINA);
          lineasDir.push({ tipo: "ficha", texto: f.nombre, pagina: f.pagina, destino: `f-${g.id}-${f.id}` });
        });
        pagina += g.paginas;
      } else {
        const d = b.dinamicas;
        d.pagina = pagina;
        lineasDir.push({ tipo: "grupo", texto: d.titulo, pagina: d.pagina, destino: `d-${d.id}` });
        pagina += Math.max(1, Math.ceil(d.items.length / DINAMICAS_POR_PAGINA));
      }
    }
  };
  rellenar(3);
  const paginasDirectorio = Math.max(1, Math.ceil(lineasDir.length / LINEAS_DIRECTORIO));
  rellenar(2 + paginasDirectorio);
  const directorio: LineaDirectorio[][] = [];
  for (let i = 0; i < lineasDir.length; i += LINEAS_DIRECTORIO) directorio.push(lineasDir.slice(i, i + LINEAS_DIRECTORIO));
  return { directorio, paginasDirectorio };
}

export async function armarCatalogo(filas: Filas): Promise<CatalogoPdf> {
  const { categorias, servicios, numeros } = filas;
  const colorDe = (nombre: string) => categorias.find((c) => c.nombre === nombre)?.color ?? "#a8ff30";

  // Secciones en el orden del panel; las que no están en la lista de categorías van al final.
  const nombres = [...new Set([...categorias.map((c) => c.nombre), ...servicios.map((s) => s.categoria)])];
  const bloques: BloquePdf[] = [];
  let totalFichas = 0;

  const agregarGrupo = async (id: string, titulo: string, color: string, delGrupo: ServicioFila[]) => {
    if (delGrupo.length === 0) return;
    const fichas = await Promise.all(delGrupo.map(ficha));
    totalFichas += fichas.length;
    bloques.push({ tipo: "grupo", grupo: { id, titulo, color, fichas, pagina: 0, paginas: 1 } });
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
        bloques.push({
          tipo: "grupo",
          grupo: { id: `shows-${s.id}`, titulo: `${s.nombre} · todos los shows`, color, fichas: fichasShows, pagina: 0, paginas: 1 },
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
      qr: await QRCode.toBuffer(buildWhatsAppLink(n, MENSAJE_PDF), { margin: 1, width: 360, color: { dark: "#0b0b0b", light: "#ffffff" } }),
    }))
  );
  return {
    bloques,
    ...plan,
    totalFichas,
    whatsappTextoTodos: numeros.map(formatTelefono).join("  ·  "),
    qrs,
    logo: await readFile(path.join(process.cwd(), "public", "logo.png")),
  };
}
