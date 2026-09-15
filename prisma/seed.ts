import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Catálogo real de Divertimania (tomado de su catálogo de servicios oficial).
const servicios = [
  // Fiestas Infantiles
  {
    categoria: "Fiestas Infantiles",
    nombre: "Animación Infantil",
    descripcion:
      "Incluye sonido e iluminación (2 cornetas, DJ, micrófono y luces LED), 2 animadores, set de pintacaritas con glitter y Divertidance (hora loca, espuma y globos mil figuras).",
    fotoUrl: "/images/animacion-infantil-conejos.png",
  },
  {
    categoria: "Fiestas Infantiles",
    nombre: "Día de Piscina Infantil",
    descripcion:
      "Sonido e iluminación, 2 animadores a cargo de actividades dentro y fuera de la piscina, y Divertidance (hora loca, espuma y globos mil figuras).",
    fotoUrl: "/images/dia-piscina-espuma.png",
  },
  {
    categoria: "Fiestas Infantiles",
    nombre: "Diverti Artistas",
    descripcion:
      "¡Deja que tus niños exploren su creatividad! Puesto preparado con lámina de papel, delantal y cubre botas, pinceles, paleta y pinturas.",
    fotoUrl: "/images/diverti-artistas.png",
  },
  {
    categoria: "Fiestas Infantiles",
    nombre: "Espumanía",
    descripcion:
      "Único en la ciudad: cañón de espuma con 2 lanzamientos, 2 operadores y líquido especial. Ideal para días de piscina (requiere buen servicio eléctrico).",
    fotoUrl: "/images/espumania-foam.png",
  },

  // Baby Shower
  {
    categoria: "Baby Shower",
    nombre: "Baby Shower o Revelación de Género",
    descripcion:
      "Sonido e iluminación, 2 animadores encargados de juegos y dinámicas para los futuros padres y sus invitados, más la revelación de género: ¡en la dulce espera!",
    fotoUrl: "/images/baby-shower.png",
  },

  // Personajes
  {
    categoria: "Personajes",
    nombre: "Casa de Mickey Mouse",
    descripcion: "Mickey, Minnie, Pluto, Goofy, Donald y Daisy en tu fiesta.",
    fotoUrl: "/images/mickey-racer.jpg",
  },
  {
    categoria: "Personajes",
    nombre: "Toy Story",
    descripcion: "Buzz Lightyear, Woody y Jesse.",
  },
  {
    categoria: "Personajes",
    nombre: "Encanto",
    descripcion: "Mirabel, Isabella, Bruno, Pepa, Dolores, Luisa, Félix y La Abuela.",
  },
  {
    categoria: "Personajes",
    nombre: "Superhéroes",
    descripcion: "Capitán América, Spider-Man, Iron Man, Wonder Woman, Batman y Flash.",
    fotoUrl: "/images/superheroes.jpg",
  },
  {
    categoria: "Personajes",
    nombre: "Show de Paw Patrol",
    descripcion: "Ryder, Chase, Marshall, Rubble, Skye, Rodky y Zuma.",
  },
  {
    categoria: "Personajes",
    nombre: "Show Granja de Zenón",
    descripcion: "Vaca Loca, Batolito (Gallo) y León.",
  },
  {
    categoria: "Personajes",
    nombre: "Show de Sonic",
    descripcion: "Sonic y Amy Rose.",
  },
  {
    categoria: "Personajes",
    nombre: "Oso Cariñoso",
    descripcion: "El clásico Oso Cariñoso para tu evento.",
  },
  {
    categoria: "Personajes",
    nombre: "Conejo de Pascua",
    descripcion: "Perfecto para celebraciones de Semana Santa.",
  },
  {
    categoria: "Personajes",
    nombre: "Súper Mario",
    descripcion: "Mario, Luigi, Peach y Toad.",
    fotoUrl: "/images/fiestas-infantiles-mario.jpg",
  },
  {
    categoria: "Personajes",
    nombre: "Minecraft",
    descripcion: "Steve, Alex, Zombie, Esqueleto y Enderman.",
  },
  {
    categoria: "Personajes",
    nombre: "LOL Surprise",
    descripcion: "LOL Diva, LOL Unicornio y LOL Abeja.",
  },
  {
    categoria: "Personajes",
    nombre: "Luli Pampin",
    descripcion: "El personaje favorito de los más pequeños.",
  },
  {
    categoria: "Personajes",
    nombre: "Peppa y George",
    descripcion: "Peppa Pig y su hermano George.",
  },
  {
    categoria: "Personajes",
    nombre: "Blippi",
    descripcion: "Aprendizaje y diversión con Blippi.",
  },
  {
    categoria: "Personajes",
    nombre: "Barbie",
    descripcion: "La muñeca más famosa del mundo, en persona.",
  },
  {
    categoria: "Personajes",
    nombre: "Princesas Disney",
    descripcion:
      "Sirenita (Ariel, Sebastián, Úrsula), Aladdín (Jazmín, Genio, Jafar), Frozen (Elsa, Ana, Olaf), Aurora, Maléfica, Cenicienta, Blanca Nieves y Moana.",
    fotoUrl: "/images/frozen-olaf-elsa.jpg",
  },

  // Show para Adultos
  {
    categoria: "Show para Adultos",
    nombre: "El Chacal de la Trompeta",
    descripcion:
      "Sonido e iluminación, 1 animador y el Chacal de la Trompeta con karaoke incluido. Ideal para 15 años, matrimonios, grados, despedidas de solter@, último timbre y eventos corporativos.",
  },
  {
    categoria: "Show para Adultos",
    nombre: "Bolas Disco",
    descripcion: "Bailarines con cabezas de disco ball para una pista siempre encendida.",
    fotoUrl: "/images/bolas-disco-duo.jpg",
  },
  {
    categoria: "Show para Adultos",
    nombre: "Show según temática",
    descripcion:
      "Personajes a medida de tu fiesta temática: La Casa de Papel, Los Juegos del Calamar, DJ Marshmello y más, incluyendo producciones propias como shows K-pop o Catrinas.",
    fotoUrl: "/images/show-tematico-kpop.jpg",
  },
  {
    categoria: "Show para Adultos",
    nombre: "Stripper",
    descripcion: "Show sorpresa para despedidas y celebraciones entre adultos.",
  },

  // Estación Creativa
  {
    categoria: "Estación Creativa",
    nombre: "Estación Creativa",
    descripcion:
      "Elaboración de pulseras, decoración de galletas y decoración de perfumes. Espacio preparado para 8 puestos.",
    fotoUrl: "/images/diverti-artistas.png",
  },

  // Atracciones
  {
    categoria: "Atracciones",
    nombre: "Castillos Inflables",
    descripcion: "Castillo inflable 4x5 y castillo inflable 3x3.",
  },
  {
    categoria: "Atracciones",
    nombre: "Trampolines",
    descripcion: "Trampolín grande 4x4, mediano 3x3 y pequeño.",
  },
  {
    categoria: "Atracciones",
    nombre: "Carritos de Comida",
    descripcion: "Carrito de cotufas, carrito de perros calientes y carrito de algodones de azúcar.",
  },
  {
    categoria: "Atracciones",
    nombre: "Pelotas Boom",
    descripcion:
      "¡Vive la experiencia de jugar dentro de pelotas gigantes! Incluye operador y transporte. Se alquilan individualmente.",
    fotoUrl: "/images/pelotas-boom-rooftop.png",
  },
];

