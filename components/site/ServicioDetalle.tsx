"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, Plus } from "lucide-react";
import { useMiFiesta } from "@/context/MiFiestaContext";

type Opcion = {
  id: string;
  tipo: "VARIANTE" | "DINAMICA";
  grupo: string | null;
  nombre: string;
  descripcion: string | null;
  videoUrl: string | null;
  fotoUrl?: string | null;
};

type ServicioBase = {
  servicioId: string;
  servicioNombre: string;
  servicioCategoria: string;
  servicioFotoUrl?: string | null;
};

export default function ServicioDetalle({ opciones, ...servicio }: ServicioBase & { opciones: Opcion[] }) {
  const variantes = opciones.filter((o) => o.tipo === "VARIANTE");
  const dinamicas = opciones.filter((o) => o.tipo === "DINAMICA");

  if (variantes.length > 0) return <SelectorVariantes {...servicio} variantes={variantes} />;
  if (dinamicas.length > 0) return <SelectorDinamicas {...servicio} dinamicas={dinamicas} />;
  return null;
}

function SelectorVariantes({
  servicioId,
  servicioNombre,
  servicioCategoria,
  servicioFotoUrl,
  variantes,
}: ServicioBase & { variantes: Opcion[] }) {
  const { addItem, removeItem, getItem } = useMiFiesta();

  const grupos = useMemo(() => {
    const map = new Map<string, Opcion[]>();
    for (const v of variantes) {
      const key = v.grupo || servicioNombre;
      map.set(key, [...(map.get(key) ?? []), v]);
    }
    return Array.from(map.entries());
  }, [variantes, servicioNombre]);

  const [grupoActivo, setGrupoActivo] = useState<string>(grupos[0]?.[0] ?? "");
  const opcionesGrupo = grupos.find(([g]) => g === grupoActivo)?.[1] ?? [];

  return (
    <section aria-labelledby="variantes-titulo" className="flex flex-col gap-5">
      <div>
        <h2 id="variantes-titulo" className="type-h3 font-bold">
          Elige tu personaje
        </h2>
        <p className="mt-1 text-sm text-muted">Primero el personaje, después el show exacto. Puedes sumar varios.</p>
      </div>

      {grupos.length > 1 && (
        <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist">
          {grupos.map(([grupo]) => (
            <button
              key={grupo}
              type="button"
              role="tab"
              aria-selected={grupoActivo === grupo}
              onClick={() => setGrupoActivo(grupo)}
              className={`touch-target shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${
                grupoActivo === grupo
                  ? "border-neon-green bg-neon-green/15 text-neon-green"
                  : "border-border text-muted hover:border-white/25 hover:text-foreground"
              }`}
            >
              {grupo}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {opcionesGrupo.map((v) => {
          const enFiesta = getItem(servicioId, v.nombre);
          const foto = v.fotoUrl || servicioFotoUrl;

          return (
            <div
              key={v.id}
              className={`flex flex-col overflow-hidden rounded-2xl border transition-colors ${
                enFiesta ? "border-neon-green/70" : "border-border"
              } bg-background-card`}
            >
              {foto && (
                <div className="relative aspect-[4/5] w-full bg-background-elevated">
                  <Image src={foto} alt={v.nombre} fill className="object-cover" sizes="(max-width: 640px) 50vw, 300px" />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
                <h3 className="text-sm font-bold leading-tight sm:text-base">{v.nombre}</h3>
                {v.descripcion && <p className="line-clamp-3 text-xs text-muted sm:text-sm">{v.descripcion}</p>}
              </div>
              <div className="p-3 pt-0 sm:p-4 sm:pt-0">
                <button
                  type="button"
                  aria-pressed={Boolean(enFiesta)}
                  onClick={() =>
                    enFiesta
                      ? removeItem(enFiesta.id)
                      : addItem({
                          servicioId,
                          nombre: servicioNombre,
                          categoria: servicioCategoria,
                          fotoUrl: foto,
                          variante: v.nombre,
                        })
                  }
                  className={`touch-target flex w-full items-center justify-center gap-1.5 rounded-full px-3 text-xs font-bold transition-colors sm:text-sm ${
                    enFiesta
                      ? "bg-neon-green text-background"
                      : "border border-white/15 text-foreground hover:border-neon-green hover:text-neon-green"
                  }`}
                >
                  {enFiesta ? <Check className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
                  {enFiesta ? "En tu fiesta" : "Agregar"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SelectorDinamicas({
  servicioId,
  servicioNombre,
  servicioCategoria,
  servicioFotoUrl,
  dinamicas,
}: ServicioBase & { dinamicas: Opcion[] }) {
  const { addItem, getItem } = useMiFiesta();
  const enFiesta = getItem(servicioId, null);
  // null = el cliente todavía no tocó nada: se muestra lo que ya está guardado en su fiesta.
  const [editadas, setEditadas] = useState<string[] | null>(null);
  const seleccion = editadas ?? enFiesta?.dinamicas ?? [];
  const sinGuardar = editadas !== null;

  const toggle = (nombre: string) =>
    setEditadas(seleccion.includes(nombre) ? seleccion.filter((n) => n !== nombre) : [...seleccion, nombre]);

  const guardar = () => {
    addItem({
      servicioId,
      nombre: servicioNombre,
      categoria: servicioCategoria,
      fotoUrl: servicioFotoUrl,
      dinamicas: dinamicas.map((d) => d.nombre).filter((n) => seleccion.includes(n)),
    });
    setEditadas(null);
  };

  return (
    <section aria-labelledby="dinamicas-titulo" className="flex flex-col gap-5">
      <div>
        <h2 id="dinamicas-titulo" className="type-h3 font-bold">
          Elige las dinámicas
        </h2>
        <p className="mt-1 text-sm text-muted">Marca las que quieres en tu evento. Puedes elegir todas.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {dinamicas.map((d) => {
          const activa = seleccion.includes(d.nombre);
          return (
            <label
              key={d.id}
              className={`flex cursor-pointer select-none items-start gap-3 rounded-2xl border p-4 transition-colors ${
                activa ? "border-neon-green/70 bg-neon-green/[0.06]" : "border-border bg-background-card hover:border-white/20"
              }`}
            >
              <input
                type="checkbox"
                checked={activa}
                onChange={() => toggle(d.nombre)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--neon-green)]"
              />
              <span className="flex flex-col gap-1">
                <span className="font-bold">{d.nombre}</span>
                {d.descripcion && <span className="text-sm text-muted">{d.descripcion}</span>}
              </span>
            </label>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {seleccion.length === 0
            ? "Si no eliges ninguna, te recomendamos las mejores para tu evento."
            : `${seleccion.length} ${seleccion.length === 1 ? "dinámica elegida" : "dinámicas elegidas"}`}
        </p>
        <button
          type="button"
          onClick={guardar}
          disabled={Boolean(enFiesta) && !sinGuardar}
          className="touch-target shrink-0 rounded-full bg-neon-green px-5 text-sm font-bold text-background transition-colors hover:bg-neon-green-dark disabled:bg-white/10 disabled:text-muted"
        >
          {!enFiesta ? "Agregar a mi fiesta" : sinGuardar ? "Guardar cambios" : "Guardado en tu fiesta"}
        </button>
      </div>
    </section>
  );
}
