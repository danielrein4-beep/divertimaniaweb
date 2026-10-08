import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { normalizarLista, rutaLocalSchema } from "@/lib/validation";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const servicio = await prisma.servicio.findUnique({
    where: { id },
    include: {
      opciones: { orderBy: { orden: "asc" } },
      media: { orderBy: { orden: "asc" } },
    },
  });
  if (!servicio) {
    return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
  }
  return NextResponse.json({ servicio });
}

const updateServicioSchema = z.object({
  nombre: z.string().trim().min(2).optional(),
  categoria: z.string().trim().min(2).optional(),
  descripcion: z.string().trim().optional(),
  fotoUrl: rutaLocalSchema.nullable().optional(),
  incluye: z.string().trim().nullable().optional(),
  edadIdeal: z.string().trim().nullable().optional(),
  duracion: z.string().trim().nullable().optional(),
  masPedido: z.boolean().optional(),
  destacado: z.boolean().optional(),
  soloAdultos: z.boolean().optional(),
  ocasiones: z.string().trim().nullable().optional(),
  combinaCon: z.string().trim().nullable().optional(),
  orden: z.number().int().optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateServicioSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }

  const data = { ...parsed.data };
  if (data.ocasiones !== undefined) data.ocasiones = normalizarLista(data.ocasiones);
  if (data.combinaCon !== undefined) data.combinaCon = normalizarLista(data.combinaCon);

  const existe = await prisma.servicio.count({ where: { id } });
  if (!existe) {
    return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
  }

  const servicio = await prisma.servicio.update({ where: { id }, data });
  return NextResponse.json({ servicio });
}
