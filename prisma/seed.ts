import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Catálogo real de Divertimania enriquecido con campos de metadatos, fotos, videos y etiquetas.
// NOTA IMPORTANTE: Los flags 'destacado' y 'masPedido' se asignaron inicialmente a los servicios con mejor material fotográfico/audiovisual; deben ser confirmados o ajustados por los dueños de Divertimania.

interface ServicioSeed {
  categoria: string;
  nombre: string;
  descripcion: string;
  fotoUrl?: string;
  incluye?: string;
  edadIdeal?: string;
  duracion?: string;
  masPedido?: boolean;
  destacado?: boolean;
  soloAdultos?: boolean;
  ocasiones?: string; // cumpleanos, baby-shower, quince, boda, corporativo, graduacion, navidad
  combinaCon?: string;
}

const servicios: ServicioSeed[] = [
  // Fiestas Infantiles
  {
    categoria: "Fiestas Infantiles",
    nombre: "Animación Infantil",
    descripcion:
      "Incluye sonido e iluminación (2 cornetas, DJ, micrófono y luces LED), 2 animadores, set de pintacaritas con glitter y Divertidance (hora loca, espuma y globos mil figuras).",
    fotoUrl: "/images/animacion-infantil-conejos.png",
    incluye: "Sonido profesional e iluminación con DJ en vivo\n2 animadores dinámicos\nSet completo de pintacaritas con glitter\nDivertidance con hora loca, espuma y globos mil figuras\nJuegos de integración y concursos por edades",
    edadIdeal: "3 a 12 años",
    duracion: "3 horas",
    masPedido: true,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos,graduacion,navidad",
  },
  {
    categoria: "Fiestas Infantiles",
    nombre: "Día de Piscina Infantil",
    descripcion:
      "Sonido e iluminación, 2 animadores a cargo de actividades dentro y fuera de la piscina, y Divertidance (hora loca, espuma y globos mil figuras).",
    fotoUrl: "/images/dia-piscina-espuma.png",
    incluye: "Sonido móvil e iluminación para exteriores\n2 recreadores acuáticos certificados\nDinámicas dentro y fuera de la alberca\nDivertidance playero con cañón de espuma\nGloboflexia acuática y juegos acuáticos",
    edadIdeal: "4 a 14 años",
    duracion: "3 horas",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos,graduacion",
  },
  {
    categoria: "Fiestas Infantiles",
    nombre: "Diverti Artistas",
    descripcion:
      "¡Deja que tus niños exploren su creatividad! Puesto preparado con lámina de papel, delantal y cubre botas, pinceles, paleta y pinturas.",
    fotoUrl: "/images/diverti-artistas.png",
    incluye: "Puestos individuales con caballetes y láminas\nDelantal lavable y cubrebotas protectores\nPinturas lavables no tóxicas, pinceles y paletas\nGuía personalizada por recreador artístico\nCada niño se lleva su obra de arte a casa",
    edadIdeal: "3 a 10 años",
    duracion: "2 horas",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos,corporativo",
  },
  {
    categoria: "Fiestas Infantiles",
    nombre: "Espumanía",
    descripcion:
      "Único en la ciudad: cañón de espuma con 2 lanzamientos, 2 operadores y líquido especial. Ideal para días de piscina (requiere buen servicio eléctrico).",
    fotoUrl: "/images/espumania-foam.png",
    incluye: "Cañón de alta potencia Divertimania\n2 lanzamientos masivos de espuma blanca hipoalergénica\n2 operadores técnicos en sitio\nLíquido especial biodegradable y no irritante\nMusicalización especial durante la descarga",
    edadIdeal: "Todas las edades",
    duracion: "45 minutos",
    masPedido: true, // Confirmar por dueños
    destacado: true, // Confirmar por dueños
    soloAdultos: false,
    ocasiones: "cumpleanos,quince,graduacion",
  },

  // Baby Shower
  {
    categoria: "Baby Shower",
    nombre: "Baby Shower o Revelación de Género",
    descripcion:
      "Sonido e iluminación, 2 animadores encargados de juegos y dinámicas para los futuros padres y sus invitados, más la revelación de género: ¡en la dulce espera!",
    fotoUrl: "/images/baby-shower.png",
    incluye: "Sonido profesional y micrófono para la animación\n2 recreadores especializados en ambiente familiar\nSelección de 7+ dinámicas interactivas y emotivas\nMomento especial para la revelación de género o apertura de regalos\nMusicalización temática durante todo el evento",
    edadIdeal: "Adultos y familia",
    duracion: "2.5 horas",
    masPedido: true,
    destacado: false,
    soloAdultos: false,
    ocasiones: "baby-shower",
  },

  // Personajes
  {
    categoria: "Personajes",
    nombre: "Casa de Mickey Mouse",
    descripcion: "Mickey, Minnie, Pluto, Goofy, Donald y Daisy en tu fiesta.",
    fotoUrl: "/images/mickey-racer.jpg",
    incluye: "Personajes oficiales con vestuario impecable\nSesión de fotos familiares y momento de la torta\nCoreografía y baile temático infantil\nAcompañamiento en piñata y corte de torta",
    edadIdeal: "1 a 6 años",
    duracion: "1 hora",
    masPedido: true,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos,navidad",
  },
  {
    categoria: "Personajes",
    nombre: "Toy Story",
    descripcion: "Buzz Lightyear, Woody y Jesse.",
    fotoUrl: "/images/toy-story-buzz.jpg",
    incluye: "Aparición de personajes temáticos\nBaile espacial con Woody y Buzz\nSesión fotográfica con invitados\nMomento especial para cantarle el cumpleaños",
    edadIdeal: "2 a 8 años",
    duracion: "1 hora",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos",
  },
  {
    categoria: "Personajes",
    nombre: "Encanto",
    descripcion: "Mirabel, Isabella, Bruno, Pepa, Dolores, Luisa, Félix y La Abuela.",
    incluye: "Personajes caracterizados con traje tradicional\nBaile musical con las canciones de la película\nDinámica familiar y momento de fotos",
    edadIdeal: "3 a 9 años",
    duracion: "1 hora",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos",
  },
  {
    categoria: "Personajes",
    nombre: "Superhéroes",
    descripcion: "Capitán América, Spider-Man, Iron Man, Wonder Woman, Batman y Flash.",
    fotoUrl: "/images/superheroes.jpg",
    incluye: "Entrada triunfal con efectos de sonido\nEntrenamiento superheroico interactivo para los niños\nBatalla simulada y sesión fotográfica heroica",
    edadIdeal: "3 a 10 años",
    duracion: "1 hora",
    masPedido: true,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos",
  },
  {
    categoria: "Personajes",
    nombre: "Show de Paw Patrol",
    descripcion: "Ryder, Chase, Marshall, Rubble, Skye, Rodky y Zuma.",
    fotoUrl: "/images/paw-patrol-grupo.jpg",
    incluye: "Patrulla canina en vivo\nMisión interactiva con los niños invitados\nFotos grupales y momento de la torta",
    edadIdeal: "2 a 6 años",
    duracion: "1 hora",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos",
  },
  {
    categoria: "Personajes",
    nombre: "Show Granja de Zenón",
    descripcion: "Vaca Loca, Batolito (Gallo) y León.",
    fotoUrl: "/images/granja-zenon.jpg",
    incluye: "Personajes musicales de la granja\nRonda infantil con canciones tradicionales\nAnimación tierna para los más pequeñitos",
    edadIdeal: "1 a 4 años",
    duracion: "1 hora",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos",
  },
  {
    categoria: "Personajes",
    nombre: "Show de Sonic",
    descripcion: "Sonic y Amy Rose.",
    incluye: "Carrera de velocidad y retos con Sonic\nMúsica temática del videojuego\nSesión de fotos y acompañamiento en pastel",
    edadIdeal: "4 a 11 años",
    duracion: "1 hora",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos",
  },
  {
    categoria: "Personajes",
    nombre: "Oso Cariñoso",
    descripcion: "El clásico Oso Cariñoso para tu evento.",
    incluye: "Abrazo gigante y sesión fotográfica\nEntrada sorpresa y acompañamiento infantil",
    edadIdeal: "1 a 5 años",
    duracion: "1 hora",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos,baby-shower",
  },
  {
    categoria: "Personajes",
    nombre: "Conejo de Pascua",
    descripcion: "Perfecto para celebraciones de Semana Santa y eventos primaverales.",
    fotoUrl: "/images/pascua-conejos-recreacion.png",
    incluye: "Conejo de Pascua de cuerpo completo\nBúsqueda guiada de huevitos de pascua\nSesión de fotos familiares y entrega de sorpresas",
    edadIdeal: "2 a 8 años",
    duracion: "1 hora",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos,corporativo",
  },
  {
    categoria: "Personajes",
    nombre: "Súper Mario",
    descripcion: "Mario, Luigi, Peach y Toad.",
    fotoUrl: "/images/fiestas-infantiles-mario.jpg",
    incluye: "Mario Bros en vivo con su vestuario icónico\nRetos de mini-juegos temáticos tipo Nintendo\nFotos con cada niño y acompañamiento a cantar el cumpleaños",
    edadIdeal: "3 a 12 años",
    duracion: "1 hora",
    masPedido: true, // Confirmar por dueños
    destacado: true, // Confirmar por dueños
    soloAdultos: false,
    ocasiones: "cumpleanos",
  },
  {
    categoria: "Personajes",
    nombre: "Minecraft",
    descripcion: "Steve, Alex, Zombie, Esqueleto y Enderman.",
    incluye: "Personajes pixelados gigantes\nConstrucción y retos gamer interactivos\nMomento de fotos gamer",
    edadIdeal: "5 a 12 años",
    duracion: "1 hora",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos",
  },
  {
    categoria: "Personajes",
    nombre: "LOL Surprise",
    descripcion: "LOL Diva, LOL Unicornio y LOL Abeja.",
    fotoUrl: "/images/lol-surprise.jpg",
    incluye: "Muñecas gigantes con vestidos brillantes\nPasarela de moda infantil interactiva\nFotos y baile glam",
    edadIdeal: "3 a 8 años",
    duracion: "1 hora",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos",
  },
  {
    categoria: "Personajes",
    nombre: "Luli Pampin",
    descripcion: "El personaje favorito de los más pequeños.",
    incluye: "Cosplay exacto de superheroína Luli\nCoreografías de sus éxitos musicales más conocidos\nInteracción tierna para la primera infancia",
    edadIdeal: "1 a 5 años",
    duracion: "1 hora",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos",
  },
  {
    categoria: "Personajes",
    nombre: "Peppa y George",
    descripcion: "Peppa Pig y su hermano George.",
    fotoUrl: "/images/peppa-george.jpg",
    incluye: "Presencia de los dos cerditos favoritos\nCanciones infantiles y saltos en charcos de barro (juego)\nFotos familiares",
    edadIdeal: "1 a 4 años",
    duracion: "1 hora",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos",
  },
  {
    categoria: "Personajes",
    nombre: "Blippi",
    descripcion: "Aprendizaje y diversión con Blippi.",
    fotoUrl: "/images/blippi.jpg",
    incluye: "Animador caracterizado como Blippi\nJuegos de curiosidad y aprendizaje activo\nCanciones icónicas y baile de la excavadora",
    edadIdeal: "2 a 6 años",
    duracion: "1 hora",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos",
  },
  {
    categoria: "Personajes",
    nombre: "Barbie",
    descripcion: "La muñeca más famosa del mundo, en persona.",
    incluye: "Personificación elegante de Barbie\nCaja de muñeca tamaño real para fotos (consultar disponibilidad)\nDesfile y coreografía con las niñas",
    edadIdeal: "4 a 10 años",
    duracion: "1 hora",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos",
  },
  {
    categoria: "Personajes",
    nombre: "Princesas Disney",
    descripcion:
      "Sirenita (Ariel, Sebastián, Úrsula), Aladdín (Jazmín, Genio, Jafar), Frozen (Elsa, Ana, Olaf), Aurora, Maléfica, Cenicienta, Blanca Nieves y Moana.",
    fotoUrl: "/images/princesas-disney-grupo.jpg",
    incluye: "Princesas en trajes de gala de alta costura teatral\nVals de la princesa con la cumpleañera\nMomento mágico de coronación\nSesión de fotos de ensueño",
    edadIdeal: "2 a 9 años",
    duracion: "1 hora",
    masPedido: true, // Confirmar por dueños
    destacado: true, // Confirmar por dueños
    soloAdultos: false,
    ocasiones: "cumpleanos,quince",
  },
  {
    categoria: "Personajes",
    nombre: "Plim Plim",
    descripcion: "Show del payaso Plim Plim para los más pequeños de la casa.",
    fotoUrl: "/images/plim-plim-animacion.png",
    incluye: "Personaje oficial del Payaso Plim Plim\nCanciones de valores y amistad\nFotos y momento especial en la torta",
    edadIdeal: "1 a 5 años",
    duracion: "1 hora",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos",
  },

  // Show para Adultos
  {
    categoria: "Show para Adultos",
    nombre: "El Chacal de la Trompeta",
    descripcion:
      "Sonido e iluminación, 1 animador y el Chacal de la Trompeta con karaoke incluido. Ideal para 15 años, matrimonios, grados, despedidas de solter@, último timbre y eventos corporativos.",
    incluye: "Sonido profesional y micrófono inalámbrico\nAnimador presentador de show cómico\nPersonaje del Chacal con trompeta real y hacha cómica\nPista de karaoke interactiva con los invitados\nPremios simbólicos y castigos humorísticos",
    edadIdeal: "Jóvenes y adultos",
    duracion: "1.5 horas",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "quince,boda,corporativo,graduacion",
  },
  {
    categoria: "Show para Adultos",
    nombre: "Bolas Disco",
    descripcion: "Bailarines con cabezas de disco ball para una pista siempre encendida.",
    fotoUrl: "/images/bolas-disco-duo.jpg",
    incluye: "2 bailarines profesionales con máscaras de espejos reflectantes\nCoreografía de apertura de hora loca\nInteracción en pista para motivar a todos los invitados a bailar\nEfectos visuales con luces y láseres",
    edadIdeal: "Adolescentes y adultos",
    duracion: "45 minutos",
    masPedido: true, // Confirmar por dueños
    destacado: true, // Confirmar por dueños
    soloAdultos: false,
    ocasiones: "quince,boda,corporativo,graduacion",
  },
  {
    categoria: "Show para Adultos",
    nombre: "Show según temática",
    descripcion:
      "Personajes a medida de tu fiesta temática: La Casa de Papel, Los Juegos del Calamar, DJ Marshmello y más, incluyendo producciones propias como shows K-pop o Catrinas.",
    fotoUrl: "/images/show-tematico-kpop.jpg",
    incluye: "Diseño conceptual según la temática de la fiesta\nElenco de bailarines con vestuario y caracterización\nGuión y música editada a medida\nImpacto visual de alto nivel",
    edadIdeal: "Todas las edades",
    duracion: "1 hora",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos,quince,boda,corporativo,graduacion",
  },
  {
    categoria: "Show para Adultos",
    nombre: "Show LED",
    descripcion: "Bailarines con trajes, aros y luces LED para encender la pista.",
    fotoUrl: "/images/show-led-hoop.jpg",
    incluye: "Bailarines y anfitriones con trajes LED de última generación\nAro de luz futurista y gafas luminosas\nVaras de luz neón para los invitados a la pista\nShow visual impactante para bodas y 15 años",
    edadIdeal: "Jóvenes y adultos",
    duracion: "1 hora",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "quince,boda,corporativo",
  },
  {
    categoria: "Show para Adultos",
    nombre: "Stripper",
    descripcion: "Show sorpresa para despedidas y celebraciones entre adultos.",
    incluye: "Bailarín profesional\nCoreografía y música temática\nInteracción cuidada y respetuosa según el evento",
    edadIdeal: "Exclusivo +18",
    duracion: "45 minutos",
    masPedido: false,
    destacado: false,
    soloAdultos: true,
    ocasiones: "",
  },

  // Estación Creativa
  {
    categoria: "Estación Creativa",
    nombre: "Estación Creativa",
    descripcion:
      "Elaboración de pulseras, decoración de galletas y decoración de perfumes. Espacio preparado para 8 puestos.",
    fotoUrl: "/images/diverti-artistas.png",
    incluye: "Mobiliario y mantelería para 8 puestos de trabajo\nMateriales premium de bisutería, repostería o perfumería\nRecreadora especialista a cargo del taller\nCajas o empaques de regalo para cada creación",
    edadIdeal: "4 a 14 años",
    duracion: "2 horas",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos,baby-shower,corporativo",
  },

  // Atracciones
  {
    categoria: "Atracciones",
    nombre: "Castillos Inflables",
    descripcion: "Castillo inflable 4x5 y castillo inflable 3x3.",
    fotoUrl: "/images/castillo-inflable.jpg",
    incluye: "Inflable limpio y sanitizado en óptimas condiciones\nMotor soplador de aire continuo y extensiones eléctricas\nOperador de seguridad y control de turnos durante todo el evento",
    edadIdeal: "2 a 10 años",
    duracion: "3 a 4 horas",
    masPedido: true,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos,graduacion,corporativo",
  },
  {
    categoria: "Atracciones",
    nombre: "Trampolines",
    descripcion: "Trampolín grande 4x4, mediano 3x3 y pequeño.",
    incluye: "Cama elástica con red perimetral de seguridad\nProtector acolchado en resortes\nOperador responsable del cuidado y acceso por turnos",
    edadIdeal: "3 a 12 años",
    duracion: "3 a 4 horas",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos,corporativo",
  },
  {
    categoria: "Atracciones",
    nombre: "Carritos de Comida",
    descripcion: "Carrito de cotufas, carrito de perros calientes y carrito de algodones de azúcar.",
    incluye: "Carritos temáticos decorativos vintage\nOperador debidamente uniformado con normas de higiene\nInsumos frescos para porciones acordadas (cotufas, algodón o perros calientes)\nServicio continuo durante el tiempo contratado",
    edadIdeal: "Todas las edades",
    duracion: "2 a 3 horas",
    masPedido: false,
    destacado: false,
    soloAdultos: false,
    ocasiones: "cumpleanos,quince,boda,corporativo",
  },
  {
    categoria: "Atracciones",
    nombre: "Pelotas Boom",
    descripcion:
      "¡Vive la experiencia de jugar dentro de pelotas gigantes! Incluye operador y transporte. Se alquilan individualmente.",
    fotoUrl: "/images/pelotas-boom-rooftop.png",
    incluye: "Pelotas inflables gigantes de choque y rodada\nOperador técnico y coordinador de retos\nTransporte y montaje en locación\nDinámica de carreras y minitorneo",
    edadIdeal: "6 a 16 años",
    duracion: "2 horas",
    masPedido: true, // Confirmar por dueños
    destacado: true, // Confirmar por dueños
    soloAdultos: false,
    ocasiones: "cumpleanos,graduacion,corporativo",
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
  await prisma.servicioMedia.deleteMany();
  await prisma.opcion.deleteMany();
  await prisma.servicio.deleteMany();
  await prisma.recurso.deleteMany();
  await prisma.recreador.deleteMany();
  await prisma.novedad.deleteMany();
  await prisma.solicitudContacto.deleteMany();
  await prisma.adminUser.deleteMany();

  const recreadoresData = [
    {
      nombre: "Juan Sandía",
      cargo: "DJ, Representante & Organizador",
      descripcion: "DJ oficial y representante de Divertimania. Especialista en montaje de sonido, iluminación y coordinación integral de eventos.",
      fotoUrl: "/images/juan-sandia.png",
      orden: 0,
      activo: true,
    },
    {
      nombre: "Eylimar Alviares",
      cargo: "Representante, Recreadora & Organizadora",
      descripcion: "Representante de Divertimania, especialista en recreación infantil y coordinación logística para celebraciones de alto nivel.",
      fotoUrl: "/images/eylimar-alviares.png",
      orden: 1,
      activo: true,
    },
    {
      nombre: "Nano Uscategui",
      cargo: "Animador & Recreador Infantil / Adultos",
      descripcion: "Animación versátil para niños y adultos, dinámicas de integración, juegos recreativos y animación musical.",
      fotoUrl: "/images/nano-uscategui.png",
      orden: 2,
      activo: true,
    },
    {
      nombre: "Ricardo Ayala",
      cargo: "Animador de Adultos, Últimos Timbres & Bailarín",
      descripcion: "Showman especializado en fiestas de 15 años, últimos timbres, graduaciones y animación coreográfica de alto impacto.",
      fotoUrl: "/images/ricardo-ayala.png",
      orden: 3,
      activo: true,
    },
  ];

  for (const rec of recreadoresData) {
    await prisma.recreador.create({ data: rec });
  }

  // Insertar novedades (incluyendo Novedad navideña 2026 para banner de temporada)
  await prisma.novedad.create({
    data: {
      badge: "Temporada 2026",
      titulo: "Shows navideños 2026",
      descripcion: "Mickey y Minnie vestidos de Navidad con duendes y animación especial de fin de año. ¡Aparta tu fecha con anticipación!",
      fotoUrl: "/images/mickey-navidad-show.png",
      ctaTexto: "Consultar fecha navideña",
      ctaUrl: "/catalogo?ocasion=navidad",
      activo: true,
      fechaInicio: new Date("2026-10-01T00:00:00.000Z"),
      fechaFin: new Date("2027-01-15T23:59:59.000Z"),
      orden: 0,
    },
  });

  // Guardar servicios
  const createdServices: Record<string, string> = {};
  for (const [i, s] of servicios.entries()) {
    const serv = await prisma.servicio.create({ data: { ...s, orden: i } });
    createdServices[serv.nombre] = serv.id;
  }

  // Configurar combinaCon entre servicios
  const combos: Record<string, string[]> = {
    "Animación Infantil": ["Casa de Mickey Mouse", "Castillos Inflables", "Espumanía"],
    "Día de Piscina Infantil": ["Espumanía", "Pelotas Boom", "Animación Infantil"],
    "Espumanía": ["Día de Piscina Infantil", "Bolas Disco", "Pelotas Boom"],
    "Princesas Disney": ["Animación Infantil", "Estación Creativa", "Castillos Inflables"],
    "Súper Mario": ["Animación Infantil", "Castillos Inflables", "Pelotas Boom"],
    "Bolas Disco": ["Show LED", "El Chacal de la Trompeta", "Espumanía"],
    "Show LED": ["Bolas Disco", "Show según temática", "El Chacal de la Trompeta"],
    "Baby Shower o Revelación de Género": ["Estación Creativa", "Carritos de Comida", "Oso Cariñoso"],
    "Pelotas Boom": ["Espumanía", "Castillos Inflables", "Día de Piscina Infantil"],
  };

  for (const [nombre, relatedNames] of Object.entries(combos)) {
    const currentId = createdServices[nombre];
    if (currentId) {
      const ids = relatedNames.map(rn => createdServices[rn]).filter(Boolean);
      await prisma.servicio.update({
        where: { id: currentId },
        data: { combinaCon: ids.join(",") },
      });
    }
  }

  // Opciones y variantes de Princesas Disney (con fotos de opciones asignadas)
  const princesasId = createdServices["Princesas Disney"];
  if (princesasId) {
    await prisma.opcion.createMany({
      data: [
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Rapunzel", nombre: "Rapunzel sola", descripcion: "Solo el personaje de Rapunzel para fotos, baile y coronación.", fotoUrl: "/images/princesa-rapunzel.jpg", orden: 0 },
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Rapunzel", nombre: "Rapunzel con el príncipe", descripcion: "Rapunzel acompañada de Flynn / el príncipe.", fotoUrl: "/images/rapunzel-cumpleanos.png", orden: 1 },
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Rapunzel", nombre: "Rapunzel con todas las princesas", descripcion: "Show estelar con Rapunzel y el resto del elenco real.", fotoUrl: "/images/rapunzel-cumpleanos.png", orden: 2 },
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Bella", nombre: "Bella y Bestia", descripcion: "Vals clásico de Bella y Bestia con vestuario de salón.", fotoUrl: "/images/bella-y-bestia.png", orden: 3 },
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Elsa (Frozen)", nombre: "Elsa sola", descripcion: "Solo Elsa para fotos, baile y magia invernal.", fotoUrl: "/images/frozen-olaf-elsa.jpg", orden: 4 },
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Elsa (Frozen)", nombre: "Elsa y Anna", descripcion: "Show con las dos hermanas de Arendelle.", fotoUrl: "/images/frozen-olaf-elsa.jpg", orden: 5 },
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Elsa (Frozen)", nombre: "Elsa, Anna y Olaf", descripcion: "Show completo de Frozen con Olaf incluido.", fotoUrl: "/images/frozen-olaf-elsa.jpg", orden: 6 },
      ],
    });
  }

  // Dinámicas de Baby Shower
  const babyShowerId = createdServices["Baby Shower o Revelación de Género"];
  if (babyShowerId) {
    await prisma.opcion.createMany({
      data: [
        { servicioId: babyShowerId, tipo: "DINAMICA", nombre: "Carrera de biberones", descripcion: "Los invitados compiten llenando un biberón con agua lo más rápido posible.", orden: 0 },
        { servicioId: babyShowerId, tipo: "DINAMICA", nombre: "Adivina la pancita", descripcion: "Medir el contorno de la pancita de la mamá con cinta o papel, a ojo.", orden: 1 },
        { servicioId: babyShowerId, tipo: "DINAMICA", nombre: "El pañal sorpresa", descripcion: "Diferentes tipos de chocolate derretido en pañales para adivinar el sabor.", orden: 2 },
        { servicioId: babyShowerId, tipo: "DINAMICA", nombre: "Bingo de bebé", descripcion: "Cartones temáticos de bebé, el clásico bingo con premios para los invitados.", orden: 3 },
        { servicioId: babyShowerId, tipo: "DINAMICA", nombre: "¿Niño o niña?", descripcion: "Dinámica de predicciones de los invitados antes de la revelación de género.", orden: 4 },
        { servicioId: babyShowerId, tipo: "DINAMICA", nombre: "Memoria de bebé", descripcion: "Juego de memoria con artículos de bebé.", orden: 5 },
        { servicioId: babyShowerId, tipo: "DINAMICA", nombre: "Decora el body", descripcion: "Los invitados personalizan bodies para el bebé como recuerdo.", orden: 6 },
        { servicioId: babyShowerId, tipo: "DINAMICA", nombre: "Trivia de mamá y papá", descripcion: "Preguntas divertidas sobre los futuros padres para ver quién los conoce mejor.", orden: 7 },
      ],
    });
  }

  // -------------------------------------------------------------
  // ServicioMedia: Fotos adicionales de Galería y Videos (Reels)
  // -------------------------------------------------------------
  // Fotos extra de un servicio, después de las que ya tenía.
  const galeria = (servicioNombre: string, fotos: string[], desde = 10) =>
    fotos.map((f, i) => ({ servicioNombre, url: `/images/${f}.jpg`, tipo: "FOTO" as const, orden: desde + i }));

  const mediaList: Array<{
    servicioNombre: string;
    url: string;
    tipo: "FOTO" | "VIDEO";
    poster?: string;
    orden: number;
  }> = [
    // Galería Casa de Mickey Mouse
    { servicioNombre: "Casa de Mickey Mouse", url: "/images/minnie.jpg", tipo: "FOTO", orden: 0 },
    { servicioNombre: "Casa de Mickey Mouse", url: "/images/mickey-minnie-graduacion.jpg", tipo: "FOTO", orden: 1 },
    { servicioNombre: "Casa de Mickey Mouse", url: "/images/mickey-navidad-show.png", tipo: "FOTO", orden: 2 },
    // Video Reels Casa de Mickey Mouse
    { servicioNombre: "Casa de Mickey Mouse", url: "/reels/reel-2.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-2-poster.jpg", orden: 3 },
    { servicioNombre: "Casa de Mickey Mouse", url: "/reels/reel-4.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-4-poster.jpg", orden: 4 },
    { servicioNombre: "Casa de Mickey Mouse", url: "/reels/reel-5.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-5-poster.jpg", orden: 5 },

    // Galería Princesas Disney
    { servicioNombre: "Princesas Disney", url: "/images/bella-y-bestia.png", tipo: "FOTO", orden: 0 },
    { servicioNombre: "Princesas Disney", url: "/images/princesa-rapunzel.jpg", tipo: "FOTO", orden: 1 },
    { servicioNombre: "Princesas Disney", url: "/images/rapunzel-cumpleanos.png", tipo: "FOTO", orden: 2 },

    // Galería Pelotas Boom
    { servicioNombre: "Pelotas Boom", url: "/images/pelotas-boom-piscina.png", tipo: "FOTO", orden: 0 },

    // Galería Show según temática
    { servicioNombre: "Show según temática", url: "/images/show-tematico-catrina.jpg", tipo: "FOTO", orden: 0 },
    // Reels Show según temática
    { servicioNombre: "Show según temática", url: "/reels/reel-3.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-3-poster.jpg", orden: 1 },
    { servicioNombre: "Show según temática", url: "/reels/reel-7.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-7-poster.jpg", orden: 2 },

    // Galería Bolas Disco
    { servicioNombre: "Bolas Disco", url: "/images/bolas-disco-equipo.jpg", tipo: "FOTO", orden: 0 },

    // Video Reels Show LED
    { servicioNombre: "Show LED", url: "/reels/reel-8.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-8-poster.jpg", orden: 0 },
    { servicioNombre: "Show LED", url: "/reels/reel-11.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-11-poster.jpg", orden: 1 },

    // Video Reel El Chacal de la Trompeta
    { servicioNombre: "El Chacal de la Trompeta", url: "/reels/reel-1.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-1-poster.jpg", orden: 0 },

    // Video Reel Baby Shower
    { servicioNombre: "Baby Shower o Revelación de Género", url: "/reels/reel-6.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-6-poster.jpg", orden: 0 },

    // Video Reel Día de Piscina Infantil
    { servicioNombre: "Día de Piscina Infantil", url: "/reels/reel-9.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-9-poster.jpg", orden: 0 },

    // Video Reel Espumanía
    { servicioNombre: "Espumanía", url: "/reels/reel-10.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-10-poster.jpg", orden: 0 },

    // Video Reel Carritos de Comida / Diverti Candy
    { servicioNombre: "Carritos de Comida", url: "/reels/reel-12.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-12-poster.jpg", orden: 0 },

    // Fotos de eventos reales (WhatsApp, octubre 2026)
    ...galeria("Casa de Mickey Mouse", ["mickey-amigos", "mickey-minnie", "minnie-evento", "mickey-minnie-cumple", "pluto-evento"]),
    ...galeria("Princesas Disney", ["bella-bestia-evento", "sirenita-ursula-sebastian", "aladdin-genio-jazmin", "moana", "frozen-olaf-elsa-2", "rapunzel-salon", "villanos-disney"]),
    ...galeria("Superhéroes", ["superheroes-equipo", "spiderman", "mujer-maravilla", "capitan-america"]),
    ...galeria("Show de Paw Patrol", ["paw-patrol-equipo", "paw-patrol-marshall", "paw-patrol-rubble"]),
    ...galeria("Show Granja de Zenón", ["granja-zenon-leon"]),
    ...galeria("Súper Mario", ["princesa-peach"]),
    ...galeria("Plim Plim", ["plim-plim-evento"]),
    ...galeria("Show según temática", ["show-tematico-robots", "show-tematico-retro", "show-tematico-casa-papel", "show-tematico-terror", "show-tematico-neon"]),
    ...galeria("Show LED", ["show-led-astronautas", "show-led-bailarina"]),
    ...galeria("Casa de Mickey Mouse", ["mickey-hechicero"], 20),
    ...galeria("Princesas Disney", ["cenicienta", "rapunzel-cumpleanera", "rapunzel-flynn", "rapunzel-flynn-gothel"], 20),
    ...galeria("Show según temática", ["show-tematico-bailarinas", "show-tematico-piano", "show-tematico-retro-rojo", "show-tematico-magos"], 20),
    ...galeria("Show LED", ["show-led-pareja", "show-led-astronautas-2"], 20),
    { servicioNombre: "Show según temática", url: "/reels/reel-13.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-13-poster.jpg", orden: 30 },
    { servicioNombre: "Show LED", url: "/reels/reel-14.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-14-poster.jpg", orden: 30 },
    { servicioNombre: "Carritos de Comida", url: "/reels/reel-15.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-15-poster.jpg", orden: 30 },
  ];

  for (const m of mediaList) {
    const servId = createdServices[m.servicioNombre];
    if (servId) {
      await prisma.servicioMedia.create({
        data: {
          servicioId: servId,
          url: m.url,
          tipo: m.tipo,
          poster: m.poster,
          orden: m.orden,
        },
      });
    }
  }

  for (const r of recursos) {
    await prisma.recurso.create({ data: r });
  }

  await prisma.configuracionSitio.upsert({
    where: { id: "principal" },
    update: {},
    create: { id: "principal", whatsapp: "584147286881" },
  });

  const passwordHash = await bcrypt.hash("divertimania2024", 10);
  await prisma.adminUser.create({
    data: { usuario: "admin", passwordHash },
  });

  console.log("Seed completado exitosamente con fotos, videos, metadatos y admin.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
