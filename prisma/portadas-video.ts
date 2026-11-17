import type { PrismaClient } from "@prisma/client";

// Portada (fotograma del video) y video corto en bucle de las tarjetas del catálogo.
// Para sumar una tarjeta: agregar su fila aquí y una migración igual a la de 20261117120000 (id = "pv_" + clave).
export const PORTADAS_VIDEO = [
  { clave: "galletas", nombre: "Estación de Galletas", foto: "/videos/estacion-galletas.jpg", video: "/videos/estacion-galletas.mp4" },
  { clave: "encanto", nombre: "Encanto", foto: "/videos/encanto-show.jpg", video: "/videos/encanto-show.mp4" },
  { clave: "campanita", nombre: "Campanita (Tinkerbell)", foto: "/videos/campanita-show.jpg", video: "/videos/campanita-show.mp4" },
  { clave: "lilo", nombre: "Lilo y Stitch", foto: "/videos/lilo-stitch-show.jpg", video: "/videos/lilo-stitch-show.mp4" },
  { clave: "hada", nombre: "Hada", foto: "/videos/hada-show.jpg", video: "/videos/hada-show.mp4" },
  { clave: "zootopia", nombre: "Zootopia", foto: "/videos/zootopia-show.jpg", video: "/videos/zootopia-show.mp4" },
  { clave: "sonic", nombre: "Show de Sonic", foto: "/videos/sonic-show.jpg", video: "/videos/sonic-show.mp4" },
  { clave: "minecraft", nombre: "Minecraft", foto: "/videos/minecraft-show.jpg", video: "/videos/minecraft-show.mp4" },
] as const;

/** Idempotente: pone la portada si falta y deja el video primero en la galería de la tarjeta. */
export async function aplicarPortadasVideo(prisma: PrismaClient) {
  let n = 0;
  for (const p of PORTADAS_VIDEO) {
    const s = await prisma.servicio.findFirst({ where: { nombre: p.nombre } });
    if (!s) continue;
    if (!s.fotoUrl) await prisma.servicio.update({ where: { id: s.id }, data: { fotoUrl: p.foto } });
    const ya = await prisma.servicioMedia.count({ where: { servicioId: s.id, url: p.video } });
    if (ya === 0) {
      await prisma.servicioMedia.create({ data: { id: `pv_${p.clave}`, servicioId: s.id, url: p.video, tipo: "VIDEO", poster: p.foto, orden: -10 } });
      n++;
    }
  }
  return n;
}
