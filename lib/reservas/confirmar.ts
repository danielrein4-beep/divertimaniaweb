// Confirmar una reserva: crea el cliente y el evento en el calendario, con los servicios que
// eligió en «Mi fiesta», todo en una sola transacción.
import { prisma } from "@/lib/db";
import { leerServicios } from "./estados";

/** Hora de fin por defecto: 3 horas después del inicio (se ajusta luego en el evento). */
export function sumarHoras(hhmm: string, horas: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = Math.min(h + horas, 23);
  return `${String(total).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export async function confirmarReserva(id: string) {
  return prisma.$transaction(async (tx) => {
    const r = await tx.reserva.findUnique({ where: { id } });
    if (!r) throw new Error("Reserva no encontrada");
    if (r.estado === "CONFIRMADA" && r.eventoId) return r;
    if (r.estado === "RECHAZADA") throw new Error("La reserva fue marcada como no realizada.");

    const pedidos = leerServicios(r.servicios);
    const existentes = await tx.servicio.findMany({ where: { id: { in: pedidos.map((s) => s.servicioId) } }, select: { id: true } });
    const ids = new Set(existentes.map((s) => s.id));
    const inicio = r.horaInicio || "15:00";

    const cliente = await tx.cliente.create({ data: { nombre: r.nombre, telefono: r.telefono, email: r.email } });
    const notas = [
      `Reserva ${r.codigo} desde la web.`,
      r.invitados && `Invitados: ${r.invitados}.`,
      r.montoAnticipo != null && `Anticipo: US$ ${r.montoAnticipo}${r.referenciaPago ? ` (ref. ${r.referenciaPago})` : ""}.`,
      r.montoTotal != null && `Total cotizado: US$ ${r.montoTotal}.`,
      pedidos.filter((s) => s.variante).map((s) => `${s.nombre}: ${s.variante}`).join("; ") || null,
      r.comentarios && `Comentarios: ${r.comentarios}`,
    ]
      .filter(Boolean)
      .join("\n");

    const evento = await tx.evento.create({
      data: {
        fecha: r.fecha,
        horaInicio: inicio,
        horaFin: sumarHoras(inicio, 3),
        tipo: r.tipoEvento,
        ubicacion: [r.lugar, r.zona].filter(Boolean).join(", "),
        estado: "CONFIRMADO",
        notas,
        clienteId: cliente.id,
        servicios: { create: [...ids].map((servicioId) => ({ servicioId })) },
      },
    });

    return tx.reserva.update({ where: { id }, data: { estado: "CONFIRMADA", eventoId: evento.id } });
  });
}