const recursos = [
  { nombre: "Traje Chacal de la Trompeta", tipo: "PERSONAJE", cantidadTotal: 1 },
  { nombre: "Set Bolas Disco", tipo: "EQUIPO", cantidadTotal: 2 },
  { nombre: "Cañón de Espuma", tipo: "EQUIPO", cantidadTotal: 1 },
  { nombre: "Castillo Inflable 4x5", tipo: "EQUIPO", cantidadTotal: 1 },
  { nombre: "Castillo Inflable 3x3", tipo: "EQUIPO", cantidadTotal: 2 },
  { nombre: "Trampolín 4x4", tipo: "EQUIPO", cantidadTotal: 1 },
  { nombre: "Equipo de sonido móvil", tipo: "EQUIPO", cantidadTotal: 3 },
  { nombre: "Personaje Casa de Mickey Mouse (set)", tipo: "PERSONAJE", cantidadTotal: 2 },
  { nombre: "Personaje Superhéroes (set)", tipo: "PERSONAJE", cantidadTotal: 2 },
  { nombre: "Personaje Princesas Disney (set)", tipo: "PERSONAJE", cantidadTotal: 2 },
  { nombre: "Animador", tipo: "PERSONAL", cantidadTotal: 6 },
  { nombre: "Operador de Cañón de Espuma", tipo: "PERSONAL", cantidadTotal: 2 },
];

async function main() {
  await prisma.eventoServicio.deleteMany();
  await prisma.eventoRecurso.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.servicio.deleteMany();
  await prisma.recurso.deleteMany();
  await prisma.solicitudContacto.deleteMany();
  await prisma.adminUser.deleteMany();

  for (const [i, s] of servicios.entries()) {
    await prisma.servicio.create({ data: { ...s, orden: i } });
  }

  for (const r of recursos) {
    await prisma.recurso.create({ data: r });
  }

  const passwordHash = await bcrypt.hash("divertimania2024", 10);
  await prisma.adminUser.create({
    data: { usuario: "admin", passwordHash },
  });

  console.log("Seed completado. Usuario admin: admin / divertimania2024");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
