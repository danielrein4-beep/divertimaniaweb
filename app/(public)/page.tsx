import Link from "next/link";
import { clipDeTarjeta } from "@/lib/clipTarjeta";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/site/Hero";
import { listaDeFotos, type NovedadHero } from "@/lib/novedades";
import QueCelebras from "@/components/site/QueCelebras";
import ShowsEstrella from "@/components/site/ShowsEstrella";
import PersonajesCarousel from "@/components/site/PersonajesCarousel";
import GaleriaViva from "@/components/site/GaleriaViva";
import MomentosReales from "@/components/site/MomentosReales";
import CotizarButtons from "@/components/site/CotizarButtons";
import ComoReservar from "@/components/site/ComoReservar";
import { metodosDisponibles } from "@/lib/cuentasPago";
import { leerCifras } from "@/lib/confianza";
import CifrasConfianza from "@/components/site/CifrasConfianza";
import { PAGOS } from "@/lib/negocio";
import Testimonios from "@/components/site/Testimonios";
import { prisma } from "@/lib/db";
import { getCategorias } from "@/lib/categorias";

export const dynamic = "force-dynamic";

export default async function Home() {
  const now = new Date();
  const [novedadesBd, personajes, destacados, totalPersonajes, categorias, conServicios, config] = await Promise.all([
    prisma.novedad.findMany({
      take: 5,
      where: {
        activo: true,
        AND: [
          { OR: [{ fechaInicio: null }, { fechaInicio: { lte: now } }] },
          { OR: [{ fechaFin: null }, { fechaFin: { gte: now } }] },
        ],
      },
      orderBy: { orden: "asc" },
      select: { id: true, titulo: true, badge: true, descripcion: true, fotoUrl: true, fotos: true, ctaTexto: true, ctaUrl: true },
    }),
    prisma.servicio.findMany({
      where: { activo: true, categoria: "Personajes", subcategoria: { not: "Adultos" }, soloAdultos: false, fotoUrl: { not: null } },
      select: { id: true, nombre: true, fotoUrl: true },
      orderBy: { orden: "asc" },
    }),
    prisma.servicio.findMany({
      where: { activo: true, destacado: true, soloAdultos: false, fotoUrl: { not: null } },
      include: {
        media: { where: { tipo: "VIDEO" }, orderBy: { orden: "asc" }, take: 4 },
        _count: { select: { opciones: { where: { tipo: "VARIANTE" } } } },
      },
      orderBy: { orden: "asc" },
      take: 4,
    }),
    prisma.servicio.count({ where: { activo: true, categoria: "Personajes", subcategoria: { not: "Adultos" }, soloAdultos: false } }),
    getCategorias(),
    prisma.servicio.findMany({ where: { activo: true }, distinct: ["categoria"], select: { categoria: true } }),
    prisma.configuracionSitio.findUnique({ where: { id: "principal" }, select: { datosPago: true, cifras: true } }),
  ]);

  const novedades: NovedadHero[] = novedadesBd.map(({ fotos, ...n }) => ({ ...n, fotos: listaDeFotos(n.fotoUrl, fotos) }));

  return (
    <div>
      <Hero novedades={novedades} categorias={categorias.map((c) => c.nombre).filter((n) => conServicios.some((s) => s.categoria === n))} />
      <CifrasConfianza cifras={leerCifras(config?.cifras)} />
      <QueCelebras />
      <ShowsEstrella
        shows={destacados.map((s) => ({
          ...s,
          videos: s.media.map((m) => clipDeTarjeta(m.url, m.poster)),
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
      <Testimonios />
      <ComoReservar metodosPago={metodosDisponibles(config?.datosPago, PAGOS.metodos)} />

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
