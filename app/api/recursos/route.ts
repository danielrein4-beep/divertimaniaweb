import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { TIPOS_RECURSO } from "@/lib/validation";

export async function GET() {
  const recursos = await prisma.recurso.findMany({ orderBy: { nombre: "asc" } });
  return NextResponse.json({ recursos });
}

const schema = z.object({
  nombre: z.string().trim().min(2),
  tipo: z.enum(TIPOS_RECURSO),
  cantidadTotal: z.number().int().min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }

  const recurso = await prisma.recurso.create({ data: parsed.data });
  return NextResponse.json({ recurso }, { status: 201 });
}
