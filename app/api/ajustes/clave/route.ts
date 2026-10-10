import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({
  actual: z.string().min(1, "Escribe tu contraseña actual"),
  nueva: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres").max(200),
});

/** Cambia la contraseña del usuario con sesión abierta. Pide la actual para confirmar que es él. */
export async function PUT(request: NextRequest) {
  const session = await getSession().catch(() => null);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }
  const { actual, nueva } = parsed.data;

  const user = await prisma.adminUser.findUnique({ where: { usuario: session.usuario } });
  if (!user || !(await bcrypt.compare(actual, user.passwordHash))) {
    return NextResponse.json({ error: "La contraseña actual no es correcta." }, { status: 400 });
  }
  if (actual === nueva) {
    return NextResponse.json({ error: "La nueva contraseña tiene que ser distinta de la actual." }, { status: 400 });
  }

  await prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(nueva, 10) } });
  return NextResponse.json({ ok: true });
}
