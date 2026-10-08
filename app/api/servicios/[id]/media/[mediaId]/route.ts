import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  const { mediaId } = await params;
  await prisma.servicioMedia.delete({
    where: { id: mediaId },
  });
  return NextResponse.json({ ok: true });
}
