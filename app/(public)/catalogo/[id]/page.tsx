import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cache } from "react";
import { Check, Clock, Users } from "lucide-react";
import { prisma } from "@/lib/db";
import PlaceholderImage from "@/components/site/PlaceholderImage";
import ServicioDetalle from "@/components/site/ServicioDetalle";
import FichaGaleria, { type MediaItem } from "@/components/site/FichaGaleria";
import FichaBar from "@/components/mifiesta/FichaBar";
import ServicioCard from "@/components/ui/ServicioCard";
import { type TipoOpcion } from "@/lib/validation";

export const dynamic = "force-dynamic";

const getServicio = cache((id: string) =>
  prisma.servicio.findUnique({
    where: { id },
    include: {
      opciones: { orderBy: { orden: "asc" } },
      media: { orderBy: { orden: "asc" } },
    },
  })
);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const servicio = await getServicio(id);
  if (!servicio) return {};
  const title = `${servicio.nombre} | Divertimania`;
  const description = servicio.descripcion.slice(0, 160);
  const images = servicio.fotoUrl ? [{ url: servicio.fotoUrl, alt: servicio.nombre }] : undefined;
  return { title, description, openGraph: { title, description, images }, twitter: { card: "summary_large_image", title, description } };
}

export default async function ServicioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const servicio = await getServicio(id);
  if (!servicio) notFound();

  const relacionadosIds = (servicio.combinaCon ?? "").split(",").filter(Boolean);
  const relacionados = relacionadosIds.length
    ? await prisma.servicio.findMany({
        where: { id: { in: relacionadosIds }, soloAdultos: false },
        include: { _count: { select: { opciones: true } } },
        take: 3,
      })
    : [];

  const media: MediaItem[] = [
    ...(servicio.fotoUrl ? [{ url: servicio.fotoUrl, tipo: "FOTO" as const }] : []),
    ...servicio.media
      .filter((m) => m.url !== servicio.fotoUrl)
      .map((m) => ({ url: m.url, tipo: m.tipo === "VIDEO" ? ("VIDEO" as const) : ("FOTO" as const), poster: m.poster })),
  ];
  const incluye = (servicio.incluye ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  const tieneOpciones = servicio.opciones.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-32 pt-6 sm:px-6 sm:pt-10">
      <nav aria-label="Ruta" className="mb-4 text-sm text-muted">
        <Link href="/catalogo" className="hover:text-neon-green">
          Catálogo
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <Link href={`/catalogo?categoria=${encodeURIComponent(servicio.categoria)}`} className="hover:text-neon-green">
          {servicio.categoria}
        </Link>
      </nav>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12">
        <div className="md:sticky md:top-24 md:self-start">
          {media.length > 0 ? (
            <FichaGaleria media={media} nombre={servicio.nombre} />
          ) : (
            <PlaceholderImage
              label={servicio.nombre}
              categoria={servicio.categoria}
              className="aspect-[4/5] w-full rounded-3xl"
            />
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {servicio.soloAdultos && (
              <span className="self-start rounded-full bg-red-500/90 px-2.5 py-0.5 text-xs font-bold text-white">
                Solo adultos +18
              </span>
            )}
            <h1 className="type-h1 font-display font-extrabold">{servicio.nombre}</h1>
            {(servicio.edadIdeal || servicio.duracion) && (
              <p className="flex flex-wrap gap-4 text-sm text-muted">
                {servicio.edadIdeal && (
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-neon-green" aria-hidden />
                    {servicio.edadIdeal}
                  </span>
                )}
                {servicio.duracion && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-neon-green" aria-hidden />
                    {servicio.duracion}
                  </span>
                )}
              </p>
            )}
            <p className="type-body text-foreground/85">{servicio.descripcion}</p>
          </div>

          {incluye.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">Qué incluye</h2>
              <ul className="flex flex-col gap-2.5">
                {incluye.map((linea) => (
                  <li key={linea} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-neon-green" aria-hidden />
                    <span>{linea}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tieneOpciones && (
            <ServicioDetalle
              servicioId={servicio.id}
              servicioNombre={servicio.nombre}
              servicioCategoria={servicio.categoria}
              servicioFotoUrl={servicio.fotoUrl}
              opciones={servicio.opciones.map((o) => ({ ...o, tipo: o.tipo as TipoOpcion }))}
            />
          )}

          <p className="text-xs text-muted">
            No publicamos precios: cada fiesta se cotiza según fecha, zona y lo que elijas.
          </p>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-16" aria-labelledby="combina-titulo">
          <h2 id="combina-titulo" className="type-h2 mb-5 font-display font-extrabold">
            Combina perfecto con
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
            {relacionados.map((r) => (
              <ServicioCard
                key={r.id}
                id={r.id}
                nombre={r.nombre}
                categoria={r.categoria}
                fotoUrl={r.fotoUrl}
                edadIdeal={r.edadIdeal}
                duracion={r.duracion}
                masPedido={r.masPedido}
                tieneOpciones={r._count.opciones > 0}
              />
            ))}
          </div>
        </section>
      )}

      <FichaBar
        servicioId={servicio.id}
        nombre={servicio.nombre}
        categoria={servicio.categoria}
        fotoUrl={servicio.fotoUrl}
        tieneOpciones={tieneOpciones}
      />
    </div>
  );
}
