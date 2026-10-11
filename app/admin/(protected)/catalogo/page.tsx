import { prisma } from "@/lib/db";
import { getCategorias } from "@/lib/categorias";
import CatalogoAdmin from "@/components/admin/CatalogoAdmin";

export const dynamic = "force-dynamic";

export default async function AdminCatalogoPage() {
  const [servicios, categorias] = await Promise.all([
    prisma.servicio.findMany({
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
      select: {
        id: true,
        nombre: true,
        categoria: true,
        descripcion: true,
        fotoUrl: true,
        activo: true,
        masPedido: true,
        soloAdultos: true,
        _count: { select: { opciones: true, media: true } },
      },
    }),
    getCategorias(),
  ]);

  return (
    <CatalogoAdmin
      categorias={categorias}
      servicios={servicios.map(({ _count, ...s }) => ({ ...s, opciones: _count.opciones, media: _count.media }))}
    />
  );
}
