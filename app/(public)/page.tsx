import Hero from "@/components/site/Hero";
import QueCelebras from "@/components/site/QueCelebras";
import PersonajesCarousel from "@/components/site/PersonajesCarousel";
import ShowsEstrella from "@/components/site/ShowsEstrella";
import MomentosReales from "@/components/site/MomentosReales";
import CotizarButtons from "@/components/site/CotizarButtons";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const now = new Date();
  const [novedadesActivas, personajes, destacados] = await Promise.all([
    prisma.novedad.findMany({
      where: {
        activo: true,
        AND: [
          { OR: [{ fechaInicio: null }, { fechaInicio: { lte: now } }] },
          { OR: [{ fechaFin: null }, { fechaFin: { gte: now } }] },
        ],
      },
      orderBy: { orden: "asc" },
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
  ]);

  const totalPersonajes = await prisma.servicio.count({ where: { categoria: "Personajes", soloAdultos: false } });

  return (
    <div>
      <Hero novedades={novedadesActivas} />
      <QueCelebras />
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
