import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { leerComprobante } from "@/lib/reservas/comprobantes";

/** Panel: muestra el comprobante de pago. Nunca público: lleva datos bancarios del cliente. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const reserva = await prisma.reserva.findUnique({ where: { id }, select: { comprobante: true } });
  const archivo = reserva?.comprobante ? await leerComprobante(reserva.comprobante) : null;
  if (!archivo) return new Response("No encontrado", { status: 404 });
  return new Response(new Uint8Array(archivo), {
    headers: { "Content-Type": "image/jpeg", "Cache-Control": "private, no-store" },
  });
}
