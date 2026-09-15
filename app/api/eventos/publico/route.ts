import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Endpoint público: solo devuelve cuántos eventos hay por fecha (sin datos de
 * clientes ni detalle). Es informativo — Divertimania puede cubrir varios
 * eventos el mismo día, así que esto NO es un calendario de "ocupado/libre".
 */
export async function GET() {
  const eventos = await prisma.evento.findMany({
    where: { estado: { not: "CANCELADO" } },
    select: { fecha: true },
  });

  const conteoPorFecha = new Map<string, number>();
  for (const e of eventos) {
    conteoPorFecha.set(e.fecha, (conteoPorFecha.get(e.fecha) ?? 0) + 1);
  }

  const resultado = Array.from(conteoPorFecha.entries()).map(([fecha, cantidad]) => ({
    fecha,
    cantidad,
  }));

  return NextResponse.json({ fechas: resultado });
}
