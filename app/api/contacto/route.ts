import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  nombre: z.string().trim().min(2, "El nombre es muy corto").max(120),
  telefono: z.string().trim().min(6, "Teléfono inválido").max(30),
  email: z.string().trim().email("Email inválido").optional().or(z.literal("")),
  mensaje: z.string().trim().min(5, "Cuéntanos un poco más").max(2000),
  fechaDeseada: z.string().trim().max(20).optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  const { nombre, telefono, email, mensaje, fechaDeseada } = parsed.data;

  const solicitud = await prisma.solicitudContacto.create({
    data: {
      nombre,
      telefono,
      email: email || null,
      mensaje,
      fechaDeseada: fechaDeseada || null,
    },
  });

  return NextResponse.json({ ok: true, id: solicitud.id }, { status: 201 });
}
