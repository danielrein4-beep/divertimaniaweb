"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Plus, Check, Sparkles, MessageCircle } from "lucide-react";
import { useMiFiesta } from "@/context/MiFiestaContext";
import { buildWhatsAppLink } from "@/lib/site";
import Button from "@/components/ui/Button";

type Opcion = {
  id: string;
  tipo: "VARIANTE" | "DINAMICA";
  grupo: string | null;
  nombre: string;
  descripcion: string | null;
  videoUrl: string | null;
  fotoUrl?: string | null;
};

export default function ServicioDetalle({
  servicioId,
  servicioNombre,
  servicioCategoria,
  servicioFotoUrl,
  opciones,
}: {
  servicioId: string;
  servicioNombre: string;
  servicioCategoria: string;
  servicioFotoUrl?: string | null;
  opciones: Opcion[];
}) {
  const variantes = opciones.filter((o) => o.tipo === "VARIANTE");
  const dinamicas = opciones.filter((o) => o.tipo === "DINAMICA");

  if (variantes.length > 0) {
    return (
      <SelectorVariantes
        servicioId={servicioId}
        servicioNombre={servicioNombre}
        servicioCategoria={servicioCategoria}
        servicioFotoUrl={servicioFotoUrl}
        variantes={variantes}
      />
    );
  }

  if (dinamicas.length > 0) {
    return (
      <SelectorDinamicas
        servicioId={servicioId}
        servicioNombre={servicioNombre}
        servicioCategoria={servicioCategoria}
        servicioFotoUrl={servicioFotoUrl}
        dinamicas={dinamicas}
      />
    );
  }

  return null;
}

