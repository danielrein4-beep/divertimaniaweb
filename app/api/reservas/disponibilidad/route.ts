import { NextRequest, NextResponse } from "next/server";
import { disponibilidad } from "@/lib/reservas/disponibilidad";

/** Público: si una fecha se puede apartar. Solo dice libre/pocas/completa, sin datos de nadie. */
export async function GET(request: NextRequest) {
  const fecha = request.nextUrl.searchParams.get("fecha") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });
  const { estado } = await disponibilidad(fecha);
  return NextResponse.json({ fecha, estado });
}
