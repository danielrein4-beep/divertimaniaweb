import { prisma } from "@/lib/db";
import EquipoManager from "@/components/admin/EquipoManager";

export default async function AdminEquipoPage() {
  const recreadores = await prisma.recreador.findMany({ orderBy: { orden: "asc" } });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Equipo de recreadores</h1>
      <p className="mb-6 text-sm text-muted">
        Esto es lo que se muestra en la página pública /equipo. Puedes ocultar a alguien sin
        borrarlo desactivando su tarjeta.
      </p>
      <EquipoManager initialRecreadores={recreadores} />
    </div>
  );
}
