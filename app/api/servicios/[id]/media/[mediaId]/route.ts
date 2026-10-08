import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { mediaId } = await params;
  await prisma.servicioMedia.delete({
    where: { id: mediaId },
  });
  return NextResponse.json({ ok: true });
}
