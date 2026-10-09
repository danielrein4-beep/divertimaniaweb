import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const ordenSchema = z.object({ ids: z.array(z.string().min(1)).min(1).max(500) });

/** Guarda el orden de los servicios de una sección: el índice en la lista pasa a ser su `orden`. */
export async function PUT(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const parsed = ordenSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  await prisma.$transaction(
    parsed.data.ids.map((id, orden) => prisma.servicio.updateMany({ where: { id }, data: { orden } }))
  );
  return NextResponse.json({ ok: true });
}
