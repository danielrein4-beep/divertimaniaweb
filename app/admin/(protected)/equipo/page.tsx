import { prisma } from "@/lib/db";
import EquipoManager from "@/components/admin/EquipoManager";
import Encabezado from "@/components/admin/Encabezado";

export const dynamic = "force-dynamic";

export default async function AdminEquipoPage() {
  const recreadores = await prisma.recreador.findMany({ orderBy: { orden: "asc" } });

  return (
    <div>
      <Encabezado
        grupo="Sitio"
        titulo="Equipo"
        descripcion="Las tarjetas de la página Equipo. Ocultar a alguien no lo borra: vuelve cuando lo actives."
      />
      <EquipoManager iniciales={recreadores} />
    </div>
  );
}
