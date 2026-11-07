import { after, NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { confirmarReserva } from "@/lib/reservas/confirmar";
import { avisarConfirmacionAlCliente } from "@/lib/reservas/avisos";

const cambioSchema = z.object({
  accion: z.enum(["pedir-anticipo", "confirmar", "rechazar", "reabrir", "guardar"]),
  montoAnticipo: z.number().min(0).max(100_000).nullable().optional(),
  montoTotal: z.number().min(0).max(100_000).nullable().optional(),
  notaInterna: z.string().trim().max(2000).nullable().optional(),
});

/** Panel: cotizar (monto del anticipo), confirmar, marcar como no realizada o guardar notas. */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  const parsed = cambioSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  const { accion, ...campos } = parsed.data;

  const actual = await prisma.reserva.findUnique({ where: { id } });
  if (!actual) return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });

  if (accion === "confirmar") {
    try {
      await prisma.reserva.update({ where: { id }, data: campos });
      const reserva = await confirmarReserva(id);
      after(() => avisarConfirmacionAlCliente(reserva));
      return NextResponse.json({ reserva });
    } catch (e) {
      return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo confirmar." }, { status: 409 });
    }
  }

  if (accion === "pedir-anticipo" && !(campos.montoAnticipo ?? actual.montoAnticipo)) {
    return NextResponse.json({ error: "Escribe el monto del anticipo." }, { status: 400 });
  }
  if (actual.estado === "CONFIRMADA" && accion !== "guardar") {
    return NextResponse.json({ error: "La reserva ya está confirmada; los cambios se hacen en el evento." }, { status: 409 });
  }

  const estado = { "pedir-anticipo": "ESPERANDO_PAGO", rechazar: "RECHAZADA", reabrir: "SOLICITADA", guardar: actual.estado }[accion];
  const reserva = await prisma.reserva.update({ where: { id }, data: { ...campos, estado } });
  return NextResponse.json({ reserva });
}
