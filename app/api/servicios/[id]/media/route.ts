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

const ordenSchema = z.object({ ids: z.array(z.string().min(1)).min(1).max(200) });

/** Guarda el orden de la galería: el índice en la lista pasa a ser su `orden`. */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const parsed = ordenSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  await prisma.$transaction(
    parsed.data.ids.map((mediaId, orden) =>
      prisma.servicioMedia.updateMany({ where: { id: mediaId, servicioId: id }, data: { orden } })
    )
  );
  return NextResponse.json({ ok: true });
}
