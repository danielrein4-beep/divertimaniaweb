import { prisma } from "@/lib/db";
import RecursosManager from "@/components/admin/RecursosManager";

export default async function RecursosPage() {
  const recursos = await prisma.recurso.findMany({ orderBy: { nombre: "asc" } });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Recursos e inventario</h1>
      <p className="mb-6 text-sm text-muted">
        Trajes, equipos y personal que se asignan a los eventos. La cantidad disponible es la
        que usa el sistema para avisar de conflictos entre eventos simultáneos.
      </p>
      <RecursosManager
        initialRecursos={recursos.map((r) => ({ ...r, tipo: r.tipo as "PERSONAJE" | "EQUIPO" | "PERSONAL" }))}
      />
    </div>
  );
}
