import { prisma } from "@/lib/db";
import RecursosManager from "@/components/admin/RecursosManager";
import Encabezado from "@/components/admin/Encabezado";

export const dynamic = "force-dynamic";

export default async function RecursosPage() {
  const recursos = await prisma.recurso.findMany({ orderBy: { nombre: "asc" } });

  return (
    <div>
      <Encabezado
        grupo="Catálogo"
        titulo="Inventario"
        descripcion="Trajes, equipos y personal que se asignan a los eventos. Con estas cantidades el sistema avisa si dos eventos a la misma hora piden más de lo que hay."
      />
      <RecursosManager
        iniciales={recursos.map((r) => ({ ...r, tipo: r.tipo as "PERSONAJE" | "EQUIPO" | "PERSONAL" }))}
      />
    </div>
  );
}
