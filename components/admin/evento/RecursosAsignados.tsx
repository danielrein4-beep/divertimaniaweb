"use client";

import { TIPO_RECURSO_LABEL } from "@/lib/validation";
import type { ConflictoRecurso } from "@/lib/conflicts";

export type RecursoOpcion = { id: string; nombre: string; tipo: "PERSONAJE" | "EQUIPO" | "PERSONAL"; cantidadTotal: number };

/** Trajes, equipos y personal del evento, con aviso si chocan con otro evento a la misma hora. */
export default function RecursosAsignados({
  recursos,
  asignados,
  conflictos,
  onAlternar,
  onCantidad,
}: {
  recursos: RecursoOpcion[];
  asignados: Map<string, number>;
  conflictos: ConflictoRecurso[];
  onAlternar: (id: string) => void;
  onCantidad: (id: string, cantidad: number) => void;
}) {
  return (
    <section className="border border-white/10 bg-background-card rounded-xl p-5">
      <h2 className="mb-1 text-[15px] font-bold">Recursos asignados</h2>
      <p className="mb-4 text-xs text-muted">
        Asigna trajes, equipos o personal específico. El sistema avisa (sin bloquear) si un
        recurso queda comprometido con otro evento que se solape en horario.
      </p>

      {conflictos.length > 0 && (
        <div className="mb-4 flex flex-col gap-2 rounded-xl border border-gold/40 bg-gold/10 p-3 text-sm text-gold">
          {conflictos.map((c) => (
            <div key={c.recursoId}>
              <strong>{c.recursoNombre}</strong>: asignado {c.cantidadAsignada} de {c.cantidadTotal}{" "}
              disponibles en ese horario, junto con{" "}
              {c.eventosEnConflicto.map((ev) => `${ev.tipo} (${ev.horaInicio}-${ev.horaFin})`).join(", ")}.
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {recursos.map((r) => {
          const asignado = asignados.has(r.id);
          const tieneConflicto = conflictos.some((c) => c.recursoId === r.id);
          return (
            <div
              key={r.id}
              className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 ${
                tieneConflicto ? "border-gold/50" : "border-border"
              }`}
            >
              <label className="flex flex-1 items-center gap-2 text-sm">
                <input type="checkbox" checked={asignado} onChange={() => onAlternar(r.id)} className="h-4 w-4 accent-[#a8ff30]" />
                {r.nombre}
                <span className="text-xs text-muted">
                  ({TIPO_RECURSO_LABEL[r.tipo]} · disponibles: {r.cantidadTotal})
                </span>
              </label>
              {asignado && (
                <input
                  type="number"
                  min={1}
                  value={asignados.get(r.id)}
                  onChange={(e) => onCantidad(r.id, Number(e.target.value))}
                  className="w-16 rounded-lg border border-border bg-background px-2 py-1 text-sm outline-none focus:border-neon-green"
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
