import { prisma } from "@/lib/db";
import SolicitudesManager from "@/components/admin/SolicitudesManager";

export default async function SolicitudesPage() {
  const solicitudes = await prisma.solicitudContacto.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Solicitudes de contacto</h1>
      <SolicitudesManager
        initialSolicitudes={solicitudes.map((s) => ({
          ...s,
          estado: s.estado as "NUEVA" | "CONTACTADA" | "CONVERTIDA" | "DESCARTADA",
          createdAt: s.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
