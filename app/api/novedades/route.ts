import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

export async function GET() {
  const novedades = await prisma.novedad.findMany({ orderBy: { orden: "asc" } });
  return NextResponse.json({ novedades });
}

const schema = z.object({
  badge: z.string().trim().min(1),
  titulo: z.string().trim().min(2),
  descripcion: z.string().trim().min(2),
  fotoUrl: z.string().trim().optional().or(z.literal("")),
  ctaTexto: z.string().trim().min(1).default("Consultar disponibilidad"),
  ctaUrl: z.string().trim().optional().or(z.literal("")),
  activo: z.boolean().default(true),
  orden: z.number().int().default(0),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }

  const data = parsed.data;
  const novedad = await prisma.novedad.create({
    data: { ...data, fotoUrl: data.fotoUrl || null, ctaUrl: data.ctaUrl || null },
  });
  return NextResponse.json({ novedad }, { status: 201 });
}
