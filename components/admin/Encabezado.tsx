import type { ReactNode } from "react";

/** Botones del panel: uno principal por pantalla (lima) y los demás con borde. */
export const botonPrimario =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-neon-green px-4 text-sm font-bold text-background transition-colors hover:bg-neon-green-dark disabled:opacity-50";
export const botonSecundario =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/15 px-3.5 text-sm font-semibold transition-colors hover:border-neon-green hover:text-neon-green disabled:opacity-50";
/** Fila de lista: mismo borde y fondo en todas las pantallas. */
export const listaClase = "overflow-hidden rounded-xl border border-white/10 divide-y divide-white/[0.07] bg-background-card";

/** Encabezado de cada pantalla del panel: grupo, título, explicación corta y acciones a la derecha. */
export default function Encabezado({
  grupo,
  titulo,
  descripcion,
  acciones,
  extra,
}: {
  grupo: ReactNode;
  titulo: ReactNode;
  descripcion?: ReactNode;
  acciones?: ReactNode;
  extra?: ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-b border-white/[0.07] pb-6">
      <div className="min-w-0 max-w-2xl">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-neon-green/80">{grupo}</p>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">{titulo}</h1>
          {extra}
        </div>
        {descripcion && <p className="mt-1.5 text-sm leading-relaxed text-muted">{descripcion}</p>}
      </div>
      {acciones && <div className="flex flex-wrap items-center gap-2">{acciones}</div>}
    </header>
  );
}

/** Estado vacío: qué es esta pantalla y el primer paso para llenarla. */
export function Vacio({ icono, titulo, texto, accion }: { icono: ReactNode; titulo: string; texto: string; accion?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-white/15 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neon-green">{icono}</span>
      <p className="mt-4 text-base font-bold">{titulo}</p>
      <p className="mt-1 max-w-sm text-sm text-muted">{texto}</p>
      {accion && <div className="mt-5">{accion}</div>}
    </div>
  );
}
