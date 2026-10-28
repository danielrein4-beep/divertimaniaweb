import { prisma } from "@/lib/db";
import { getCategorias } from "@/lib/categorias";
import CatalogoAdmin, { type SeccionAdmin } from "@/components/admin/CatalogoAdmin";

export const dynamic = "force-dynamic";

export default async function AdminCatalogoPage() {
  const [servicios, filasCategorias, porDefecto] = await Promise.all([
    prisma.servicio.findMany({
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
      select: {
        id: true,
        nombre: true,
        categoria: true,
        descripcion: true,
        fotoUrl: true,
        activo: true,
        enPdf: true,
        masPedido: true,
        soloAdultos: true,
        _count: { select: { opciones: true, media: true } },
      },
    }),
    prisma.categoria.findMany({ orderBy: [{ orden: "asc" }, { nombre: "asc" }], select: { id: true, nombre: true, color: true } }),
    getCategorias(),
  ]);

  // Sin secciones guardadas todavía se muestran las de siempre, pero sin poder reordenarlas.
  const secciones: SeccionAdmin[] = filasCategorias.length ? filasCategorias : porDefecto.map((c) => ({ id: null, ...c }));

  return (
    <CatalogoAdmin
      secciones={secciones}
      servicios={servicios.map(({ _count, ...s }) => ({ ...s, opciones: _count.opciones, media: _count.media }))}
    />
  );
}
