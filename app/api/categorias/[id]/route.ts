import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const editarSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 letras").max(40, "Máximo 40 letras").optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Color inválido").optional(),
});

/** Renombra o cambia el color de una sección. Al renombrar, sus servicios pasan al nombre nuevo. */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const parsed = editarSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }

  const actual = await prisma.categoria.findUnique({ where: { id } });
  if (!actual) return NextResponse.json({ error: "Sección no encontrada" }, { status: 404 });

  const { nombre, color } = parsed.data;
  if (nombre && nombre !== actual.nombre && (await prisma.categoria.count({ where: { nombre } }))) {
    return NextResponse.json({ error: `Ya existe una sección llamada "${nombre}".` }, { status: 409 });
  }

  const [categoria] = await prisma.$transaction([
    prisma.categoria.update({ where: { id }, data: { nombre, color } }),
    ...(nombre && nombre !== actual.nombre
      ? [prisma.servicio.updateMany({ where: { categoria: actual.nombre }, data: { categoria: nombre } })]
      : []),
  ]);
  return NextResponse.json({ categoria });
}

/** Borra una sección solo si ya no tiene servicios (para no dejar servicios huérfanos). */
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const actual = await prisma.categoria.findUnique({ where: { id } });
  if (!actual) return NextResponse.json({ error: "Sección no encontrada" }, { status: 404 });

  const servicios = await prisma.servicio.count({ where: { categoria: actual.nombre } });
  if (servicios > 0) {
    return NextResponse.json(
      { error: `"${actual.nombre}" tiene ${servicios} servicio${servicios === 1 ? "" : "s"}. Muévelos a otra sección antes de borrarla.` },
      { status: 409 }
    );
  }

  await prisma.categoria.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
