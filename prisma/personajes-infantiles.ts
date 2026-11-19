import type { PrismaClient } from "@prisma/client";

// (Por ahora solo Princesas Disney tiene variantes, y viven en seed.ts: las demás fichas solo llevan «Agregar».)
// Personajes de la sección "Personajes Infantiles" en el orden en que se muestran
// (las princesas van dentro de «Princesas Disney»). Cada tarjeta trae sus variantes; el equipo puede
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
  descripcion?: string;
  foto?: string;
  soloOrden?: boolean;
  variantes?: Variante[];
}

const DESCRIPCION = "Elige cómo lo quieres para tu fiesta: solo, acompañado o con el show completo.";

export const PERSONAJES: PersonajeDef[] = [
  // Las princesas (Rapunzel, Cenicienta, Blancanieves, Bella, Ariel, Elsa) viven dentro de esta tarjeta,
  // una pestaña por princesa (ver seed.ts); no van sueltas para dejar el espacio a los demás personajes.
  { nombre: "Princesas Disney", soloOrden: true },
  {
    nombre: "Encanto",
  },
  {
    nombre: "Campanita (Tinkerbell)",
  },
  {
    nombre: "Hada",
  },
  {
    nombre: "Lilo y Stitch",
  },
  {
    nombre: "Zootopia",
  },
  {
    nombre: "Monsters Inc.",
  },
  {
    nombre: "Spider-Man",
    foto: "/images/spiderman.jpg",
  },
  {
    nombre: "La Mujer Maravilla",
    foto: "/images/mujer-maravilla.jpg",
  },
  {
    nombre: "Show de Superhéroes",
    desde: "Superhéroes",
  },
  {
    nombre: "Show de Paw Patrol",
  },
  {
    nombre: "Peppa y George",
  },
  { nombre: "Mickey Mouse", descripcion: "Trajes temáticos: casual, Halloween, navideño y graduación. Mickey en persona para tu fiesta, con baile, fotos y el momento de la torta. Dinos qué traje quieres." },
  { nombre: "Mickey y Minnie Mouse", descripcion: "Ambos con trajes temáticos: casual, Halloween, navideño y graduación. Mickey y Minnie juntos en tu fiesta, con baile, fotos y el momento de la torta. Dinos qué trajes quieres." },
  { nombre: "Minnie Mouse", foto: "/images/minnie.jpg", descripcion: "Con distintos trajes temáticos: casual, Halloween, navideño y de graduación. Minnie en persona para tu fiesta, con baile, fotos y el momento de la torta. Dinos qué traje quieres." },
  {
    nombre: "Casa de Mickey Mouse",
  },
  {
    nombre: "El Payaso",
  },
  {
    nombre: "Plim Plim",
  },
  {
    nombre: "Show Granja de Zenón",
  },
  {
    nombre: "Muñecas LOL",
    desde: "LOL Surprise",
  },
  {
    nombre: "Super Mario Bros",
    desde: "Súper Mario",
  },
  { nombre: "Neon Party", descripcion: "La diversión más vibrante y brillante para cualquier evento corporativo o evento de adultos." },
  { nombre: "Bright Monsters", descripcion: "Monstruos brillantes en cuatro colores: uno plateado, uno dorado, uno azul y uno morado." },
  { nombre: "Diverticandy", descripcion: "Diverticandy acompaña a tus niños durante toda la fiesta y les da los mejores caramelos. ¡Diversión y dulzura en un solo show!" },
  { nombre: "Space Glitter", descripcion: "Space Glitter son nuestras chicas que van a tu evento y le llenan de brillo la noche." },
  { nombre: "Guerreras K-Pop", descripcion: "Guerreras K-Pop: bailarinas con vestuario y coreografías de K-Pop que encienden la pista y se toman fotos con tus invitados." },
  { nombre: "Catrinas", descripcion: "Catrinas y Catrines, pueden ser mujeres u hombres, con el maquillaje y el vestuario más elegante del Día de Muertos. Reciben a tus invitados, sirven los tragos y llenan de misterio y color tu evento de adultos." },
  { nombre: "Robots", descripcion: "Robots para tu fiesta." },
  { nombre: "Daft Punk", descripcion: "Daft Punk en tu fiesta: dos robots con cascos brillantes que bailan, se toman fotos y ponen el ambiente en la pista." },
  { nombre: "La Casa de Papel", descripcion: "La Casa de Papel: los atracadores de overol rojo y máscara llegan a tu fiesta con baile, fotos y mucha acción." },
  { nombre: "Bailarinas Árabes", descripcion: "Bailarinas árabes con vestuario de ensueño y velos que sorprenden a tus invitados con su danza en cualquier evento." },
  { nombre: "Garotas", descripcion: "Garotas: bailarinas estilo carnaval, con plumas y brillos, que bailan y le ponen ritmo y color a tu evento." },
  { nombre: "Robots Tamboreros", descripcion: "Robots Tamboreros: robots con trajes de luces LED que tocan los tambores en vivo y animan tu evento con ritmo y show de luz." },
  { nombre: "Personajes de Pascua", descripcion: "Personajes de Pascua para tu fiesta: conejos y personajes con animación, baile y fotos para los pequeños." },
  { nombre: "Zombies", descripcion: "Zombies para tu evento: personajes caracterizados que recorren la fiesta, bailan y le dan un susto de buen humor a tus invitados." },
  { nombre: "Tequileras Biker", descripcion: "Tequileras estilo biker para darle ritmo y brillo a tu evento." },
  { nombre: "Elvis y Marilyn Monroe", descripcion: "Elvis y Marilyn Monroe en persona para tu evento: fotos, baile y mucho estilo." },
  { nombre: "Tequileras", descripcion: "Tequileras para tu evento." },
  { nombre: "Cristiano Ronaldo", descripcion: "Cristiano Ronaldo en persona, para jugar fútbol con los invitados y tomarse fotos en tu fiesta." },
  { nombre: "Messi", descripcion: "Messi en persona, para jugar fútbol con los invitados y tomarse fotos en tu fiesta." },
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
          descripcion: def.descripcion ?? DESCRIPCION,
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

  // El resto de personajes de la sección (Toy Story, Sonic…) queda después, en su orden.
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
