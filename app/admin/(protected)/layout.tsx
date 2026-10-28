import AdminShell from "@/components/admin/AdminShell";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  // Cuántas solicitudes nuevas hay, para el aviso en el menú.
  const solicitudesNuevas = await prisma.solicitudContacto.count({ where: { estado: "NUEVA" } });
  return <AdminShell solicitudesNuevas={solicitudesNuevas}>{children}</AdminShell>;
}
