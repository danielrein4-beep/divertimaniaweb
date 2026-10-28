import { prisma } from "@/lib/db";
import { CATEGORIAS } from "@/lib/site";
import { COLORES_CATEGORIA, type CategoriaInfo } from "@/lib/categorias-comun";

export { COLORES_CATEGORIA, type CategoriaInfo };

/** Secciones del catálogo en su orden. Si la tabla aún no existe o está vacía, usa las de siempre. */
export async function getCategorias(): Promise<CategoriaInfo[]> {
  const filas = await prisma.categoria
    .findMany({ orderBy: [{ orden: "asc" }, { nombre: "asc" }], select: { nombre: true, color: true } })
    .catch(() => []);
  return filas.length ? filas : CATEGORIAS.map((nombre, i) => ({ nombre, color: COLORES_CATEGORIA[i] }));
}
