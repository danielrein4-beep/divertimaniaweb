"use client";

import { X } from "lucide-react";
import { ListaOrdenable, useFilaOrdenable } from "./Ordenable";

export type SeccionOrden = { id: string; nombre: string; color: string; total: number };

/** Panel para ordenar las secciones arrastrando. Es el orden del sitio, del Inicio y del PDF. */
export default function OrdenSecciones({
  secciones,
  onOrden,
  onCerrar,
}: {
  secciones: SeccionOrden[];
  onOrden: (nuevas: SeccionOrden[]) => void;
  onCerrar: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center" onClick={onCerrar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-orden-secciones"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-background-elevated"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div>
            <h2 id="titulo-orden-secciones" className="text-lg font-bold">Orden de las secciones</h2>
            <p className="mt-0.5 text-xs text-muted">Arrastra para cambiar el orden en el sitio, el Inicio y el PDF. Se guarda solo.</p>
          </div>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className="rounded-lg p-2 text-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <ol className="overflow-y-auto p-2">
          <ListaOrdenable id="orden-secciones" items={secciones} onOrden={onOrden}>
            {secciones.map((sec, i) => (
              <FilaSeccion key={sec.id} seccion={sec} posicion={i} />
            ))}
          </ListaOrdenable>
        </ol>
      </div>
    </div>
  );
}

function FilaSeccion({ seccion, posicion }: { seccion: SeccionOrden; posicion: number }) {
  const { ref, estilo, agarradera, arrastrando } = useFilaOrdenable(seccion.id);
  return (
    <li
      ref={ref}
      style={estilo}
      className={`flex items-center gap-3 rounded-lg px-2 py-2 ${arrastrando ? "bg-background-card ring-1 ring-neon-green/50" : "hover:bg-white/[0.04]"}`}
    >
      {agarradera}
      <span className="w-6 text-right font-mono text-xs tabular-nums text-foreground/45">{String(posicion + 1).padStart(2, "0")}</span>
      <span className="h-5 w-1.5 rounded-full" style={{ background: seccion.color }} aria-hidden />
      <span className="flex-1 font-semibold">{seccion.nombre}</span>
      <span className="text-xs tabular-nums text-muted">{seccion.total}</span>
    </li>
  );
}
