import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const crearSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 letras"),
  categoria: z.string().trim().min(2, "Elige una sección"),
});

/** Crea un servicio nuevo (oculto hasta que tenga foto y se active) al final de su sección. */
export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const parsed = crearSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }
  const { nombre, categoria } = parsed.data;

  const ultimo = await prisma.servicio.aggregate({ where: { categoria }, _max: { orden: true } });
  const servicio = await prisma.servicio.create({
    data: { nombre, categoria, descripcion: "", activo: false, orden: (ultimo._max.orden ?? -1) + 1 },
  });
  return NextResponse.json({ servicio }, { status: 201 });
}
