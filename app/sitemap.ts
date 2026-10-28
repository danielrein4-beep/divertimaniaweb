import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/negocio";

export const dynamic = "force-dynamic";

/** Mapa del sitio para Google: páginas fijas y la ficha de cada servicio activo. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fijas = ["", "/catalogo", "/disponibilidad", "/galeria", "/equipo", "/preguntas", "/contacto", "/catalogo/pdf"];
  const servicios = await prisma.servicio.findMany({ where: { activo: true }, select: { id: true } });
  return [
    ...fijas.map((ruta) => ({ url: `${SITE_URL}${ruta}`, changeFrequency: "weekly" as const, priority: ruta ? 0.8 : 1 })),
    ...servicios.map((s) => ({ url: `${SITE_URL}/catalogo/${s.id}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
