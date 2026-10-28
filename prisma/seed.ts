import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { aplicarPersonajesInfantiles } from "./personajes-infantiles";
import { aplicarParaNinos } from "./para-ninos";
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

  // Personajes Infantiles: tarjetas nuevas con sus variantes y princesas juntas
  await aplicarPersonajesInfantiles(prisma);

  // Para Niños y Estaciones de Comida: estaciones separadas y carritos de comida
  await aplicarParaNinos(prisma);

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
