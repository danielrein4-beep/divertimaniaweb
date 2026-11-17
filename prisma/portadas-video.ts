import type { PrismaClient } from "@prisma/client";

// Portada (fotograma del video) y video corto en bucle de las tarjetas del catálogo.
// Para sumar una tarjeta: agregar su fila aquí y una migración igual a la de 20261117120000 (id = "pv_" + clave).
interface PortadaVideo {
  clave: string;
  nombre: string;
  foto: string;
  video?: string;
  /** Varios videos: se reproducen en este orden, en bucle. Cada uno tiene su fotograma con el mismo nombre en .jpg. */
  videos?: string[];
  /** Quita las fotos que tenía la tarjeta y deja solo los videos. */
  reemplazar?: boolean;
}

export const PORTADAS_VIDEO: PortadaVideo[] = [
  { clave: "galletas", nombre: "Estación de Galletas", foto: "/videos/estacion-galletas.jpg", video: "/videos/estacion-galletas.mp4" },
  { clave: "encanto", nombre: "Encanto", foto: "/videos/encanto-show.jpg", video: "/videos/encanto-show.mp4" },
  { clave: "campanita", nombre: "Campanita (Tinkerbell)", foto: "/videos/campanita-show.jpg", video: "/videos/campanita-show.mp4" },
  { clave: "lilo", nombre: "Lilo y Stitch", foto: "/videos/lilo-stitch-show.jpg", video: "/videos/lilo-stitch-show.mp4" },
  { clave: "hada", nombre: "Hada", foto: "/videos/hada-show.jpg", video: "/videos/hada-show.mp4" },
  { clave: "zootopia", nombre: "Zootopia", foto: "/videos/zootopia-show.jpg", video: "/videos/zootopia-show.mp4" },
  { clave: "sonic", nombre: "Show de Sonic", foto: "/videos/sonic-show.jpg", video: "/videos/sonic-show.mp4" },
  { clave: "minecraft", nombre: "Minecraft", foto: "/videos/minecraft-show.jpg", video: "/videos/minecraft-show.mp4" },
  { clave: "luli", nombre: "Luli Pampin", foto: "/videos/luli-pampin-show.jpg", video: "/videos/luli-pampin-show.mp4" },
  { clave: "cristiano", nombre: "Cristiano Ronaldo", foto: "/videos/cristiano-ronaldo-show.jpg", video: "/videos/cristiano-ronaldo-show.mp4" },
  { clave: "messi", nombre: "Messi", foto: "/videos/messi-show.jpg", video: "/videos/messi-show.mp4" },
  { clave: "spiderman", nombre: "Spider-Man", foto: "/videos/spiderman-show.jpg", video: "/videos/spiderman-show.mp4", reemplazar: true },
  { clave: "animacion", nombre: "Animación Infantil", foto: "/videos/animacion-infantil-show.jpg", video: "/videos/animacion-infantil-show.mp4", reemplazar: true },
  { clave: "mario", nombre: "Super Mario Bros", foto: "/videos/mario-bros-show.jpg", video: "/videos/mario-bros-show.mp4", reemplazar: true },
  { clave: "toy", nombre: "Toy Story", foto: "/videos/toy-story-1.jpg", videos: ["/videos/toy-story-1.mp4", "/videos/toy-story-2.mp4"], reemplazar: true },
];

/** Idempotente: pone la portada si falta (o siempre, si reemplaza) y deja los videos primero en la galería de la tarjeta. */
export async function aplicarPortadasVideo(prisma: PrismaClient) {
  let n = 0;
  for (const p of PORTADAS_VIDEO) {
    const s = await prisma.servicio.findFirst({ where: { nombre: p.nombre } });
    if (!s) continue;
    if (p.reemplazar) {
      await prisma.servicio.update({ where: { id: s.id }, data: { fotoUrl: p.foto } });
      await prisma.servicioMedia.deleteMany({ where: { servicioId: s.id, tipo: "FOTO" } });
    } else if (!s.fotoUrl) {
      await prisma.servicio.update({ where: { id: s.id }, data: { fotoUrl: p.foto } });
    }
    const lista = p.videos ?? (p.video ? [p.video] : []);
    for (const [i, url] of lista.entries()) {
      const ya = await prisma.servicioMedia.count({ where: { servicioId: s.id, url } });
      if (ya > 0) continue;
      await prisma.servicioMedia.create({
        data: { id: i === 0 ? `pv_${p.clave}` : `pv_${p.clave}_${i + 1}`, servicioId: s.id, url, tipo: "VIDEO", poster: url.replace(/.mp4$/, ".jpg"), orden: -10 + i },
      });
      n++;
    }
  }
  return n;
}
