import Link from "next/link";
import { prisma } from "@/lib/db";
import { CATEGORIAS } from "@/lib/site";

export default async function AdminCatalogoPage() {
  const servicios = await prisma.servicio.findMany({
    orderBy: [{ categoria: "asc" }, { orden: "asc" }],
    include: { _count: { select: { opciones: true } } },
  });

  const porCategoria = new Map<string, typeof servicios>();
  for (const s of servicios) {
    const lista = porCategoria.get(s.categoria) ?? [];
    lista.push(s);
    porCategoria.set(s.categoria, lista);
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Catálogo — variantes y dinámicas</h1>
      <p className="mb-6 text-sm text-muted">
        Entra a un servicio para agregarle variantes de personaje (ej. &quot;Rapunzel sola&quot;,
        &quot;Rapunzel con el príncipe&quot;) o dinámicas/juegos seleccionables (ej. los 7+ juegos
        de un Baby Shower).
      </p>

      <div className="flex flex-col gap-8">
        {CATEGORIAS.map((categoria) => {
          const items = porCategoria.get(categoria) ?? [];
          if (items.length === 0) return null;
          return (
            <section key={categoria}>
              <h2 className="mb-3 text-lg font-semibold">{categoria}</h2>
              <div className="flex flex-col gap-2">
                {items.map((s) => (
                  <Link
                    key={s.id}
                    href={`/admin/catalogo/${s.id}`}
                    className="card-glass flex items-center justify-between gap-3 rounded-xl p-4 hover:border-neon-green/50"
                  >
                    <div>
                      <p className="font-medium">{s.nombre}</p>
                      <p className="text-xs text-muted">{s.descripcion}</p>
                    </div>
                    <span className="flex-none rounded-full border border-border px-3 py-1 text-xs text-muted">
                      {s._count.opciones} opciones
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
