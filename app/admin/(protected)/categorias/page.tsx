import { prisma } from "@/lib/db";
import CategoriasManager from "@/components/admin/CategoriasManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriasPage() {
  const [categorias, conteo] = await Promise.all([
    prisma.categoria.findMany({ orderBy: [{ orden: "asc" }, { nombre: "asc" }] }),
    prisma.servicio.groupBy({ by: ["categoria"], _count: { _all: true } }),
  ]);
  const porNombre = new Map(conteo.map((c) => [c.categoria, c._count._all]));

  return (
    <CategoriasManager
      iniciales={categorias.map((c) => ({ id: c.id, nombre: c.nombre, color: c.color, servicios: porNombre.get(c.nombre) ?? 0 }))}
    />
  );
}
