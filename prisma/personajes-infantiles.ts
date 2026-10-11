import type { PrismaClient } from "@prisma/client";

// Personajes de la sección "Personajes Infantiles" en el orden en que se muestran
// (las princesas van juntas). Cada tarjeta trae sus variantes; el equipo puede
// editarlas, reordenarlas y ponerles fotos desde /admin/catalogo.
//
// `desde`: nombre actual de una tarjeta que ya existía y se renombra (no se duplica).
// `soloOrden`: solo se reubica, no se le tocan las variantes.

export const CATEGORIA_PERSONAJES = "Personajes Infantiles";

interface Variante {
  nombre: string;
  foto?: string;
}

interface PersonajeDef {
  nombre: string;
  desde?: string;
  grupo?: string;
  foto?: string;
  soloOrden?: boolean;
  variantes?: Variante[];
}

const DESCRIPCION = "Elige cómo lo quieres para tu fiesta: solo, acompañado o con el show completo.";

export const PERSONAJES: PersonajeDef[] = [
  { nombre: "Princesas Disney", soloOrden: true },
  {
    nombre: "Cenicienta",
    foto: "/images/cenicienta.jpg",
    variantes: [{ nombre: "Cenicienta sola" }, { nombre: "Cenicienta con el Príncipe" }, { nombre: "Show de toda la película Cenicienta" }],
  },
  {
    nombre: "Blancanieves",
    variantes: [{ nombre: "Blancanieves sola" }, { nombre: "Blancanieves con el Príncipe" }, { nombre: "Show de toda la película Blancanieves" }],
  },
  {
    nombre: "Bella y la Bestia",
    foto: "/images/bella-y-bestia.png",
    variantes: [{ nombre: "Bella sola" }, { nombre: "Bella con la Bestia", foto: "/images/bella-y-bestia.png" }, { nombre: "Show de toda la película La Bella y la Bestia" }],
  },
  {
    nombre: "Rapunzel",
    foto: "/images/princesa-rapunzel.jpg",
    variantes: [
      { nombre: "Rapunzel sola", foto: "/images/princesa-rapunzel.jpg" },
      { nombre: "Rapunzel con Flynn Rider", foto: "/images/rapunzel-flynn.jpg" },
      { nombre: "Show de toda la película Rapunzel", foto: "/images/rapunzel-cumpleanos.png" },
    ],
  },
  {
    nombre: "Ariel",
    foto: "/images/sirenita-ursula-sebastian.jpg",
    variantes: [{ nombre: "Ariel sola" }, { nombre: "Ariel con el Príncipe Eric" }, { nombre: "Show de toda la película La Sirenita" }],
  },
  {
    nombre: "Elsa",
    foto: "/images/frozen-olaf-elsa.jpg",
    variantes: [{ nombre: "Elsa sola" }, { nombre: "Elsa y Anna" }, { nombre: "Elsa, Anna y Olaf" }, { nombre: "Show de toda la película Frozen" }],
  },
  {
    nombre: "Encanto",
    variantes: [{ nombre: "Mirabel sola" }, { nombre: "Mirabel con su familia" }, { nombre: "Show de toda la película Encanto" }],
  },
  {
    nombre: "Campanita (Tinkerbell)",
    variantes: [{ nombre: "Campanita sola" }, { nombre: "Campanita con Peter Pan" }, { nombre: "Show de toda la película Campanita" }],
  },
  {
    nombre: "Hada",
    variantes: [{ nombre: "Hada sola" }, { nombre: "Hadas con baile y dinámicas" }, { nombre: "Show de hadas completo" }],
  },
  {
    nombre: "Lilo y Stitch",
    variantes: [{ nombre: "Stitch solo" }, { nombre: "Lilo y Stitch" }, { nombre: "Show de toda la película Lilo y Stitch" }],
  },
  {
    nombre: "Zootopia",
    variantes: [{ nombre: "Judy Hopps sola" }, { nombre: "Judy Hopps y Nick Wilde" }, { nombre: "Show de toda la película Zootopia" }],
  },
  {
    nombre: "Monsters Inc.",
    variantes: [{ nombre: "Sulley solo" }, { nombre: "Mike y Sulley" }, { nombre: "Show de toda la película Monsters Inc." }],
  },
  {
    nombre: "Spider-Man",
    foto: "/images/spiderman.jpg",
    variantes: [{ nombre: "Spider-Man solo" }, { nombre: "Spider-Man con otros superhéroes" }, { nombre: "Show de superhéroes" }],
  },
  {
    nombre: "La Mujer Maravilla",
    foto: "/images/mujer-maravilla.jpg",
    variantes: [{ nombre: "La Mujer Maravilla sola" }, { nombre: "La Mujer Maravilla con otros superhéroes" }, { nombre: "Show de superhéroes" }],
  },
  {
    nombre: "Show de Superhéroes",
    desde: "Superhéroes",
    variantes: [{ nombre: "Un superhéroe" }, { nombre: "Varios superhéroes" }, { nombre: "Show de superhéroes completo" }],
  },
  {
    nombre: "Show de Paw Patrol",
    variantes: [{ nombre: "Un personaje de Paw Patrol" }, { nombre: "Varios personajes de Paw Patrol" }, { nombre: "Show completo de Paw Patrol" }],
  },
  {
    nombre: "Peppa y George",
    variantes: [{ nombre: "Peppa Pig sola" }, { nombre: "Peppa y George" }, { nombre: "Show completo de Peppa Pig" }],
  },
  {
    nombre: "Minnie Mouse",
    foto: "/images/minnie.jpg",
    variantes: [{ nombre: "Minnie sola" }, { nombre: "Minnie con Mickey" }, { nombre: "Show completo de Mickey y Minnie" }],
  },
  {
    nombre: "Casa de Mickey Mouse",
    variantes: [{ nombre: "Mickey solo" }, { nombre: "Mickey con Minnie" }, { nombre: "Show completo de la Casa de Mickey Mouse" }],
  },
  {
    nombre: "El Payaso",
    variantes: [{ nombre: "Payaso solo" }, { nombre: "Payaso con juegos y dinámicas" }, { nombre: "Show de payasos completo" }],
  },
  {
    nombre: "Plim Plim",
    variantes: [{ nombre: "Plim Plim solo" }, { nombre: "Plim Plim con sus amigos" }, { nombre: "Show completo de Plim Plim" }],
  },
  {
    nombre: "Show Granja de Zenón",
    variantes: [{ nombre: "Zenón solo" }, { nombre: "Zenón con los animales de la granja" }, { nombre: "Show completo de La Granja de Zenón" }],
  },
  {
    nombre: "Muñecas LOL",
    desde: "LOL Surprise",
    variantes: [{ nombre: "Una muñeca LOL" }, { nombre: "Grupo de muñecas LOL" }, { nombre: "Show completo de Muñecas LOL" }],
  },
  {
    nombre: "Super Mario Bros",
    desde: "Súper Mario",
    variantes: [{ nombre: "Mario solo" }, { nombre: "Mario y Luigi" }, { nombre: "Show completo de Super Mario Bros" }],
  },
];

