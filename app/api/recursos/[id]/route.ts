import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { TIPOS_RECURSO } from "@/lib/validation";

const schema = z.object({
  nombre: z.string().trim().min(2),
  tipo: z.enum(TIPOS_RECURSO),
  cantidadTotal: z.number().int().min(1),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }

  const recurso = await prisma.recurso.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ recurso });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.recurso.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
