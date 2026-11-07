import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { esTelefonoValido, normalizarTelefono, WHATSAPP_POR_DEFECTO } from "@/lib/telefono";

const schema = z.object({
  whatsapp: z
    .string()
    .transform(normalizarTelefono)
    .refine(esTelefonoValido, "Escribe el número completo con código de país, por ejemplo 58 414 728 6881")
    .optional(),
  // Reservas: cuentas para el anticipo y cuántas fiestas por día se aceptan.
  datosPago: z.string().trim().max(1500).nullable().optional(),
  eventosPorDia: z.number().int().min(1).max(30).optional(),
});

export async function PUT(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }

  const { whatsapp, ...reservas } = parsed.data;
  const actual = await prisma.configuracionSitio.findUnique({ where: { id: "principal" } });
  const config = await prisma.configuracionSitio.upsert({
    where: { id: "principal" },
    update: { ...(whatsapp ? { whatsapp } : {}), ...reservas },
    create: { id: "principal", whatsapp: whatsapp ?? actual?.whatsapp ?? WHATSAPP_POR_DEFECTO, ...reservas },
  });
  return NextResponse.json({ config });
}
