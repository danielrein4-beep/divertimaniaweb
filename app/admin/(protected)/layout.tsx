import AdminShell from "@/components/admin/AdminShell";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  // Lo que espera atención, para el globito del menú: solicitudes nuevas y reservas por cotizar o con pago por revisar.
  const [solicitudes, reservas] = await Promise.all([
    prisma.solicitudContacto.count({ where: { estado: "NUEVA" } }),
    prisma.reserva.count({ where: { estado: { in: ["SOLICITADA", "PAGO_REPORTADO"] } } }),
  ]);
  return <AdminShell avisos={{ "/admin/solicitudes": solicitudes, "/admin/reservas": reservas }}>{children}</AdminShell>;
}
