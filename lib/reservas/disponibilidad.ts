// ¿Se puede apartar una fecha? Divertimania cubre varias fiestas el mismo día: la fecha está
// libre mientras los eventos confirmados más las reservas en curso no lleguen al tope diario.
import { prisma } from "@/lib/db";
import { ESTADOS_ABIERTOS } from "./estados";

export type Disponibilidad = { fecha: string; estado: "libre" | "pocas" | "completa" | "pasada"; ocupadas: number; tope: number };

export async function topeDiario(): Promise<number> {
  const fila = await prisma.configuracionSitio.findUnique({ where: { id: "principal" }, select: { eventosPorDia: true } });
  return fila?.eventosPorDia ?? 3;
}

/** Hoy en Venezuela, YYYY-MM-DD. */
export const hoyEnVenezuela = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Caracas" }).format(new Date());

export function clasificar(ocupadas: number, tope: number): Disponibilidad["estado"] {
  if (ocupadas >= tope) return "completa";
  if (tope - ocupadas === 1) return "pocas";
  return "libre";
}

export async function disponibilidad(fecha: string, sinReservaId?: string): Promise<Disponibilidad> {
  const tope = await topeDiario();
  if (fecha < hoyEnVenezuela()) return { fecha, estado: "pasada", ocupadas: 0, tope };
  const [eventos, reservas] = await Promise.all([
    prisma.evento.count({ where: { fecha, estado: { not: "CANCELADO" } } }),
    prisma.reserva.count({ where: { fecha, estado: { in: ESTADOS_ABIERTOS }, ...(sinReservaId ? { id: { not: sinReservaId } } : {}) } }),
  ]);
  const ocupadas = eventos + reservas;
  return { fecha, estado: clasificar(ocupadas, tope), ocupadas, tope };
}
