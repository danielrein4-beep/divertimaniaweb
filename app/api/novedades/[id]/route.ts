import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  badge: z.string().trim().min(1),
  titulo: z.string().trim().min(2),
  descripcion: z.string().trim().min(2),
  fotoUrl: z.string().trim().optional().or(z.literal("")),
  ctaTexto: z.string().trim().min(1),
  ctaUrl: z.string().trim().optional().or(z.literal("")),
  activo: z.boolean(),
  orden: z.number().int(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }

  const data = parsed.data;
  const novedad = await prisma.novedad.update({
    where: { id },
    data: { ...data, fotoUrl: data.fotoUrl || null, ctaUrl: data.ctaUrl || null },
  });
  return NextResponse.json({ novedad });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.novedad.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
