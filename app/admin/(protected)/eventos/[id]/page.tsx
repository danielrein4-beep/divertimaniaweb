import { notFound } from "next/navigation";
import Encabezado from "@/components/admin/Encabezado";
import EventoForm from "@/components/admin/EventoForm";
import { prisma } from "@/lib/db";
import { type EstadoEvento } from "@/lib/validation";

export const dynamic = "force-dynamic";

export default async function EditarEventoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [evento, servicios, recursos] = await Promise.all([
    prisma.evento.findUnique({
      where: { id },
      include: { cliente: true, servicios: true, recursos: true },
    }),
    prisma.servicio.findMany({ orderBy: { orden: "asc" } }),
    prisma.recurso.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  if (!evento) notFound();

  return (
    <div>
      <Encabezado grupo="Negocio · Eventos" titulo="Editar evento" descripcion="Cliente, fecha, servicios y recursos. Si algo se cruza con otro evento, te avisa antes de guardar." />
      <EventoForm
        servicios={servicios}
        recursos={recursos.map((r) => ({ ...r, tipo: r.tipo as "PERSONAJE" | "EQUIPO" | "PERSONAL" }))}
        evento={{ ...evento, estado: evento.estado as EstadoEvento }}
      />
    </div>
  );
}
