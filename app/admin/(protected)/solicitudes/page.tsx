import { prisma } from "@/lib/db";
import SolicitudesManager from "@/components/admin/SolicitudesManager";
import Encabezado from "@/components/admin/Encabezado";

export const dynamic = "force-dynamic";

export default async function SolicitudesPage() {
  const solicitudes = await prisma.solicitudContacto.findMany({ orderBy: { createdAt: "desc" } });
  const nuevas = solicitudes.filter((s) => s.estado === "NUEVA").length;

  return (
    <div>
      <Encabezado
        grupo="Negocio"
        titulo="Solicitudes"
        extra={nuevas > 0 ? <span className="font-mono text-sm tabular-nums text-neon-green">{nuevas} nueva{nuevas === 1 ? "" : "s"}</span> : null}
        descripcion="Lo que la gente deja en el formulario de Contacto. Márcalas a medida que las atiendes."
      />
      <SolicitudesManager
        iniciales={solicitudes.map((s) => ({
          ...s,
          estado: s.estado as "NUEVA" | "CONTACTADA" | "CONVERTIDA" | "DESCARTADA",
          createdAt: s.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
