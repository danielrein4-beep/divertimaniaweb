import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { TIPOS_METRICA } from "@/lib/metricas";

const schema = z.object({
  tipo: z.enum(TIPOS_METRICA),
  origen: z.string().trim().max(60).optional(),
  detalle: z.string().trim().max(300).optional(),
  pagina: z.string().trim().max(200).startsWith("/").optional(),
  visitante: z.string().trim().max(64).nullable().optional(),
});

// Buscadores y previsualizadores de enlaces no cuentan como visitas reales.
const BOTS = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|headless|lighthouse/i;

export async function POST(request: NextRequest) {
  if (BOTS.test(request.headers.get("user-agent") ?? "")) return new Response(null, { status: 204 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return new Response(null, { status: 400 });

  const { tipo, origen, detalle, pagina, visitante } = parsed.data;
  await prisma.metrica.create({
    data: {
      tipo,
      origen: origen || null,
      detalle: detalle || null,
      pagina: pagina || null,
      visitante: visitante || null,
    },
  });
  return new Response(null, { status: 204 });
}
