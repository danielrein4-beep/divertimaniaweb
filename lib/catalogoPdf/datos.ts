// Datos del catálogo PDF: lee lo mismo que muestra la web (secciones y servicios en el orden del
// panel) y prepara las fotos livianas para el PDF.
import path from "node:path";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { getCategorias } from "@/lib/categorias";
import { getConfigSitio } from "@/lib/configSitio";
import { buildWhatsAppLink, formatTelefono } from "@/lib/telefono";
import { UPLOADS_DIR } from "@/lib/uploads";

export type ServicioPdf = {
  id: string;
  nombre: string;
  descripcion: string;
  incluye: string[];
  duracion: string | null;
  edadIdeal: string | null;
  soloAdultos: boolean;
  masPedido: boolean;
  foto: Buffer | null;
};

export type SeccionPdf = { nombre: string; color: string; servicios: ServicioPdf[] };

export type CatalogoPdf = {
  secciones: SeccionPdf[];
  whatsappTexto: string;
  whatsappQr: Buffer;
  logo: Buffer;
};

const MENSAJE_PDF = "Hola Divertimania, vi su catálogo en PDF y quiero cotizar para mi evento.";

/** Lee la foto (de /public o de las subidas del panel) y la deja en JPEG chico para que el PDF pese poco. */
async function fotoLiviana(url: string | null): Promise<Buffer | null> {
  if (!url) return null;
  const ruta = url.startsWith("/media/")
    ? path.join(UPLOADS_DIR, path.basename(url))
    : path.join(process.cwd(), "public", path.normalize(url).replace(/^([/\\])+/, ""));
  try {
    const original = await readFile(ruta);
    return await sharp(original).resize(640, 480, { fit: "cover" }).flatten({ background: "#0b0b0b" }).jpeg({ quality: 72 }).toBuffer();
  } catch {
    return null;
  }
}

/** Filas que definen el PDF; si no cambian, el PDF guardado sigue sirviendo. */
export async function leerFilas() {
  const [categorias, servicios, config] = await Promise.all([
    getCategorias(),
    prisma.servicio.findMany({
      where: { activo: true, enPdf: true },
      orderBy: { orden: "asc" },
      select: {
        id: true, nombre: true, categoria: true, descripcion: true, incluye: true, duracion: true,
        edadIdeal: true, soloAdultos: true, masPedido: true, fotoUrl: true,
      },
    }),
    getConfigSitio(),
  ]);
  return { categorias, servicios, whatsapp: config.whatsapp };
}

export async function armarCatalogo(filas: Awaited<ReturnType<typeof leerFilas>>): Promise<CatalogoPdf> {
  const { categorias, servicios, whatsapp } = filas;
  const fotos = await Promise.all(servicios.map((s) => fotoLiviana(s.fotoUrl)));
  const porId = new Map(servicios.map((s, i) => [s.id, fotos[i]]));

  // Secciones en el orden del panel; las que no están en la lista de categorías van al final.
  const nombres = [...categorias.map((c) => c.nombre), ...new Set(servicios.map((s) => s.categoria))];
  const secciones: SeccionPdf[] = [...new Set(nombres)]
    .map((nombre) => ({
      nombre,
      color: categorias.find((c) => c.nombre === nombre)?.color ?? "#a8ff30",
      servicios: servicios
        .filter((s) => s.categoria === nombre)
        .map((s) => ({
          id: s.id,
          nombre: s.nombre,
          descripcion: s.descripcion,
          incluye: (s.incluye ?? "").split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 5),
          duracion: s.duracion,
          edadIdeal: s.edadIdeal,
          soloAdultos: s.soloAdultos,
          masPedido: s.masPedido,
          foto: porId.get(s.id) ?? null,
        })),
    }))
    .filter((s) => s.servicios.length > 0);

  const enlace = buildWhatsAppLink(whatsapp, MENSAJE_PDF);
  return {
    secciones,
    whatsappTexto: formatTelefono(whatsapp),
    whatsappQr: await QRCode.toBuffer(enlace, { margin: 1, width: 360, color: { dark: "#0b0b0b", light: "#ffffff" } }),
    logo: await readFile(path.join(process.cwd(), "public", "logo.png")),
  };
}
