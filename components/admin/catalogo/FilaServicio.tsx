"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpToLine, ImageOff, MoreHorizontal, Pencil, Shuffle } from "lucide-react";
import { useFilaOrdenable } from "./Ordenable";

export type ServicioFila = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  fotoUrl: string | null;
  activo: boolean;
  enPdf: boolean;
  masPedido: boolean;
  soloAdultos: boolean;
  opciones: number;
  media: number;
};

type Props = {
  servicio: ServicioFila;
  posicion: number;
  total: number;
  secciones: string[];
  ordenBloqueado: boolean;
  onCambiar: (cambio: Partial<Pick<ServicioFila, "activo" | "enPdf">>) => void;
  onExtremo: (donde: "inicio" | "fin") => void;
  onMoverSeccion: (seccion: string) => void;
};

/** Una fila del catálogo: posición, agarradera, datos y los interruptores Web / PDF. */
export default function FilaServicio({ servicio: s, posicion, total, secciones, ordenBloqueado, onCambiar, onExtremo, onMoverSeccion }: Props) {
  const { ref, estilo, agarradera, arrastrando } = useFilaOrdenable(s.id, ordenBloqueado);
  const editar = `/admin/catalogo/${s.id}`;

  return (
    <li
      ref={ref}
      style={estilo}
      className={`grid grid-cols-[auto_auto_1fr_auto] items-center gap-x-3 border-b border-white/[0.07] px-2 py-2 last:border-b-0 sm:grid-cols-[auto_auto_auto_1fr_auto] sm:px-3 ${
        arrastrando ? "bg-background-elevated shadow-[0_8px_30px_rgba(0,0,0,0.6)] ring-1 ring-neon-green/50" : "bg-background-card"
      }`}
    >
      {agarradera}
      <span className="hidden w-7 text-right font-mono text-xs tabular-nums text-foreground/45 sm:block" aria-label={`Posición ${posicion + 1}`}>
        {String(posicion + 1).padStart(2, "0")}
      </span>

      <Link href={editar} className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-black/40 ring-1 ring-white/10">
        {s.fotoUrl ? (
          <Image src={s.fotoUrl} alt="" fill sizes="44px" className={`object-cover ${s.activo ? "" : "opacity-40 grayscale"}`} />
        ) : (
          <span className="flex h-full items-center justify-center text-gold" title="Sin foto">
            <ImageOff className="h-4 w-4" aria-hidden />
          </span>
        )}
      </Link>

      <Link href={editar} className="min-w-0">
        <p className={`truncate text-[15px] font-semibold ${s.activo ? "" : "text-foreground/55"}`}>{s.nombre}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
          <span className="tabular-nums">
            {s.media > 0 ? `Galería: ${s.media}` : "Sin galería"}
            {s.opciones > 0 && ` · ${s.opciones} opciones`}
          </span>
          {!s.fotoUrl && <Marca clase="text-gold ring-gold/40">Sin foto</Marca>}
          {s.masPedido && <Marca clase="text-neon-green ring-neon-green/40">Más pedido</Marca>}
          {s.soloAdultos && <Marca clase="text-red-300 ring-red-400/40">+18</Marca>}
        </p>
      </Link>

      <div className="col-span-4 flex items-center justify-end gap-1.5 pt-2 sm:col-span-1 sm:pt-0">
        <Conmutador etiqueta="Web" activo={s.activo} ayuda={s.activo ? "Se ve en el sitio" : "Oculto en el sitio"} onClick={() => onCambiar({ activo: !s.activo })} />
        <Conmutador
          etiqueta="PDF"
          activo={s.enPdf && s.activo}
          deshabilitado={!s.activo}
          ayuda={!s.activo ? "Oculto en el sitio: tampoco sale en el PDF" : s.enPdf ? "Sale en el catálogo PDF" : "No sale en el PDF"}
          onClick={() => onCambiar({ enPdf: !s.enPdf })}
        />
        <MenuFila
          nombre={s.nombre}
          posicion={posicion}
          total={total}
          ordenBloqueado={ordenBloqueado}
          secciones={secciones.filter((x) => x !== s.categoria)}
          onExtremo={onExtremo}
          onMoverSeccion={onMoverSeccion}
        />
        <Link
          href={editar}
          aria-label={`Editar ${s.nombre}`}
          className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-semibold text-neon-green hover:bg-neon-green/10"
        >
          <Pencil className="h-4 w-4" aria-hidden /> <span className="hidden lg:inline">Editar</span>
        </Link>
      </div>
    </li>
  );
}

