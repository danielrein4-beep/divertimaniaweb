import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { detectarConflictos } from "@/lib/conflicts";

const schema = z.object({
  eventoId: z.string().nullable(),
  fecha: z.string().trim().min(8),
  horaInicio: z.string().trim().min(4),
  horaFin: z.string().trim().min(4),
  recursos: z.array(z.object({ recursoId: z.string(), cantidadUsada: z.number().int().min(1) })),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { eventoId, fecha, horaInicio, horaFin, recursos } = parsed.data;
  const conflictos = await detectarConflictos(eventoId, fecha, horaInicio, horaFin, recursos);

  return NextResponse.json({ conflictos });
}
