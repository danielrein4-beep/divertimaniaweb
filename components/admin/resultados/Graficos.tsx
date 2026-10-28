// Piezas visuales de Resultados: cifra destacada, barras por día y ranking.
import { numero } from "@/lib/resultados";

export function Dato({ titulo, valor, nota, destacado }: { titulo: string; valor: string; nota: string; destacado?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${destacado ? "border-neon-green/40 bg-neon-green/[0.06]" : "border-border bg-background-card"}`}>
      <p className="text-sm text-muted">{titulo}</p>
      <p className="mt-1 text-3xl font-extrabold tabular-nums">{valor}</p>
      <p className="mt-1 text-xs text-muted">{nota}</p>
    </div>
  );
}

export function Barras({
  titulo,
  unidad,
  datos,
}: {
  titulo: string;
  unidad: string;
  datos: { clave: string; etiqueta: string; valor: number }[];
}) {
  const max = Math.max(1, ...datos.map((d) => d.valor));
  const total = datos.reduce((s, d) => s + d.valor, 0);
  const cadaCuanto = Math.ceil(datos.length / 6);
  return (
    <figure className="border border-white/10 bg-background-card rounded-xl p-5">
      <figcaption className="mb-4 flex items-baseline justify-between gap-2">
        <span className="font-semibold">{titulo}</span>
        <span className="text-sm tabular-nums text-muted">
          {numero.format(total)} {unidad}
        </span>
      </figcaption>
      <div className="relative">
                <ol className="flex h-36 items-end gap-[2px]" aria-label={titulo}>
          {datos.map((d) => (
            <li key={d.clave} className="group relative flex h-full flex-1 items-end">
              <span
                className="w-full rounded-t-[4px] bg-neon-green/80 transition-colors group-hover:bg-neon-green"
                style={{ height: d.valor > 0 ? `${Math.max(3, (d.valor / max) * 100)}%` : "1px" }}
              />
              <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-background-elevated px-2 py-1 text-xs group-hover:block">
                <span className="text-muted">{d.etiqueta}:</span> <strong className="tabular-nums">{d.valor}</strong>
              </span>
              <span className="sr-only">
                {d.etiqueta}: {d.valor}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div aria-hidden className="mt-2 flex gap-[2px] text-[10px] text-muted">
        {datos.map((d, i) => (
          <span key={d.clave} className="flex-1 overflow-visible whitespace-nowrap">
            {i % cadaCuanto === 0 ? d.etiqueta : ""}
          </span>
        ))}
      </div>
    </figure>
  );
}

export function Ranking({
  titulo,
  filas,
  vacio,
  nota,
}: {
  titulo: string;
  filas: [string, number][];
  vacio: string;
  nota?: string;
}) {
  const max = Math.max(1, ...filas.map(([, v]) => v));
  return (
    <div className="border border-white/10 bg-background-card rounded-xl p-5">
      <h2 className="font-semibold">{titulo}</h2>
      {nota && <p className="text-xs text-muted">{nota}</p>}
      {filas.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{vacio}</p>
      ) : (
        <ol className="mt-3 flex flex-col gap-2.5">
          {filas.map(([nombre, valor]) => (
            <li key={nombre} className="text-sm">
              <div className="flex justify-between gap-3">
                <span className="truncate">{nombre}</span>
                <span className="tabular-nums text-muted">{valor}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-white/5">
                <div className="h-full rounded-full bg-neon-green/70" style={{ width: `${(valor / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