/** Idempotente: crea lo que falta, renombra lo que ya existía y solo pone variantes a las tarjetas que no tienen. */
export async function aplicarPersonajesInfantiles(prisma: PrismaClient) {
  const usados: string[] = [];
  let creados = 0;
  let conVariantes = 0;

  for (const [i, def] of PERSONAJES.entries()) {
    const orden = 100 + i;
    let servicio =
      (await prisma.servicio.findFirst({ where: { nombre: def.nombre } })) ??
      (def.desde ? await prisma.servicio.findFirst({ where: { nombre: def.desde } }) : null);

    if (servicio) {
      servicio = await prisma.servicio.update({
        where: { id: servicio.id },
        data: {
          nombre: def.nombre,
          categoria: CATEGORIA_PERSONAJES,
          orden,
          ...(!servicio.fotoUrl && def.foto ? { fotoUrl: def.foto } : {}),
        },
      });
    } else {
      servicio = await prisma.servicio.create({
        data: {
          categoria: CATEGORIA_PERSONAJES,
          nombre: def.nombre,
          descripcion: DESCRIPCION,
          fotoUrl: def.foto ?? null,
          orden,
          ocasiones: "cumpleanos",
        },
      });
      creados++;
    }
    usados.push(servicio.id);

    if (def.soloOrden || !def.variantes) continue;
    const yaTiene = await prisma.opcion.count({ where: { servicioId: servicio.id } });
    if (yaTiene > 0) continue;
    await prisma.opcion.createMany({
      data: def.variantes.map((v, k) => ({
        servicioId: servicio.id,
        tipo: "VARIANTE",
        grupo: def.grupo ?? def.nombre,
        nombre: v.nombre,
        fotoUrl: v.foto ?? null,
        orden: k,
      })),
    });
    conVariantes++;
  }

  // El resto de personajes de la sección (Toy Story, Sonic, Barbie…) queda después, en su orden.
  const resto = await prisma.servicio.findMany({
    where: { categoria: CATEGORIA_PERSONAJES, id: { notIn: usados } },
    orderBy: { orden: "asc" },
    select: { id: true },
  });
  for (const [k, s] of resto.entries()) {
    await prisma.servicio.update({ where: { id: s.id }, data: { orden: 100 + PERSONAJES.length + k } });
  }

  return { creados, conVariantes, resto: resto.length };
}
