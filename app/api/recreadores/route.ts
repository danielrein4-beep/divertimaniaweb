import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

export async function GET() {
  const recreadores = await prisma.recreador.findMany({ orderBy: { orden: "asc" } });
  return NextResponse.json({ recreadores });
}

const schema = z.object({
  nombre: z.string().trim().min(2),
  cargo: z.string().trim().min(2),
  descripcion: z.string().trim().min(2),
  fotoUrl: z.string().trim().optional().or(z.literal("")),
  orden: z.number().int().default(0),
  activo: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }

  const data = parsed.data;
  const recreador = await prisma.recreador.create({
    data: { ...data, fotoUrl: data.fotoUrl || null },
  });
  return NextResponse.json({ recreador }, { status: 201 });
}
