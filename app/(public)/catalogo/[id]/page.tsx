import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import ServicioMediaGallery from "@/components/servicio/ServicioMediaGallery";
import ServicioQueIncluye from "@/components/servicio/ServicioQueIncluye";
import ServicioCombinaCon, { type CombinaItem } from "@/components/servicio/ServicioCombinaCon";
import ServicioBottomBar from "@/components/servicio/ServicioBottomBar";
import ServicioDetalle from "@/components/site/ServicioDetalle";
import { type TipoOpcion } from "@/lib/validation";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import Badge from "@/components/ui/Badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const servicio = await prisma.servicio.findUnique({ where: { id } });

  if (!servicio) return { title: "Servicio no encontrado | Divertimania" };

  return {
    title: `${servicio.nombre} | Divertimania Táchira`,
    description: servicio.descripcion,
    openGraph: {
      title: `${servicio.nombre} - Divertimania`,
      description: servicio.descripcion,
      images: servicio.fotoUrl ? [servicio.fotoUrl] : [],
    },
  };
}

export default async function ServicioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const servicio = await prisma.servicio.findUnique({
    where: { id },
    include: {
      media: { orderBy: { orden: "asc" } },
      opciones: { orderBy: { orden: "asc" } },
    },
  });

  if (!servicio) notFound();

  // Buscar servicios complementarios
  let combinaItems: CombinaItem[] = [];
  if (servicio.combinaCon) {
    const ids = servicio.combinaCon
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (ids.length > 0) {
      combinaItems = await prisma.servicio.findMany({
        where: { id: { in: ids } },
        take: 3,
        select: { id: true, nombre: true, categoria: true, fotoUrl: true },
      });
    }
  }

  // Si no tiene combinaCon explícito, sugerir otros destacados de la misma o distinta categoría
  if (combinaItems.length === 0) {
    combinaItems = await prisma.servicio.findMany({
      where: {
        id: { not: servicio.id },
        soloAdultos: servicio.soloAdultos,
      },
      take: 3,
      orderBy: [{ masPedido: "desc" }, { orden: "asc" }],
      select: { id: true, nombre: true, categoria: true, fotoUrl: true },
    });
  }

  const tieneOpciones = servicio.opciones.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 pt-6 pb-28 sm:px-6 sm:pt-10">
      {/* Breadcrumb de regreso */}
      <nav className="mb-6 flex items-center gap-2">
        <Link
          href={`/catalogo?categoria=${encodeURIComponent(servicio.categoria)}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted hover:text-neon-green transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a {servicio.categoria}</span>
        </Link>
      </nav>

      {/* Cabecera del servicio */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            {servicio.categoria}
          </span>
          {servicio.soloAdultos && (
            <Badge variant="danger" size="sm" icon={<ShieldAlert className="w-3 h-3" />}>
              Solo Adultos (+18)
            </Badge>
          )}
          {servicio.masPedido && (
            <Badge variant="gold" size="sm">
              Más pedido
            </Badge>
          )}
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          {servicio.nombre}
        </h1>

        <p className="text-sm sm:text-base text-muted leading-relaxed">
          {servicio.descripcion}
        </p>
      </div>

      {/* Galería multimedia (fotos y videos) */}
      <div className="mb-8">
        <ServicioMediaGallery
          nombre={servicio.nombre}
          categoria={servicio.categoria}
          fotoPrincipal={servicio.fotoUrl}
          media={servicio.media}
        />
      </div>

      <div className="flex flex-col gap-8">
        {/* Qué incluye */}
        <ServicioQueIncluye
          incluye={servicio.incluye}
          edadIdeal={servicio.edadIdeal}
          duracion={servicio.duracion}
          soloAdultos={servicio.soloAdultos}
          masPedido={servicio.masPedido}
        />

        {/* Variantes o dinámicas interactivas si tiene */}
        {tieneOpciones && (
          <ServicioDetalle
            servicioId={servicio.id}
            servicioNombre={servicio.nombre}
            servicioCategoria={servicio.categoria}
            servicioFotoUrl={servicio.fotoUrl}
            opciones={servicio.opciones.map((o) => ({ ...o, tipo: o.tipo as TipoOpcion }))}
          />
        )}

        {/* Combina perfecto con... */}
        <ServicioCombinaCon servicios={combinaItems} />
      </div>

      {/* Barra fija inferior para agregar a Mi Fiesta */}
      <ServicioBottomBar
        servicioId={servicio.id}
        nombre={servicio.nombre}
        categoria={servicio.categoria}
        fotoUrl={servicio.fotoUrl}
      />
    </div>
  );
}
