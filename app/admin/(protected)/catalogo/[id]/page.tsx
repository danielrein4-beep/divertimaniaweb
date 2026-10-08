import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import OpcionesManager from "@/components/admin/OpcionesManager";
import MediaManager from "@/components/admin/MediaManager";
import ServicioCamposEditor from "@/components/admin/ServicioCamposEditor";
import { type TipoOpcion, type TipoServicioMedia } from "@/lib/validation";

export default async function AdminServicioOpcionesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const servicio = await prisma.servicio.findUnique({
    where: { id },
    include: {
      opciones: { orderBy: { orden: "asc" } },
      media: { orderBy: { orden: "asc" } },
    },
  });

  if (!servicio) notFound();

  return (
    <div className="flex flex-col gap-8 pb-16">
      <div>
        <Link href="/admin/catalogo" className="text-sm text-muted hover:text-neon-green">
          ← Volver al Catálogo
        </Link>
        <h1 className="mb-1 mt-2 text-3xl font-extrabold">{servicio.nombre}</h1>
        <p className="text-sm text-muted">
          Categoría: <span className="font-semibold text-foreground">{servicio.categoria}</span>
        </p>
      </div>

      {/* Editor de campos y metadatos */}
      <ServicioCamposEditor initialServicio={servicio} />

      {/* Gestor de Fotos secundarias y Reels */}
      <MediaManager
        servicioId={servicio.id}
        initialMedia={servicio.media.map((m) => ({
          ...m,
          tipo: m.tipo as TipoServicioMedia,
        }))}
      />

      {/* Gestor de Variantes y Dinámicas */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">Variantes de Personaje o Dinámicas de Juego</h2>
          <p className="text-xs text-muted">
            Configura opciones específicas para cotizaciones (ej: princesa sola o con príncipe, dinámicas de baby shower).
          </p>
        </div>
        <OpcionesManager
          servicioId={servicio.id}
          initialOpciones={servicio.opciones.map((o) => ({ ...o, tipo: o.tipo as TipoOpcion }))}
        />
      </div>
    </div>
  );
}
