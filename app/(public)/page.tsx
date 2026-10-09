import HeroPerfil from "@/components/site/HeroPerfil";
import QueCelebras from "@/components/site/QueCelebras";
import FeedReels, { type FeedItem } from "@/components/site/FeedReels";
import PersonajesCarousel from "@/components/site/PersonajesCarousel";
import ShowsEstrella from "@/components/site/ShowsEstrella";
import MomentosReales from "@/components/site/MomentosReales";
import CotizarButtons from "@/components/site/CotizarButtons";
import { prisma } from "@/lib/db";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const MAX_FEED = 12;

/** Versión corta (6 s, sin audio) de cada reel, generada por scripts/comprimir-videos.mjs. */
function clipCorto(url: string): string {
  return url.replace(/^\/reels\/(reel-\d+\.mp4)$/, "/reels/intro/$1");
}

export default async function Home() {
  const now = new Date();
  const [novedad, reels, personajes, destacados, totalPersonajes] = await Promise.all([
    prisma.novedad.findFirst({
      where: {
        activo: true,
        fotoUrl: { not: null },
        AND: [
          { OR: [{ fechaInicio: null }, { fechaInicio: { lte: now } }] },
          { OR: [{ fechaFin: null }, { fechaFin: { gte: now } }] },
        ],
      },
      orderBy: { orden: "asc" },
    }),
    prisma.servicioMedia.findMany({
      where: { tipo: "VIDEO", servicio: { soloAdultos: false } },
      include: { servicio: { select: { id: true, nombre: true } } },
      orderBy: [{ servicio: { orden: "asc" } }, { orden: "asc" }],
    }),
    prisma.servicio.findMany({
      where: { categoria: "Personajes", soloAdultos: false, fotoUrl: { not: null } },
      select: { id: true, nombre: true, fotoUrl: true },
      orderBy: { orden: "asc" },
    }),
    prisma.servicio.findMany({
      where: { destacado: true, soloAdultos: false, fotoUrl: { not: null } },
      include: {
        media: { where: { tipo: "VIDEO" }, orderBy: { orden: "asc" }, take: 1 },
        _count: { select: { opciones: true } },
      },
      orderBy: { orden: "asc" },
      take: 4,
    }),
    prisma.servicio.count({ where: { categoria: "Personajes", soloAdultos: false } }),
  ]);

  const feed: FeedItem[] = [];
  if (novedad?.fotoUrl) {
    feed.push({
      tipo: "fijado",
      id: `novedad-${novedad.id}`,
      titulo: novedad.titulo,
      fotoUrl: novedad.fotoUrl,
      href: novedad.ctaUrl || "/catalogo",
    });
  }
  // Un reel por servicio primero (variedad, como su feed); si sobra espacio, se completa con el resto.
  const vistos = new Set<string>();
  const serviciosEnFeed = new Set<string>();
  const ordenados = [
    ...reels.filter((r) => !serviciosEnFeed.has(r.servicio.id) && serviciosEnFeed.add(r.servicio.id)),
    ...reels,
  ];
  for (const r of ordenados) {
    if (feed.length >= MAX_FEED || vistos.has(r.url)) continue;
    vistos.add(r.url);
    feed.push({
      tipo: "reel",
      id: r.id,
      titulo: r.servicio.nombre,
      videoUrl: clipCorto(r.url),
      poster: r.poster,
      href: `/catalogo/${r.servicio.id}`,
    });
  }

  return (
    <div>
      <section className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-8 px-4 pb-10 pt-6 sm:px-6 sm:pt-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start lg:gap-12">
        <div className="flex flex-col gap-7 lg:sticky lg:top-24">
          <HeroPerfil />
          <QueCelebras />
        </div>

        <div className="-mx-4 sm:mx-0">
          <FeedReels items={feed} />
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block px-4 text-center text-sm font-semibold text-muted transition-colors hover:text-neon-green sm:px-0"
          >
            Ver más en Instagram · @{INSTAGRAM_HANDLE}
          </a>
        </div>
      </section>

      <PersonajesCarousel personajes={personajes} total={totalPersonajes} />
      <ShowsEstrella
        shows={destacados.map((s) => ({
          ...s,
          videoUrl: s.media[0]?.url ?? null,
          posterUrl: s.media[0]?.poster ?? null,
          tieneOpciones: s._count.opciones > 0,
        }))}
      />
      <MomentosReales />

      <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-28">
        <h2 className="type-h1 font-display font-extrabold">
          ¿Ya tienes la fecha? <span className="text-neon-green">Armemos la fiesta.</span>
        </h2>
        <p className="max-w-lg text-muted">
          Elige lo que te gusta, cuéntanos de tu evento y te mandamos la cotización por WhatsApp.
        </p>
        <CotizarButtons />
      </section>
    </div>
  );
}
