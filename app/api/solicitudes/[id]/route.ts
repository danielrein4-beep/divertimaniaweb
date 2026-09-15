import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { ESTADOS_SOLICITUD } from "@/lib/validation";

const schema = z.object({ estado: z.enum(ESTADOS_SOLICITUD) });

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const solicitud = await prisma.solicitudContacto.update({ where: { id }, data: { estado: parsed.data.estado } });
  return NextResponse.json({ solicitud });
}
