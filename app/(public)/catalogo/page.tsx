import type { Metadata } from "next";
import { clipDeTarjeta } from "@/lib/clipTarjeta";
import { prisma } from "@/lib/db";
import { getCategorias } from "@/lib/categorias";
import DescargarCatalogoPdf from "@/components/site/DescargarCatalogoPdf";
import CatalogoExplorer, { type ServicioCatalogo } from "@/components/site/CatalogoExplorer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de shows y personajes | Divertimania",
  description:
    "Personajes, shows, animación infantil, baby showers y atracciones en toda Venezuela. Descarga el catálogo en PDF o arma tu fiesta y pide tu cotización por WhatsApp.",
};

// Nombres viejos de sección (enlaces ya compartidos) → las 3 nuevas.
const SECCION_ANTIGUA: Record<string, string> = {
  "Personajes Infantiles": "Personajes",
  "Show para Adultos": "Personajes",
  "Fiestas Infantiles": "Servicios para tu fiesta",
  "Para Niños": "Servicios para tu fiesta",
  "Estaciones de Comida": "Servicios para tu fiesta",
  "Baby Shower": "Celebraciones",
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
        media: { where: { tipo: "VIDEO" }, orderBy: { orden: "asc" }, take: 4 },
        _count: { select: { opciones: true } },
      },
    }),
    getCategorias(),
  ]);

  const data: ServicioCatalogo[] = servicios.map((s) => ({
    id: s.id,
    nombre: s.nombre,
    categoria: s.categoria,
    subcategoria: s.subcategoria,
    descripcion: s.descripcion,
    fotoUrl: s.fotoUrl,
    videos: s.media.map((m) => clipDeTarjeta(m.url, m.poster)),
    edadIdeal: s.edadIdeal,
    duracion: s.duracion,
    masPedido: s.masPedido,
    soloAdultos: s.soloAdultos,
    ocasiones: (s.ocasiones ?? "").split(",").map((o) => o.trim()).filter(Boolean),
    tieneOpciones: s._count.opciones > 0,
  }));

  return (
    <>
      <CatalogoExplorer
        servicios={data}
        categorias={categorias}
        categoriaInicial={categoria ? (SECCION_ANTIGUA[categoria] ?? categoria) : null}
        ocasionInicial={ocasion ?? null}
        busquedaInicial={q ?? ""}
      />
      <DescargarCatalogoPdf />
    </>
  );
}
