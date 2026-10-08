import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { TIPOS_SERVICIO_MEDIA, rutaLocalSchema } from "@/lib/validation";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const media = await prisma.servicioMedia.findMany({
    where: { servicioId: id },
    orderBy: { orden: "asc" },
  });
  return NextResponse.json({ media });
}

const mediaSchema = z.object({
  url: rutaLocalSchema,
  tipo: z.enum(TIPOS_SERVICIO_MEDIA),
  poster: rutaLocalSchema.nullable().optional(),
  orden: z.number().int().default(0),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = mediaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }

  const existe = await prisma.servicio.count({ where: { id } });
  if (!existe) {
    return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
  }

  const { url, tipo, poster, orden } = parsed.data;
  const media = await prisma.servicioMedia.create({
    data: { servicioId: id, url, tipo, poster: poster || null, orden },
  });

  return NextResponse.json({ media }, { status: 201 });
}
