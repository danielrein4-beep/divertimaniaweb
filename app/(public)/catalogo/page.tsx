import { Metadata } from "next";
import { prisma } from "@/lib/db";
import CatalogoClientView, { type ServicioDTO } from "@/components/catalogo/CatalogoClientView";

export const metadata: Metadata = {
  title: "Catálogo de Shows y Animación | Divertimania Táchira",
  description:
    "Explora nuestro catálogo completo de personajes, shows temáticos, dinámicas infantiles, baby showers y eventos en todo el Estado Táchira.",
};

export const dynamic = "force-dynamic";

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; ocasion?: string; q?: string }>;
}) {
  const { categoria, ocasion } = await searchParams;

  const serviciosDb = await prisma.servicio.findMany({
    orderBy: { orden: "asc" },
    include: {
      media: {
        orderBy: { orden: "asc" },
      },
    },
  });

  const serviciosDto: ServicioDTO[] = serviciosDb.map((s) => {
    const videoMedia = s.media.find((m) => m.tipo === "VIDEO");
    return {
      id: s.id,
      nombre: s.nombre,
      categoria: s.categoria,
      descripcion: s.descripcion,
      fotoUrl: s.fotoUrl,
      videoUrl: videoMedia?.url ?? null,
      posterUrl: videoMedia?.poster ?? null,
      edadIdeal: s.edadIdeal,
      duracion: s.duracion,
      masPedido: s.masPedido,
      destacado: s.destacado,
      soloAdultos: s.soloAdultos,
      ocasiones: s.ocasiones,
      orden: s.orden,
    };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <CatalogoClientView
        initialServicios={serviciosDto}
        initialCategoria={categoria}
        initialOcasion={ocasion}
      />
    </div>
  );
}