function SelectorVariantes({
  servicioId,
  servicioNombre,
  servicioCategoria,
  servicioFotoUrl,
  variantes,
}: {
  servicioId: string;
  servicioNombre: string;
  servicioCategoria: string;
  servicioFotoUrl?: string | null;
  variantes: Opcion[];
}) {
  const { addItem, removeItem, isInFiesta } = useMiFiesta();

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
    <div className="card-glass rounded-2xl p-5 sm:p-7 flex flex-col gap-5">
      <div>
        <h2 className="type-h3 text-foreground font-bold">Opciones y personajes disponibles</h2>
        <p className="mt-1 text-sm text-muted">
          Elige la combinación exacta de personajes que prefieres para tu evento.
        </p>
      </div>

      {grupos.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {grupos.map(([grupo]) => (
            <button
              key={grupo}
              type="button"
              onClick={() => setGrupoActivo(grupo)}
              className={`rounded-full border px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                grupoActivo === grupo
                  ? "border-neon-green bg-neon-green/15 text-neon-green shadow-sm"
                  : "border-white/10 bg-[#161622] text-muted hover:border-white/25 hover:text-foreground"
              }`}
            >
              {grupo}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {opcionesGrupo.map((v) => {
          const added = isInFiesta(servicioId, v.nombre);
          const foto = v.fotoUrl || servicioFotoUrl;

          return (
            <div
              key={v.id}
              className={`flex flex-col justify-between overflow-hidden rounded-2xl border transition-all ${
                added
                  ? "border-neon-green/60 bg-neon-green/[0.04]"
                  : "border-white/10 bg-[#161622] hover:border-white/20"
              }`}
            >
              {foto && (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                  <Image
                    src={foto}
                    alt={v.nombre}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161622] via-transparent to-transparent opacity-80" />
                </div>
              )}

              <div className="p-4 sm:p-5 flex flex-col gap-2 flex-1">
                <h3 className="type-h3 font-bold text-foreground text-base sm:text-lg">
                  {v.nombre}
                </h3>
                {v.descripcion && (
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {v.descripcion}
                  </p>
                )}
              </div>

              <div className="p-4 pt-0 sm:p-5 sm:pt-0 flex items-center justify-between gap-2 border-t border-white/5 mt-auto">
                <Button
                  size="sm"
                  variant={added ? "primary" : "secondary"}
                  onClick={() => {
                    if (added) {
                      // remove variant
                      const itemSignature = `${servicioId}_${v.nombre}_`;
                      // find in fiesta and remove
                      removeItem(itemSignature);
                    } else {
                      addItem({
                        servicioId,
                        nombre: servicioNombre,
                        categoria: servicioCategoria,
                        fotoUrl: foto,
                        variante: v.nombre,
                      });
                    }
                  }}
                  leftIcon={added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                >
                  {added ? "En tu fiesta ✓" : "Agregar a mi fiesta"}
                </Button>

                <a
                  href={buildWhatsAppLink(
                    `Hola Divertimania 👋 Vengo de la página web y quiero cotizar la opción: ${v.nombre} de ${servicioNombre}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target text-xs text-muted hover:text-neon-green transition-colors inline-flex items-center gap-1.5 p-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Cotizar solo esta</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SelectorDinamicas({
  servicioId,
  servicioNombre,
  servicioCategoria,
  servicioFotoUrl,
  dinamicas,
}: {
  servicioId: string;
  servicioNombre: string;
  servicioCategoria: string;
  servicioFotoUrl?: string | null;
  dinamicas: Opcion[];
}) {
  const { addItem, isInFiesta, openPanel } = useMiFiesta();
  const [seleccion, setSeleccion] = useState<Set<string>>(new Set());

  const toggle = (nombre: string) => {
    setSeleccion((prev) => {
      const next = new Set(prev);
      if (next.has(nombre)) next.delete(nombre);
      else next.add(nombre);
      return next;
    });
  };

  const seleccionadas = Array.from(seleccion);
  const alreadyInCart = isInFiesta(servicioId);

  const handleGuardarEnFiesta = () => {
    addItem({
      servicioId,
      nombre: servicioNombre,
      categoria: servicioCategoria,
      fotoUrl: servicioFotoUrl,
      dinamicas: seleccionadas,
    });
  };

  return (
    <div className="card-glass rounded-2xl p-5 sm:p-7 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="type-h3 text-foreground font-bold">Juegos y dinámicas incluidas</h2>
          <p className="mt-1 text-sm text-muted">
            Marca las que más te gusten para prepararlas especialmente en tu fiesta.
          </p>
        </div>

        <Button
          onClick={handleGuardarEnFiesta}
          size="md"
          variant="primary"
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          {alreadyInCart ? "Actualizar en mi fiesta" : "Agregar servicio con dinámicas"}
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {dinamicas.map((d) => {
          const activa = seleccion.has(d.nombre);
          return (
            <label
              key={d.id}
              className={`flex cursor-pointer items-start gap-3.5 p-4 rounded-xl border transition-all select-none ${
                activa
                  ? "border-neon-green/60 bg-neon-green/[0.06] shadow-sm"
                  : "border-white/10 bg-[#161622] hover:border-white/20"
              }`}
            >
              <input
                type="checkbox"
                checked={activa}
                onChange={() => toggle(d.nombre)}
                className="mt-1 h-4 w-4 rounded accent-neon-green shrink-0"
              />
              <div className="flex flex-col gap-1">
                <span className="text-sm sm:text-base font-bold text-foreground">
                  {d.nombre}
                </span>
                {d.descripcion && (
                  <p className="text-xs text-muted leading-relaxed">{d.descripcion}</p>
                )}
                {d.videoUrl && (
                  <video
                    src={d.videoUrl}
                    muted
                    loop
                    playsInline
                    controls
                    className="mt-2 w-full rounded-lg"
                  />
                )}
              </div>
            </label>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs sm:text-sm text-muted">
        <span>
          {seleccionadas.length === 0
            ? "Puedes elegir todas las dinámicas que desees para el evento."
            : `${seleccionadas.length} dinámica(s) seleccionada(s).`}
        </span>

        <button
          type="button"
          onClick={() => openPanel(1)}
          className="text-neon-green hover:underline font-semibold cursor-pointer"
        >
          Ver mi fiesta armada →
        </button>
      </div>
    </div>
  );
}
