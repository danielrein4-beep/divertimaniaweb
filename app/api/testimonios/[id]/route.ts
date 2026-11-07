import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { testimonioSchema } from "@/lib/testimonios";

/** Panel: guarda los cambios de un testimonio (texto, foto, orden, mostrar u ocultar). */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const parsed = testimonioSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  const d = parsed.data;
  const testimonio = await prisma.testimonio.update({ where: { id }, data: { ...d, ciudad: d.ciudad || null, fotoUrl: d.fotoUrl || null } }).catch(() => null);
  if (!testimonio) return NextResponse.json({ error: "Testimonio no encontrado" }, { status: 404 });
  return NextResponse.json({ testimonio });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  await prisma.testimonio.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
