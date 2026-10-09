import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { esTelefonoValido, normalizarTelefono } from "@/lib/telefono";

const schema = z.object({
  whatsapp: z
    .string()
    .transform(normalizarTelefono)
    .refine(esTelefonoValido, "Escribe el número completo con código de país, por ejemplo 58 414 728 6881"),
});

export async function PUT(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }

  const config = await prisma.configuracionSitio.upsert({
    where: { id: "principal" },
    update: { whatsapp: parsed.data.whatsapp },
    create: { id: "principal", whatsapp: parsed.data.whatsapp },
  });
  return NextResponse.json({ config });
}
