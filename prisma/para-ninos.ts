import type { PrismaClient } from "@prisma/client";

// Secciones "Para Niños" (juegos y estaciones de actividad) y "Estaciones de Comida".
// Idempotente: crea lo que falta, renombra lo que ya existía y reordena.

export const CAT_NINOS = "Para Niños";
export const CAT_COMIDA = "Estaciones de Comida";

interface TarjetaDef {
  nombre: string;
  desde?: string;
  descripcion?: string;
  foto?: string; // portada; si hay video, es su fotograma
  video?: string; // video corto que se reproduce en la tarjeta
  heredaDe?: string; // copia incluye/edad/duración/ocasiones de una tarjeta existente (datos reales del catálogo)
}

const NINOS: TarjetaDef[] = [
  { nombre: "Estación Creativa" },
  {
    nombre: "Estación de Pulseras",
    descripcion: "Los niños diseñan y elaboran su propia pulsera para llevarse de recuerdo de la fiesta.",
    foto: "/videos/estacion-pulseras.jpg",
    video: "/videos/estacion-pulseras.mp4",
  },
  {
    nombre: "Estación de Galletas",
    descripcion: "Los niños decoran sus propias galletas y se las llevan de recuerdo de la fiesta.",
  },
  { nombre: "Pelotas Boom (Bolas de Hámster)", desde: "Pelotas Boom" },
  { nombre: "Castillos Inflables" },
  { nombre: "Trampolines" },
];

// El carrito original se renombra y pasa a ser la estación de cotufas; los otros dos heredan sus datos.
const COMIDA_INICIAL = "Estación de Cotufas";

const COMIDA: TarjetaDef[] = [
  {
    nombre: "Estación de Cotufas",
    desde: "Carritos de Comida",
    descripcion: "Un carrito de cotufas recién hechas para que tus invitados disfruten durante toda la fiesta.",
    foto: "/videos/estacion-cotufas.jpg",
    video: "/videos/estacion-cotufas.mp4",
    heredaDe: "Carritos de Comida",
  },
  {
    nombre: "Estación de Algodón de Azúcar",
    descripcion: "Un carrito de algodón de azúcar para endulzar la fiesta de grandes y chicos.",
    heredaDe: "Carritos de Comida",
  },
  {
    nombre: "Estación de Perros Calientes",
    descripcion: "Un carrito de perros calientes servidos al momento para tus invitados.",
    heredaDe: "Carritos de Comida",
  },
];

/** Agrega el video de la tarjeta (con su portada) a la galería si todavía no lo tiene. */
async function ponerVideo(prisma: PrismaClient, servicioId: string, def: TarjetaDef) {
  if (!def.video) return;
  const ya = await prisma.servicioMedia.count({ where: { servicioId, url: def.video } });
  if (ya === 0) {
    await prisma.servicioMedia.create({ data: { servicioId, url: def.video, tipo: "VIDEO", poster: def.foto ?? null, orden: -10 } });
  }
}

async function aplicarGrupo(prisma: PrismaClient, categoria: string, lista: TarjetaDef[], base: number) {
  let creados = 0;
  for (const [i, def] of lista.entries()) {
    const existente =
      (await prisma.servicio.findFirst({ where: { nombre: def.nombre } })) ??
      (def.desde ? await prisma.servicio.findFirst({ where: { nombre: def.desde } }) : null);

    if (existente) {
      await prisma.servicio.update({
        where: { id: existente.id },
        data: {
          nombre: def.nombre,
          categoria,
          orden: base + i,
          ...(def.desde && def.descripcion ? { descripcion: def.descripcion } : {}),
          ...(!existente.fotoUrl && def.foto ? { fotoUrl: def.foto } : {}),
        },
      });
      await ponerVideo(prisma, existente.id, def);
      continue;
    }

    const molde = def.heredaDe
      ? await prisma.servicio.findFirst({ where: { OR: [{ nombre: def.heredaDe }, { nombre: COMIDA_INICIAL }] } })
      : null;
    const nuevo = await prisma.servicio.create({
      data: {
        categoria,
        nombre: def.nombre,
        descripcion: def.descripcion ?? "",
        fotoUrl: def.foto ?? null,
        orden: base + i,
        incluye: molde?.incluye ?? null,
        edadIdeal: molde?.edadIdeal ?? null,
        duracion: molde?.duracion ?? null,
        ocasiones: molde?.ocasiones ?? "cumpleanos",
      },
    });
    await ponerVideo(prisma, nuevo.id, def);
    creados++;
  }
  return creados;
}

export async function aplicarParaNinos(prisma: PrismaClient) {
  const ninos = await aplicarGrupo(prisma, CAT_NINOS, NINOS, 200);
  const comida = await aplicarGrupo(prisma, CAT_COMIDA, COMIDA, 300);
  return { ninos, comida };
}
