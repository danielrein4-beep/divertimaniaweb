import { after, NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ipDelVisitante, permitirIntento } from "@/lib/limiteIntentos";
import { generarCodigo, generarToken, nuevaReservaSchema } from "@/lib/reservas/estados";
import { disponibilidad } from "@/lib/reservas/disponibilidad";
import { avisarNuevaReserva } from "@/lib/reservas/avisos";

/** Público: aparta una fecha. Devuelve el enlace privado para seguir la reserva. */
export async function POST(request: NextRequest) {
  if (!permitirIntento(`reserva:${ipDelVisitante(request)}`, 5, 60 * 60_000)) {
    return NextResponse.json({ error: "Ya recibimos varias reservas desde aquí. Escríbenos por WhatsApp." }, { status: 429 });
  }

  const parsed = nuevaReservaSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  const d = parsed.data;

  const disp = await disponibilidad(d.fecha);
  if (disp.estado === "pasada") return NextResponse.json({ error: "Esa fecha ya pasó, elige otra." }, { status: 400 });
  if (disp.estado === "completa") {
    return NextResponse.json({ error: "Esa fecha ya está completa. Elige otra o escríbenos por WhatsApp." }, { status: 409 });
  }

  // El código es corto y puede repetirse: se reintenta hasta encontrar uno libre.
  let codigo = generarCodigo();
  for (let i = 0; i < 5 && (await prisma.reserva.findUnique({ where: { codigo } })); i++) codigo = generarCodigo();

  const reserva = await prisma.reserva.create({
    data: {
      codigo,
      token: generarToken(),
      fecha: d.fecha,
      horaInicio: d.horaInicio || null,
      tipoEvento: d.tipoEvento,
      zona: d.zona,
      lugar: d.lugar || null,
      invitados: d.invitados || null,
      nombre: d.nombre,
      telefono: d.telefono,
      email: d.email || null,
      comentarios: d.comentarios || null,
      servicios: d.servicios?.length ? JSON.stringify(d.servicios) : null,
    },
  });

  after(() => avisarNuevaReserva(reserva));
  return NextResponse.json({ token: reserva.token, codigo: reserva.codigo }, { status: 201 });
}
