import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { TIPOS_SERVICIO_MEDIA } from "@/lib/validation";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const media = await prisma.servicioMedia.findMany({
    where: { servicioId: id },
    orderBy: { orden: "asc" },
  });
  return NextResponse.json({ media });
}

const mediaSchema = z.object({
  url: z.string().trim().min(2),
  tipo: z.enum(TIPOS_SERVICIO_MEDIA),
  poster: z.string().trim().nullable().optional(),
  orden: z.number().int().default(0),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = mediaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }

  const { url, tipo, poster, orden } = parsed.data;
  const media = await prisma.servicioMedia.create({
    data: {
      servicioId: id,
      url,
      tipo,
      poster: poster || null,
      orden,
    },
  });

  return NextResponse.json({ media }, { status: 201 });
}
