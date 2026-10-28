"use client";

export type ServicioOpcion = { id: string; nombre: string; categoria: string };

/** Servicios del evento, agrupados por sección del catálogo; se marcan tocándolos. */
export default function ServiciosContratados({
  servicios,
  elegidos,
  onAlternar,
}: {
  servicios: ServicioOpcion[];
  elegidos: Set<string>;
  onAlternar: (id: string) => void;
}) {
  const serviciosPorCategoria = new Map<string, ServicioOpcion[]>();
  for (const s of servicios) {
    const lista = serviciosPorCategoria.get(s.categoria) ?? [];
    lista.push(s);
    serviciosPorCategoria.set(s.categoria, lista);
  }

  return (
    <section className="border border-white/10 bg-background-card rounded-xl p-5">
      <h2 className="mb-4 border-b border-white/[0.07] pb-3 text-[15px] font-bold">Servicios contratados</h2>
      <div className="flex flex-col gap-4">
        {Array.from(serviciosPorCategoria.entries()).map(([categoria, items]) => (
          <div key={categoria}>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">{categoria}</p>
            <div className="flex flex-wrap gap-2">
              {items.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => onAlternar(s.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    elegidos.has(s.id)
                      ? "border-neon-green bg-neon-green/10 text-neon-green"
                      : "border-border text-foreground/80 hover:border-neon-green/50"
                  }`}
                >
                  {s.nombre}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
