import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { testimonioSchema } from "@/lib/testimonios";

/** Panel: agrega un testimonio. */
export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = testimonioSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  const d = parsed.data;
  const testimonio = await prisma.testimonio.create({ data: { ...d, ciudad: d.ciudad || null, fotoUrl: d.fotoUrl || null } });
  return NextResponse.json({ testimonio }, { status: 201 });
}
