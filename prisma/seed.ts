import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { aplicarPersonajesInfantiles } from "./personajes-infantiles";
import { aplicarParaNinos } from "./para-ninos";
import { ocultarTarjetas } from "./ocultos";
import { aplicarPortadasVideo } from "./portadas-video";
import { organizarCatalogo } from "./organizacion";
import { servicios } from "./datos/servicios";
import { recursos } from "./datos/recursos";
import { recreadores } from "./datos/equipo";
import { mediaList } from "./datos/media";

const prisma = new PrismaClient();

// Carga el catálogo inicial. Borra todo lo que haya: solo para bases nuevas o de prueba
// (en el servidor, scripts/arrancar.mjs lo corre únicamente si la base está vacía).
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

  for (const rec of recreadores) {
    await prisma.recreador.create({ data: rec });
  }

  // Insertar novedades (incluyendo Novedad navideña 2026 para banner de temporada)
  await prisma.novedad.create({
    data: {
      badge: "Temporada 2026",
      titulo: "Shows navideños 2026",
      descripcion: "Mickey y Minnie vestidos de Navidad con duendes y animación especial de fin de año. ¡Aparta tu fecha con anticipación!",
      fotoUrl: "/images/mickey-navidad-show-hd.jpg",
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
    "Princesas Disney": ["Animación Infantil", "Diverti Artistas", "Castillos Inflables"],
    "Súper Mario": ["Animación Infantil", "Castillos Inflables", "Pelotas Boom"],
    "Bolas Disco": ["Show LED", "El Chacal de la Trompeta", "Espumanía"],
    "Show LED": ["Bolas Disco", "Show según temática", "El Chacal de la Trompeta"],
    "Baby Shower": ["Diverti Artistas", "Carritos de Comida"],
    "Revelación de Género": ["Diverti Artistas", "Carritos de Comida"],
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

  // Opciones y variantes de Princesas Disney: una ficha por show (el video de presentación va en portadas-video.ts)
  const princesasId = createdServices["Princesas Disney"];
  if (princesasId) {
    await prisma.opcion.createMany({
      data: [
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Rapunzel", nombre: "Show de Rapunzel", descripcion: "Rapunzel llega con su larguísima cabellera dorada para cantar, bailar y regalar fotos mágicas a tus invitados.", fotoUrl: "/videos/rapunzel-sola.jpg", videoUrl: "/videos/rapunzel-sola.mp4", orden: 0 },
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Rapunzel", nombre: "Rapunzel con el príncipe", descripcion: "Rapunzel y Flynn Rider juntos en una aventura romántica llena de baile, fotos y farolillos de ensueño.", fotoUrl: "/videos/rapunzel-flynn.jpg", videoUrl: "/videos/rapunzel-flynn.mp4", orden: 1 },
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Rapunzel", nombre: "Show de Rapunzel con Madre Gothel y Flynn", descripcion: "El cuento completo: Rapunzel, Flynn Rider y la intrigante Madre Gothel en un show lleno de aventura, humor y magia.", fotoUrl: "/videos/rapunzel-gothel-flynn.jpg", videoUrl: "/videos/rapunzel-gothel-flynn.mp4", orden: 2 },
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Cenicienta", nombre: "Show de Cenicienta", descripcion: "Cenicienta llega con su vestido de baile y su zapatilla de cristal para que cada niña viva su propio cuento de hadas.", fotoUrl: "/videos/cenicienta.jpg", videoUrl: "/videos/cenicienta.mp4", orden: 10 },
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Blancanieves", nombre: "Show de Blancanieves", descripcion: "Blancanieves, la más bella del reino, llega con su dulzura y su canto para enamorar a grandes y pequeños: ¡un cuento de hadas en tu fiesta!", fotoUrl: "/videos/blancanieves-show-completo.jpg", videoUrl: "/videos/blancanieves-show-completo.mp4", orden: 20 },
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Bella", nombre: "Show de Bella", descripcion: "Bella llega con su elegante vestido amarillo y su amor por los libros para llenar tu fiesta de encanto.", fotoUrl: "/images/bella-show.jpg", videoUrl: null, orden: 30 },
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Bella", nombre: "Show con la Bestia", descripcion: "El vals más romántico del cine: Bella y la Bestia bailan juntos con vestuario de gran salón, como en el cuento.", fotoUrl: "/videos/bella-bestia-show.jpg", videoUrl: "/videos/bella-bestia-show.mp4", orden: 31 },
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Ariel", nombre: "Show de Ariel", descripcion: "Ariel sale del fondo del mar para cantar, bailar y compartir con todos tus invitados su sueño de conocer el mundo.", fotoUrl: "/images/sirenita-ursula-sebastian.jpg", videoUrl: null, orden: 40 },
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Ariel", nombre: "Show de toda la película La Sirenita", descripcion: "Toda La Sirenita en vivo: Ariel, Sebastián, Úrsula y los personajes de la película en un show lleno de música y aventura bajo el mar.", fotoUrl: "/images/sirenita-ursula-sebastian.jpg", videoUrl: null, orden: 42 },
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Elsa (Frozen)", nombre: "Show de Elsa", descripcion: "Elsa llega con su capa de hielo y su magia invernal para dejar a todos tus invitados congelados de emoción.", fotoUrl: "/images/frozen-olaf-elsa.jpg", videoUrl: null, orden: 50 },
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Elsa (Frozen)", nombre: "Show de Elsa y Anna", descripcion: "Las dos hermanas de Arendelle juntas, con canciones, juegos y un amor de hermanas que derrite hasta el hielo.", fotoUrl: "/images/frozen-olaf-elsa.jpg", videoUrl: null, orden: 51 },
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Elsa (Frozen)", nombre: "Show de toda la película de Frozen", descripcion: "Incluye a Elsa, Anna, Olaf y Copito de Nieve. Toda la magia de Arendelle en un solo show: canciones, nieve y mucha diversión.", fotoUrl: "/images/frozen-olaf-elsa.jpg", videoUrl: null, orden: 53 },
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Moana", nombre: "Show de Moana", descripcion: "Moana zarpa hasta tu fiesta con su espíritu aventurero y el ritmo del océano: un show lleno de valentía, baile y mar.", fotoUrl: "/images/moana.jpg", orden: 60 },
        { servicioId: princesasId, tipo: "VARIANTE", grupo: "Jazmín", nombre: "Show de Jazmín", descripcion: "Jazmín llega desde Agrabah con su elegancia y su espíritu libre para llenar tu fiesta de magia oriental, baile y fotos de ensueño.", fotoUrl: "/images/aladdin-genio-jazmin.jpg", orden: 70 },
      ],
    });
  }

  // Personajes Infantiles: tarjetas nuevas con sus variantes y princesas juntas
  await aplicarPersonajesInfantiles(prisma);

  // Para Niños y Estaciones de Comida: estaciones separadas y carritos de comida
  await aplicarParaNinos(prisma);

  // Tarjetas que se quitaron del sitio
  await ocultarTarjetas(prisma);

  // Portada y video en bucle de las tarjetas que los han recibido
  await aplicarPortadasVideo(prisma);

  // Catálogo en 3 secciones (Personajes · Servicios para tu fiesta · Celebraciones)
  await organizarCatalogo(prisma);

  // Dinámicas de Baby Shower
  const babyShowerId = createdServices["Baby Shower"];
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
    create: { id: "principal", whatsapp: "584147286881", whatsapp2: "584247435744" },
  });

  // En el servidor la clave inicial sale de ADMIN_CLAVE_INICIAL (variable de Coolify, nunca en el código).
  const passwordHash = await bcrypt.hash(process.env.ADMIN_CLAVE_INICIAL || "divertimania2024", 10);
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
