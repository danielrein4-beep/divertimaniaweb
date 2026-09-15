import EventoForm from "@/components/admin/EventoForm";
import { prisma } from "@/lib/db";

export default async function NuevoEventoPage() {
  const [servicios, recursos] = await Promise.all([
    prisma.servicio.findMany({ orderBy: { orden: "asc" } }),
    prisma.recurso.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Nuevo evento</h1>
      <EventoForm
        servicios={servicios}
        recursos={recursos.map((r) => ({ ...r, tipo: r.tipo as "PERSONAJE" | "EQUIPO" | "PERSONAL" }))}
      />
    </div>
  );
}
