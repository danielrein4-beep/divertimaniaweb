import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id, mediaId } = await params;
  // Solo borra si el archivo pertenece a este servicio.
  const { count } = await prisma.servicioMedia.deleteMany({ where: { id: mediaId, servicioId: id } });
  if (count === 0) {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
