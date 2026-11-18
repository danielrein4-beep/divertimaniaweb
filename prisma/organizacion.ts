import type { PrismaClient } from "@prisma/client";

// Organización del catálogo en 3 secciones (más "Todo", que no es una sección guardada):
//   Personajes · Servicios para tu fiesta · Celebraciones
// Es la lista maestra de qué tarjeta va en cada sección y en qué orden. La migración
// 20261118100000_organizar_catalogo se genera desde aquí y el seed la vuelve a aplicar al final.

export const SECCION_PERSONAJES = "Personajes";
export const SECCION_SERVICIOS = "Servicios para tu fiesta";
export const SECCION_CELEBRACIONES = "Celebraciones";

export const SECCIONES = [
  { nombre: SECCION_PERSONAJES, color: "#00e5ff" },
  { nombre: SECCION_SERVICIOS, color: "#a8ff30" },
  { nombre: SECCION_CELEBRACIONES, color: "#ff4fd8" },
] as const;

/** Lo más pedido primero y luego por familia (Disney, superhéroes, TV, videojuegos, fútbol, otros). */
export const PERSONAJES_INFANTILES = [
  "Princesas Disney", "Super Mario Bros", "Mickey Mouse", "Mickey y Minnie Mouse", "Minnie Mouse", "Casa de Mickey Mouse", "Show de Superhéroes",
  "Encanto", "Campanita (Tinkerbell)", "Hada", "Lilo y Stitch", "Zootopia", "Toy Story",
  "Spider-Man", "La Mujer Maravilla",
  "Show de Paw Patrol", "Peppa y George", "Plim Plim", "Show Granja de Zenón", "Blippi", "Muñecas LOL",
  "Show de Sonic", "Minecraft",
  "Messi", "Cristiano Ronaldo",
  "Luli Pampin", "Conejo de Pascua",
  "Bright Monsters", "Diverticandy", "Guerreras K-Pop", "La Casa de Papel",
];

export const PERSONAJES_ADULTOS = ["Bolas Disco", "Show LED", "Show según temática", "El Chacal de la Trompeta", "Neon Party", "Space Glitter", "Catrinas", "Robots", "Daft Punk", "Bailarinas Árabes", "Garotas", "Robots Tamboreros"];

export const SERVICIOS = [
  "Animación Infantil", "Espumanía", "Día de Piscina Infantil", "Diverti Artistas",
  "Pelotas Boom", "Pelotas Hámster", "Castillos Inflables", "Estación de Pulseras", "Estación de Galletas",
  "Estación de Cotufas", "Estación de Algodón de Azúcar", "Estación de Perros Calientes",
];

export const CELEBRACIONES = ["Baby Shower o Revelación de Género"];

export type Asignacion = { nombre: string; categoria: string; subcategoria: string | null; orden: number };

export const ASIGNACIONES: Asignacion[] = [
  ...PERSONAJES_INFANTILES.map((nombre, i) => ({ nombre, categoria: SECCION_PERSONAJES, subcategoria: "Infantiles", orden: i + 1 })),
  ...PERSONAJES_ADULTOS.map((nombre, i) => ({ nombre, categoria: SECCION_PERSONAJES, subcategoria: "Adultos", orden: PERSONAJES_INFANTILES.length + i + 1 })),
  ...SERVICIOS.map((nombre, i) => ({ nombre, categoria: SECCION_SERVICIOS, subcategoria: null, orden: i + 1 })),
  ...CELEBRACIONES.map((nombre, i) => ({ nombre, categoria: SECCION_CELEBRACIONES, subcategoria: null, orden: i + 1 })),
];

/** Idempotente: deja las 3 secciones y mueve cada tarjeta a la suya, en su orden. */
export async function organizarCatalogo(prisma: PrismaClient) {
  for (const [i, s] of SECCIONES.entries()) {
    const ya = await prisma.categoria.findFirst({ where: { nombre: s.nombre } });
    if (ya) await prisma.categoria.update({ where: { id: ya.id }, data: { color: s.color, orden: i } });
    else await prisma.categoria.create({ data: { nombre: s.nombre, color: s.color, orden: i } });
  }
  await prisma.categoria.deleteMany({ where: { nombre: { notIn: SECCIONES.map((s) => s.nombre) } } });
  let movidas = 0;
  for (const a of ASIGNACIONES) {
    const r = await prisma.servicio.updateMany({
      where: { nombre: a.nombre },
      data: { categoria: a.categoria, subcategoria: a.subcategoria, orden: a.orden },
    });
    movidas += r.count;
  }
  return movidas;
}
