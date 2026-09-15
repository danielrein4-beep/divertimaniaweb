import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const solicitudes = await prisma.solicitudContacto.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ solicitudes });
}
