import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/site/Hero";
import QueCelebras from "@/components/site/QueCelebras";
import ShowsEstrella from "@/components/site/ShowsEstrella";
import PersonajesCarousel from "@/components/site/PersonajesCarousel";
import GaleriaViva from "@/components/site/GaleriaViva";
import MomentosReales from "@/components/site/MomentosReales";
import CotizarButtons from "@/components/site/CotizarButtons";
import { prisma } from "@/lib/db";
import { getCategorias } from "@/lib/categorias";

export const dynamic = "force-dynamic";

export default async function Home() {
  const now = new Date();
  const [novedad, personajes, destacados, totalPersonajes, categorias, conServicios] = await Promise.all([
    prisma.novedad.findFirst({
      where: {
        activo: true,
        AND: [
          { OR: [{ fechaInicio: null }, { fechaInicio: { lte: now } }] },
          { OR: [{ fechaFin: null }, { fechaFin: { gte: now } }] },
        ],
      },
      orderBy: { orden: "asc" },
      select: { id: true, titulo: true, badge: true, ctaUrl: true },
    }),
    prisma.servicio.findMany({
      where: { activo: true, categoria: "Personajes", soloAdultos: false, fotoUrl: { not: null } },
      select: { id: true, nombre: true, fotoUrl: true },
      orderBy: { orden: "asc" },
    }),
    prisma.servicio.findMany({
      where: { activo: true, destacado: true, soloAdultos: false, fotoUrl: { not: null } },
      include: {
        media: { where: { tipo: "VIDEO" }, orderBy: { orden: "asc" }, take: 1 },
        _count: { select: { opciones: true } },
      },
      orderBy: { orden: "asc" },
      take: 4,
    }),
    prisma.servicio.count({ where: { activo: true, categoria: "Personajes", soloAdultos: false } }),
    getCategorias(),
    prisma.servicio.findMany({ where: { activo: true }, distinct: ["categoria"], select: { categoria: true } }),
  ]);

  return (
    <div>
      <Hero novedad={novedad} categorias={categorias.map((c) => c.nombre).filter((n) => conServicios.some((s) => s.categoria === n))} />
      <QueCelebras />
      <ShowsEstrella
        shows={destacados.map((s) => ({
          ...s,
          videoUrl: s.media[0]?.url ?? null,
          posterUrl: s.media[0]?.poster ?? null,
          tieneOpciones: s._count.opciones > 0,
        }))}
      />
      <PersonajesCarousel personajes={personajes} total={totalPersonajes} />

      <div className="mx-auto mb-16 flex max-w-6xl justify-center px-4 sm:px-6">
        <Link
          href="/catalogo"
          className="touch-target group gap-2 rounded-full border border-neon-green/60 px-7 text-base font-bold text-neon-green transition-colors hover:bg-neon-green hover:text-background"
        >
          Ver todo el catálogo
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>

      <GaleriaViva />
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
