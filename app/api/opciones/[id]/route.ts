import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { TIPOS_OPCION } from "@/lib/validation";

const schema = z.object({
  tipo: z.enum(TIPOS_OPCION),
  grupo: z.string().trim().optional().or(z.literal("")),
  nombre: z.string().trim().min(2),
  descripcion: z.string().trim().optional().or(z.literal("")),
  videoUrl: z.string().trim().optional().or(z.literal("")),
  fotoUrl: z.string().trim().optional().or(z.literal("")),
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
  const opcion = await prisma.opcion.update({
    where: { id },
    data: {
      tipo: data.tipo,
      grupo: data.grupo || null,
      nombre: data.nombre,
      descripcion: data.descripcion || null,
      videoUrl: data.videoUrl || null,
      fotoUrl: data.fotoUrl || null,
      orden: data.orden,
    },
  });
  return NextResponse.json({ opcion });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.opcion.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
