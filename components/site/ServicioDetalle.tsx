"use client";

import { useMemo, useState } from "react";
import { buildWhatsAppLink } from "@/lib/site";

type Opcion = {
  id: string;
  tipo: "VARIANTE" | "DINAMICA";
  grupo: string | null;
  nombre: string;
  descripcion: string | null;
  videoUrl: string | null;
};

export default function ServicioDetalle({
  servicioNombre,
  opciones,
}: {
  servicioNombre: string;
  opciones: Opcion[];
}) {
  const variantes = opciones.filter((o) => o.tipo === "VARIANTE");
  const dinamicas = opciones.filter((o) => o.tipo === "DINAMICA");

  if (variantes.length > 0) return <SelectorVariantes servicioNombre={servicioNombre} variantes={variantes} />;
  if (dinamicas.length > 0) return <SelectorDinamicas servicioNombre={servicioNombre} dinamicas={dinamicas} />;
  return null;
}

function SelectorVariantes({ servicioNombre, variantes }: { servicioNombre: string; variantes: Opcion[] }) {
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
    <div className="card-glass rounded-2xl p-5 sm:p-6">
      <h2 className="mb-1 text-lg font-bold">Elige tu personaje</h2>
      <p className="mb-4 text-sm text-muted">Selecciona primero quién quieres, y luego el show exacto que prefieres.</p>

      <div className="mb-5 flex flex-wrap gap-2">
        {grupos.map(([grupo]) => (
          <button
            key={grupo}
            type="button"
            onClick={() => setGrupoActivo(grupo)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              grupoActivo === grupo
                ? "border-neon-green bg-neon-green/10 text-neon-green"
                : "border-border text-muted hover:border-neon-green/50"
            }`}
          >
            {grupo}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {opcionesGrupo.map((v) => (
          <div key={v.id} className="rounded-xl border border-border bg-background-elevated p-4">
            <h3 className="font-semibold">{v.nombre}</h3>
            {v.descripcion && <p className="mt-1 text-sm text-muted">{v.descripcion}</p>}
            <a
              href={buildWhatsAppLink(`Hola Divertimania, me interesa cotizar: ${v.nombre}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded-full bg-neon-green px-4 py-2 text-sm font-semibold text-background transition-transform hover:scale-105"
            >
              Cotizar por WhatsApp
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function SelectorDinamicas({ servicioNombre, dinamicas }: { servicioNombre: string; dinamicas: Opcion[] }) {
  const [seleccion, setSeleccion] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSeleccion((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const seleccionadas = dinamicas.filter((d) => seleccion.has(d.id));
  const mensaje =
    seleccionadas.length > 0
      ? `Hola Divertimania, estoy cotizando "${servicioNombre}" y quiero incluir estas dinámicas: ${seleccionadas
          .map((d, i) => `${i + 1}. ${d.nombre}`)
          .join(", ")}.`
      : `Hola Divertimania, quiero cotizar "${servicioNombre}".`;

  return (
    <div className="pb-24">
      <div className="card-glass rounded-2xl p-5 sm:p-6">
        <h2 className="mb-1 text-lg font-bold">Dinámicas y juegos disponibles</h2>
        <p className="mb-4 text-sm text-muted">
          Marca las que quieres para tu evento — puedes elegir todas las que quieras.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {dinamicas.map((d) => {
            const activa = seleccion.has(d.id);
            return (
              <label
                key={d.id}
                className={`flex cursor-pointer flex-col gap-2 rounded-xl border p-4 transition-colors ${
                  activa ? "border-neon-green bg-neon-green/5" : "border-border bg-background-elevated"
                }`}
              >
                <div className="flex items-start gap-2">
                  <input type="checkbox" checked={activa} onChange={() => toggle(d.id)} className="mt-1" />
                  <div>
                    <h3 className="font-semibold">{d.nombre}</h3>
                    {d.descripcion && <p className="mt-1 text-sm text-muted">{d.descripcion}</p>}
                  </div>
                </div>
                {d.videoUrl && (
                  <video src={d.videoUrl} muted loop playsInline controls className="w-full rounded-lg" />
                )}
              </label>
            );
          })}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background-elevated/95 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
          <p className="text-sm text-muted">
            {seleccionadas.length === 0
              ? "No has seleccionado ninguna dinámica todavía."
              : `${seleccionadas.length} dinámica(s) seleccionada(s).`}
          </p>
          <a
            href={buildWhatsAppLink(mensaje)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-neon-green px-6 py-3 font-semibold text-background transition-transform hover:scale-105"
          >
            Cotizar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
