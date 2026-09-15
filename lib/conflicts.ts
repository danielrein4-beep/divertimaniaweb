import { prisma } from "@/lib/db";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd);
}

export type ConflictoRecurso = {
  recursoId: string;
  recursoNombre: string;
  cantidadTotal: number;
  cantidadAsignada: number;
  eventosEnConflicto: { id: string; tipo: string; horaInicio: string; horaFin: string }[];
};

/**
 * Para un evento (fecha + horario) y la lista de recursos que se le quieren asignar,
 * calcula si algún recurso queda sobre-asignado al sumar todos los eventos que se
 * solapan en esa fecha. No bloquea nada: solo reporta los conflictos encontrados.
 */
export async function detectarConflictos(
  eventoId: string | null,
  fecha: string,
  horaInicio: string,
  horaFin: string,
  asignaciones: { recursoId: string; cantidadUsada: number }[]
): Promise<ConflictoRecurso[]> {
  if (asignaciones.length === 0) return [];

  const recursoIds = asignaciones.map((a) => a.recursoId);

  const eventosDelDia = await prisma.evento.findMany({
    where: {
      fecha,
      estado: { not: "CANCELADO" },
      id: eventoId ? { not: eventoId } : undefined,
      recursos: { some: { recursoId: { in: recursoIds } } },
    },
    include: { recursos: true },
  });

  const eventosSolapados = eventosDelDia.filter((e) =>
    overlaps(horaInicio, horaFin, e.horaInicio, e.horaFin)
  );

  const recursos = await prisma.recurso.findMany({ where: { id: { in: recursoIds } } });
  const recursoPorId = new Map(recursos.map((r) => [r.id, r]));

  const conflictos: ConflictoRecurso[] = [];

  for (const asignacion of asignaciones) {
    const recurso = recursoPorId.get(asignacion.recursoId);
    if (!recurso) continue;

    const eventosQueUsanRecurso = eventosSolapados
      .map((e) => ({
        evento: e,
        uso: e.recursos.find((r) => r.recursoId === asignacion.recursoId),
      }))
      .filter((x) => x.uso);

    const cantidadEnOtrosEventos = eventosQueUsanRecurso.reduce(
      (sum, x) => sum + (x.uso?.cantidadUsada ?? 0),
      0
    );
    const cantidadTotalAsignada = cantidadEnOtrosEventos + asignacion.cantidadUsada;

    if (cantidadTotalAsignada > recurso.cantidadTotal) {
      conflictos.push({
        recursoId: recurso.id,
        recursoNombre: recurso.nombre,
        cantidadTotal: recurso.cantidadTotal,
        cantidadAsignada: cantidadTotalAsignada,
        eventosEnConflicto: eventosQueUsanRecurso.map((x) => ({
          id: x.evento.id,
          tipo: x.evento.tipo,
          horaInicio: x.evento.horaInicio,
          horaFin: x.evento.horaFin,
        })),
      });
    }
  }

  return conflictos;
}
