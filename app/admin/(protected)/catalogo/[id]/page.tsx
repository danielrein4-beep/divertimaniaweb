import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import OpcionesManager from "@/components/admin/OpcionesManager";
import { type TipoOpcion } from "@/lib/validation";

export default async function AdminServicioOpcionesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const servicio = await prisma.servicio.findUnique({
    where: { id },
    include: { opciones: { orderBy: { orden: "asc" } } },
  });

  if (!servicio) notFound();

  return (
    <div>
      <Link href="/admin/catalogo" className="text-sm text-muted hover:text-neon-green">
        ← Catálogo
      </Link>
      <h1 className="mb-2 mt-2 text-2xl font-bold">{servicio.nombre}</h1>
      <p className="mb-6 text-sm text-muted">{servicio.descripcion}</p>
      <OpcionesManager
        servicioId={servicio.id}
        initialOpciones={servicio.opciones.map((o) => ({ ...o, tipo: o.tipo as TipoOpcion }))}
      />
    </div>
  );
}
