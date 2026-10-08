import Hero from "@/components/site/Hero";
import BannerTemporada, { type NovedadData } from "@/components/site/BannerTemporada";
import QueCelebras from "@/components/site/QueCelebras";
import PersonajesCarousel, { type PersonajeItem } from "@/components/site/PersonajesCarousel";
import ShowsEstrella, { type ShowEstrellaData } from "@/components/site/ShowsEstrella";
import MomentosReales from "@/components/site/MomentosReales";
import PreguntasFrecuentes from "@/components/site/PreguntasFrecuentes";
import { prisma } from "@/lib/db";

export const revalidate = 60;

export default async function Home() {
  const now = new Date();

  // 1. Novedades activas para Hero y Banner
  const novedadesActivas = await prisma.novedad.findMany({
    where: {
      activo: true,
      AND: [
        { OR: [{ fechaInicio: null }, { fechaInicio: { lte: now } }] },
        { OR: [{ fechaFin: null }, { fechaFin: { gte: now } }] },
      ],
    },
    orderBy: { orden: "asc" },
  });

  const bannerNovedad: NovedadData | null = novedadesActivas.length > 0
    ? {
        id: novedadesActivas[0].id,
        badge: novedadesActivas[0].badge,
        titulo: novedadesActivas[0].titulo,
        descripcion: novedadesActivas[0].descripcion,
        fotoUrl: novedadesActivas[0].fotoUrl,
        ctaTexto: novedadesActivas[0].ctaTexto,
        ctaUrl: novedadesActivas[0].ctaUrl,
      }
    : null;

  // 2. Personajes en vivo con foto real
  const personajesDb = await prisma.servicio.findMany({
    where: {
      categoria: "Personajes",
    },
    orderBy: { orden: "asc" },
    take: 12,
    select: {
      id: true,
      nombre: true,
      fotoUrl: true,
    },
  });

  const personajes: PersonajeItem[] = personajesDb;

  // 3. Shows estrella más pedidos (excluyendo personajes puros)
  const showsDb = await prisma.servicio.findMany({
    where: {
      categoria: { not: "Personajes" },
      OR: [{ destacado: true }, { masPedido: true }],
    },
    orderBy: [{ masPedido: "desc" }, { destacado: "desc" }, { orden: "asc" }],
    take: 8,
    include: {
      media: {
        orderBy: { orden: "asc" },
      },
    },
  });

  const shows: ShowEstrellaData[] = showsDb.map((s) => {
    const videoMedia = s.media.find((m) => m.tipo === "VIDEO");
    return {
      id: s.id,
      nombre: s.nombre,
      categoria: s.categoria,
      descripcion: s.descripcion,
      fotoUrl: s.fotoUrl,
      videoUrl: videoMedia?.url ?? null,
      posterUrl: videoMedia?.poster ?? null,
      edadIdeal: s.edadIdeal,
      duracion: s.duracion,
      masPedido: s.masPedido,
      destacado: s.destacado,
      soloAdultos: s.soloAdultos,
    };
  });

  return (
    <div className="flex flex-col gap-6 sm:gap-10 pb-16">
      {/* 1. Hero con franja de confianza y llamada a la acción */}
      <Hero novedades={novedadesActivas} />

      {/* 2. Banner de temporada si hay novedad activa */}
      {bannerNovedad && <BannerTemporada novedad={bannerNovedad} />}

      {/* 3. Selector de ocasión "¿Qué estás celebrando?" */}
      <QueCelebras />

      {/* 4. Carrusel de personajes en vivo */}
      <PersonajesCarousel personajes={personajes} />

      {/* 5. Shows estrella más pedidos */}
      <ShowsEstrella shows={shows} />

      {/* 6. Galería de momentos reales y redes sociales */}
      <MomentosReales />

      {/* 7. Preguntas frecuentes y llamado a la acción final */}
      <PreguntasFrecuentes />
    </div>
  );
}
