import { after, NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { ipDelVisitante, permitirIntento } from "@/lib/limiteIntentos";
import { guardarComprobante } from "@/lib/reservas/comprobantes";
import { avisarPagoReportado } from "@/lib/reservas/avisos";
import { PAGOS } from "@/lib/negocio";
import { metodosDisponibles } from "@/lib/cuentasPago";

const datosSchema = z.object({
  metodoPago: z.string().trim().min(1, "Elige cómo pagaste").max(60),
  referenciaPago: z.string().trim().min(3, "Escribe la referencia del pago").max(80),
});

/** Público (con el enlace privado): el cliente sube el comprobante del anticipo. */
export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!permitirIntento(`pago:${ipDelVisitante(request)}`, 10, 60 * 60_000)) {
    return NextResponse.json({ error: "Demasiados intentos. Escríbenos por WhatsApp." }, { status: 429 });
  }

  const reserva = await prisma.reserva.findUnique({ where: { token } });
  if (!reserva) return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  if (reserva.estado !== "ESPERANDO_PAGO" && reserva.estado !== "PAGO_REPORTADO") {
    return NextResponse.json({ error: "Esta reserva no está esperando un pago." }, { status: 409 });
  }

  const form = await request.formData().catch(() => null);
  const archivo = form?.get("comprobante");
  const datos = datosSchema.safeParse({ metodoPago: form?.get("metodoPago"), referenciaPago: form?.get("referenciaPago") });
  if (!datos.success) return NextResponse.json({ error: datos.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  const config = await prisma.configuracionSitio.findUnique({ where: { id: "principal" }, select: { datosPago: true } });
  if (!metodosDisponibles(config?.datosPago, PAGOS.metodos).includes(datos.data.metodoPago)) {
    return NextResponse.json({ error: "Elige uno de los métodos de pago de la lista." }, { status: 400 });
  }
  if (!(archivo instanceof File) || archivo.size === 0) return NextResponse.json({ error: "Adjunta la captura del pago." }, { status: 400 });

  let comprobante: string;
  try {
    comprobante = await guardarComprobante(archivo);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo subir." }, { status: 400 });
  }

  const actualizada = await prisma.reserva.update({
    where: { id: reserva.id },
    data: { estado: "PAGO_REPORTADO", comprobante, ...datos.data },
  });
  after(() => avisarPagoReportado(actualizada));
  return NextResponse.json({ ok: true });
}
