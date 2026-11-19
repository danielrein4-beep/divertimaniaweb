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
  /** Quita todo lo que tenía la tarjeta (fotos y videos anteriores) y deja solo estos videos. */
  reemplazar?: boolean;
}

export const PORTADAS_VIDEO: PortadaVideo[] = [
  { clave: "galletas", nombre: "Estación de Galletas", foto: "/videos/estacion-galletas.jpg", video: "/videos/estacion-galletas.mp4" },
  { clave: "encanto", nombre: "Encanto", foto: "/videos/encanto-show-v2.jpg", video: "/videos/encanto-show.mp4" },
  { clave: "campanita", nombre: "Campanita (Tinkerbell)", foto: "/videos/campanita-show.jpg", video: "/videos/campanita-show.mp4" },
  { clave: "lilo", nombre: "Lilo y Stitch", foto: "/videos/lilo-stitch-show.jpg", video: "/videos/lilo-stitch-show.mp4" },
  { clave: "hada", nombre: "Hada", foto: "/videos/hada-show.jpg", video: "/videos/hada-show.mp4" },
  { clave: "zootopia", nombre: "Zootopia", foto: "/videos/zootopia-show-4x5.jpg", video: "/videos/zootopia-show-4x5.mp4" },
  { clave: "sonic", nombre: "Show de Sonic", foto: "/videos/sonic-show-4x5.jpg", video: "/videos/sonic-show-4x5.mp4" },
  { clave: "minecraft", nombre: "Minecraft", foto: "/videos/minecraft-show.jpg", video: "/videos/minecraft-show.mp4" },
  { clave: "luli", nombre: "Luli Pampin", foto: "/videos/luli-pampin-show.jpg", video: "/videos/luli-pampin-show.mp4" },
  { clave: "cristiano", nombre: "Cristiano Ronaldo", foto: "/videos/cristiano-ronaldo-show.jpg", video: "/videos/cristiano-ronaldo-show.mp4" },
  { clave: "messi", nombre: "Messi", foto: "/videos/messi-show.jpg", video: "/videos/messi-show.mp4" },
  { clave: "spiderman", nombre: "Spider-Man", foto: "/videos/spiderman-show-4x5.jpg", video: "/videos/spiderman-show-4x5.mp4", reemplazar: true },
  { clave: "animacion", nombre: "Animación Infantil", foto: "/videos/animacion-infantil-show.jpg", video: "/videos/animacion-infantil-show.mp4", reemplazar: true },
  { clave: "espumania", nombre: "Espumanía", foto: "/videos/espumania-show.jpg", video: "/videos/espumania-show.mp4", reemplazar: true },
  { clave: "mario", nombre: "Super Mario Bros", foto: "/videos/mario-bros-show.jpg", video: "/videos/mario-bros-show.mp4", reemplazar: true },
  { clave: "hamster", nombre: "Pelotas Hámster", foto: "/videos/pelotas-hamster-show.jpg", video: "/videos/pelotas-hamster-show.mp4" },
  { clave: "mickey", nombre: "Mickey Mouse", foto: "/videos/mickey-show.jpg", video: "/videos/mickey-show.mp4", reemplazar: true },
  { clave: "mickey_minnie", nombre: "Mickey y Minnie Mouse", foto: "/videos/mickey-minnie-show.jpg", video: "/videos/mickey-minnie-show.mp4", reemplazar: true },
  { clave: "minnie", nombre: "Minnie Mouse", foto: "/videos/minnie-show.jpg", video: "/videos/minnie-show.mp4", reemplazar: true },
  { clave: "arabes", nombre: "Bailarinas Árabes", foto: "/videos/bailarinas-arabes-show-v2.jpg", video: "/videos/bailarinas-arabes-show.mp4" },
  { clave: "diverticandy", nombre: "Diverticandy", foto: "/videos/diverticandy-show-4x5.jpg", video: "/videos/diverticandy-show-4x5.mp4", reemplazar: true },
  { clave: "neon", nombre: "Neon Party", foto: "/videos/neon-party-show.jpg", video: "/videos/neon-party-show.mp4", reemplazar: true },
  { clave: "glitter", nombre: "Space Glitter", foto: "/videos/space-glitter-show.jpg", video: "/videos/space-glitter-show.mp4", reemplazar: true },
  { clave: "toy", nombre: "Toy Story", foto: "/videos/toy-story-1-4x5.jpg", videos: ["/videos/toy-story-1-4x5.mp4", "/videos/toy-story-2-4x5.mp4"], reemplazar: true },
  { clave: "bright", nombre: "Bright Monsters", foto: "/videos/bright-monsters-1.jpg", videos: ["/videos/bright-monsters-1-v2.mp4", "/videos/bright-monsters-2.mp4", "/videos/bright-monsters-3.mp4"], reemplazar: true },
  { clave: "kpop", nombre: "Guerreras K-Pop", foto: "/videos/guerreras-kpop-show.jpg", video: "/videos/guerreras-kpop-show.mp4", reemplazar: true },
  { clave: "garotas", nombre: "Garotas", foto: "/videos/garotas-show-v2.jpg", video: "/videos/garotas-show.mp4", reemplazar: true },
  { clave: "tamboreros", nombre: "Robots Tamboreros", foto: "/videos/robots-tamboreros-v2.jpg", videos: ["/videos/robots-tamboreros-2.mp4", "/videos/robots-tamboreros-1.mp4"], reemplazar: true },
  { clave: "casapapel", nombre: "La Casa de Papel", foto: "/videos/casa-de-papel-show.jpg", videos: ["/videos/casa-de-papel-show.mp4", "/videos/casa-de-papel-show-2.mp4"], reemplazar: true },
  { clave: "catrinas", nombre: "Catrinas", foto: "/videos/catrinas-show.jpg", video: "/videos/catrinas-show.mp4", reemplazar: true },
  { clave: "daftpunk", nombre: "Daft Punk", foto: "/videos/daft-punk-show.jpg", video: "/videos/daft-punk-show.mp4", reemplazar: true },
  { clave: "pascua", nombre: "Personajes de Pascua", foto: "/videos/personajes-pascua-show-v4.jpg", video: "/videos/personajes-pascua-show-v4.mp4", reemplazar: true },
  { clave: "zombies", nombre: "Zombies", foto: "/videos/zombies-show.jpg", video: "/videos/zombies-show.mp4", reemplazar: true },
  { clave: "princesas", nombre: "Princesas Disney", foto: "/videos/princesas-disney-show-v2.jpg", video: "/videos/princesas-disney-show-v2.mp4", reemplazar: true },
  { clave: "opcionesboda", nombre: "Opciones para tu boda", foto: "/videos/opciones-boda-show.jpg", video: "/videos/opciones-boda-show.mp4", reemplazar: true },
  { clave: "ultimotimbre", nombre: "Último Timbre", foto: "/videos/ultimo-timbre-show.jpg", video: "/videos/ultimo-timbre-show.mp4", reemplazar: true },
  { clave: "fogatadas", nombre: "Fogatadas", foto: "/videos/fogatadas-show.jpg", video: "/videos/fogatadas-show.mp4", reemplazar: true },
];

/** Idempotente: pone la portada si falta (o siempre, si reemplaza) y deja los videos primero en la galería de la tarjeta. */
export async function aplicarPortadasVideo(prisma: PrismaClient) {
  let n = 0;
  for (const p of PORTADAS_VIDEO) {
    const s = await prisma.servicio.findFirst({ where: { nombre: p.nombre } });
    if (!s) continue;
    if (p.reemplazar) {
      await prisma.servicio.update({ where: { id: s.id }, data: { fotoUrl: p.foto } });
      await prisma.servicioMedia.deleteMany({ where: { servicioId: s.id, url: { notIn: p.videos ?? (p.video ? [p.video] : []) } } });
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
