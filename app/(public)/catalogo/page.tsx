import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getCategorias } from "@/lib/categorias";
import CatalogoExplorer, { type ServicioCatalogo } from "@/components/site/CatalogoExplorer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de shows y personajes | Divertimania",
  description:
    "Personajes, shows, animación infantil, baby showers y atracciones en el Táchira. Arma tu fiesta y pide tu cotización por WhatsApp.",
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; ocasion?: string; q?: string }>;
}) {
  const { categoria, ocasion, q } = await searchParams;
  const [servicios, categorias] = await Promise.all([
    prisma.servicio.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
      include: {
        media: { where: { tipo: "VIDEO" }, orderBy: { orden: "asc" }, take: 1 },
        _count: { select: { opciones: true } },
      },
    }),
    getCategorias(),
  ]);

  const data: ServicioCatalogo[] = servicios.map((s) => ({
    id: s.id,
    nombre: s.nombre,
    categoria: s.categoria,
    descripcion: s.descripcion,
    fotoUrl: s.fotoUrl,
    videoUrl: s.media[0]?.url ?? null,
    posterUrl: s.media[0]?.poster ?? null,
    edadIdeal: s.edadIdeal,
    duracion: s.duracion,
    masPedido: s.masPedido,
    soloAdultos: s.soloAdultos,
    ocasiones: (s.ocasiones ?? "").split(",").map((o) => o.trim()).filter(Boolean),
    tieneOpciones: s._count.opciones > 0,
  }));

  return (
    <CatalogoExplorer
      servicios={data}
      categorias={categorias}
      categoriaInicial={categoria ?? null}
      ocasionInicial={ocasion ?? null}
      busquedaInicial={q ?? ""}
    />
  );
}
