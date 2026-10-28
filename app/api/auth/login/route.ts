import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { ipDelVisitante, permitirIntento, reiniciarIntentos } from "@/lib/limiteIntentos";

const schema = z.object({
  usuario: z.string().trim().min(1),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  // Contra adivinar la clave a fuerza bruta: 5 intentos fallidos cada 15 minutos por IP.
  const clave = `login:${ipDelVisitante(request)}`;
  if (!permitirIntento(clave, 5, 15 * 60_000)) {
    return NextResponse.json({ error: "Demasiados intentos. Espera 15 minutos." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { usuario, password } = parsed.data;
  const user = await prisma.adminUser.findUnique({ where: { usuario } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });
  }

  reiniciarIntentos(clave);
  await createSession(user.usuario);
  return NextResponse.json({ ok: true });
}
