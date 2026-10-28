import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const colorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Color inválido");

const crearSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 letras").max(40, "Máximo 40 letras"),
  color: colorSchema.optional(),
});

/** Crea una sección nueva al final. */
export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const parsed = crearSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }
  const { nombre, color } = parsed.data;

  if (await prisma.categoria.count({ where: { nombre } })) {
    return NextResponse.json({ error: `Ya existe una sección llamada "${nombre}".` }, { status: 409 });
  }
  const ultima = await prisma.categoria.aggregate({ _max: { orden: true } });
  const categoria = await prisma.categoria.create({
    data: { nombre, color: color ?? "#a8ff30", orden: (ultima._max.orden ?? -1) + 1 },
  });
  return NextResponse.json({ categoria }, { status: 201 });
}

const ordenSchema = z.object({ ids: z.array(z.string().min(1)).min(1).max(100) });

/** Guarda el orden de las secciones (como aparecen en el sitio). */
export async function PUT(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const parsed = ordenSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  await prisma.$transaction(
    parsed.data.ids.map((id, orden) => prisma.categoria.updateMany({ where: { id }, data: { orden } }))
  );
  return NextResponse.json({ ok: true });
}
