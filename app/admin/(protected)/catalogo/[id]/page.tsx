import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCategorias } from "@/lib/categorias";
import ServicioEditor from "@/components/admin/ServicioEditor";
import { type TipoOpcion, type TipoServicioMedia } from "@/lib/validation";

export const dynamic = "force-dynamic";

export default async function AdminServicioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [servicio, categorias, otros] = await Promise.all([
    prisma.servicio.findUnique({
      where: { id },
      include: {
        opciones: { orderBy: { orden: "asc" } },
        media: { orderBy: { orden: "asc" } },
      },
    }),
    getCategorias(),
    prisma.servicio.findMany({
      where: { id: { not: id } },
      orderBy: [{ categoria: "asc" }, { orden: "asc" }],
      select: { id: true, nombre: true, categoria: true },
    }),
  ]);

  if (!servicio) notFound();
  const { opciones, media, ...campos } = servicio;

  return (
    <div className="mx-auto max-w-6xl">
      <ServicioEditor
        servicio={campos}
        categorias={categorias.map((c) => c.nombre)}
        otros={otros}
        media={media.map((m) => ({ ...m, tipo: m.tipo as TipoServicioMedia }))}
        opciones={opciones.map((o) => ({ ...o, tipo: o.tipo as TipoOpcion }))}
      />
    </div>
  );
}