function Marca({ clase, children }: { clase: string; children: React.ReactNode }) {
  return <span className={`rounded px-1.5 py-px text-[10.5px] font-bold uppercase tracking-wide ring-1 ring-inset ${clase}`}>{children}</span>;
}

/** Interruptor compacto con su nombre visible (Web / PDF): se entiende sin pasar el mouse. */
function Conmutador({ etiqueta, activo, ayuda, deshabilitado, onClick }: { etiqueta: string; activo: boolean; ayuda: string; deshabilitado?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      aria-label={`${etiqueta}: ${ayuda}`}
      title={ayuda}
      disabled={deshabilitado}
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-2 rounded-md border px-2.5 text-xs font-bold tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        activo ? "border-neon-green/45 text-foreground" : "border-white/12 text-foreground/55 hover:border-white/30"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${activo ? "bg-neon-green shadow-[0_0_8px_rgba(168,255,48,0.7)]" : "bg-white/25"}`} aria-hidden />
      {etiqueta}
    </button>
  );
}

function MenuFila({
  nombre,
  posicion,
  total,
  ordenBloqueado,
  secciones,
  onExtremo,
  onMoverSeccion,
}: {
  nombre: string;
  posicion: number;
  total: number;
  ordenBloqueado: boolean;
  secciones: string[];
  onExtremo: (donde: "inicio" | "fin") => void;
  onMoverSeccion: (seccion: string) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  // Se cierra al tocar fuera o con Escape.
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => !caja.current?.contains(e.target as Node) && setAbierto(false);
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("pointerdown", fuera);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("pointerdown", fuera);
      document.removeEventListener("keydown", tecla);
    };
  }, [abierto]);

  const elegir = (accion: () => void) => {
    setAbierto(false);
    accion();
  };

  return (
    <div ref={caja} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-label={`Más acciones para ${nombre}`}
        onClick={() => setAbierto((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground/70 hover:bg-white/10 hover:text-foreground"
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden />
      </button>
      {abierto && (
        <div role="menu" className="absolute right-0 top-10 z-30 w-60 overflow-hidden rounded-lg border border-white/12 bg-background-elevated py-1 shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
          <OpcionMenu icono={<ArrowUpToLine className="h-4 w-4" />} disabled={ordenBloqueado || posicion === 0} onClick={() => elegir(() => onExtremo("inicio"))}>
            Llevar al principio
          </OpcionMenu>
          <OpcionMenu icono={<ArrowDownToLine className="h-4 w-4" />} disabled={ordenBloqueado || posicion === total - 1} onClick={() => elegir(() => onExtremo("fin"))}>
            Llevar al final
          </OpcionMenu>
          {secciones.length > 0 && (
            <>
              <p className="mt-1 border-t border-white/10 px-3 pb-1 pt-2 text-[10.5px] font-bold uppercase tracking-wider text-muted">
                <Shuffle className="mr-1.5 inline h-3 w-3" aria-hidden />
                Mover a otra sección
              </p>
              <div className="max-h-56 overflow-y-auto">
                {secciones.map((sec) => (
                  <OpcionMenu key={sec} onClick={() => elegir(() => onMoverSeccion(sec))}>
                    {sec}
                  </OpcionMenu>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function OpcionMenu({ icono, disabled, onClick, children }: { icono?: React.ReactNode; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-foreground/90 hover:bg-white/[0.06] disabled:opacity-35 disabled:hover:bg-transparent"
    >
      {icono && <span className="text-foreground/60">{icono}</span>}
      {children}
    </button>
  );
}
