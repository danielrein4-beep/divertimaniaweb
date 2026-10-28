import EventoForm from "@/components/admin/EventoForm";
import Encabezado from "@/components/admin/Encabezado";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NuevoEventoPage() {
  const [servicios, recursos] = await Promise.all([
    prisma.servicio.findMany({ orderBy: { orden: "asc" } }),
    prisma.recurso.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  return (
    <div>
      <Encabezado grupo="Negocio · Eventos" titulo="Nuevo evento" descripcion="Cliente, fecha, servicios y recursos. Si algo se cruza con otro evento, te avisa antes de guardar." />
      <EventoForm
        servicios={servicios}
        recursos={recursos.map((r) => ({ ...r, tipo: r.tipo as "PERSONAJE" | "EQUIPO" | "PERSONAL" }))}
      />
    </div>
  );
}
