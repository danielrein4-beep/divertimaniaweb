"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { TIPO_OPCION_LABEL } from "@/lib/validation";
import FormOpcion, { aDatos, vacio, type Datos, type Opcion } from "@/components/admin/opciones/FormOpcion";
import { pedir } from "@/lib/servidor";
import { Aviso } from "@/components/admin/ui";

export default function OpcionesManager({ servicioId, opcionesIniciales }: { servicioId: string; opcionesIniciales: Opcion[] }) {
  const [opciones, setOpciones] = useState(opcionesIniciales);
  const [agregando, setAgregando] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [error, setError] = useState("");

  const cuerpo = (d: Datos, orden: number) => ({ ...d, grupo: d.tipo === "VARIANTE" ? d.grupo : "", orden });

  async function crear(d: Datos) {
    const { opcion } = await pedir<{ opcion: Opcion }>(`/api/servicios/${servicioId}/opciones`, "POST", cuerpo(d, opciones.length));
    setOpciones((prev) => [...prev, opcion]);
    setAgregando(false);
  }

  async function guardar(o: Opcion, d: Datos) {
    const { opcion } = await pedir<{ opcion: Opcion }>(`/api/opciones/${o.id}`, "PUT", cuerpo(d, o.orden));
    setOpciones((prev) => prev.map((x) => (x.id === o.id ? opcion : x)));
    setEditando(null);
  }

  async function mover(i: number, delta: -1 | 1) {
    const j = i + delta;
    if (j < 0 || j >= opciones.length) return;
    const nueva = [...opciones];
    [nueva[i], nueva[j]] = [nueva[j], nueva[i]];
    const anterior = opciones;
    setOpciones(nueva);
    setError("");
    try {
      await Promise.all(
        [i, j].map((k) => pedir(`/api/opciones/${nueva[k].id}`, "PUT", cuerpo(aDatos(nueva[k]), k)))
      );
      setOpciones(nueva.map((o, k) => ({ ...o, orden: k })));
    } catch (e) {
      setOpciones(anterior);
      setError(e instanceof Error ? e.message : "No se pudo ordenar.");
    }
  }

  async function borrar(o: Opcion) {
    if (!confirm(`¿Quitar "${o.nombre}"?`)) return;
    setError("");
    try {
      await pedir(`/api/opciones/${o.id}`, "DELETE");
      setOpciones((prev) => prev.filter((x) => x.id !== o.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo quitar.");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <Aviso tipo="error">{error}</Aviso>}

      {opciones.length === 0 && !agregando && (
        <p className="text-sm text-muted">Este servicio todavía no tiene variantes ni dinámicas.</p>
      )}

      {opciones.length > 0 && (
        <ul className="overflow-hidden rounded-xl border border-white/10">
          {opciones.map((o, i) =>
            editando === o.id ? (
              <li key={o.id} className="border-b border-white/10 bg-background p-4 last:border-b-0">
                <FormOpcion inicial={aDatos(o)} textoBoton="Guardar" onGuardar={(d) => guardar(o, d)} onCancelar={() => setEditando(null)} />
              </li>
            ) : (
              <li key={o.id} className="flex items-center gap-3 border-b border-white/10 bg-background-card px-3 py-2.5 last:border-b-0">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black/40">
                  {o.fotoUrl ? (
                    <Image src={o.fotoUrl} alt="" fill sizes="56px" className="object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[10px] font-semibold uppercase text-muted">
                      {o.tipo === "VARIANTE" ? "Sin foto" : "Juego"}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted">
                    {TIPO_OPCION_LABEL[o.tipo]}
                    {o.grupo ? ` · ${o.grupo}` : ""}
                    {o.videoUrl ? " · con video" : ""}
                  </p>
                  <p className="truncate font-semibold">{o.nombre}</p>
                  {o.descripcion && <p className="truncate text-xs text-muted">{o.descripcion}</p>}
                </div>
                <div className="flex shrink-0">
                  <div className="hidden sm:flex">
                    <Icono etiqueta="Subir" onClick={() => mover(i, -1)} disabled={i === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Icono>
                    <Icono etiqueta="Bajar" onClick={() => mover(i, 1)} disabled={i === opciones.length - 1}>
                      <ArrowDown className="h-4 w-4" />
                    </Icono>
                  </div>
                  <Icono etiqueta="Editar" onClick={() => setEditando(o.id)}>
                    <Pencil className="h-4 w-4" />
                  </Icono>
                  <Icono etiqueta="Quitar" onClick={() => borrar(o)} peligro>
                    <Trash2 className="h-4 w-4" />
                  </Icono>
                </div>
              </li>
            )
          )}
        </ul>
      )}

      {agregando ? (
        <div className="rounded-xl border border-neon-green/30 bg-background p-4">
          <FormOpcion inicial={vacio} textoBoton="Agregar" onGuardar={crear} onCancelar={() => setAgregando(false)} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAgregando(true)}
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-lg border border-white/15 px-4 text-sm font-semibold hover:border-neon-green hover:text-neon-green"
        >
          <Plus className="h-4 w-4" aria-hidden /> Agregar variante o dinámica
        </button>
      )}
    </div>
  );
}

function Icono({
  etiqueta,
  onClick,
  disabled,
  peligro,
  children,
}: {
  etiqueta: string;
  onClick: () => void;
  disabled?: boolean;
  peligro?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={etiqueta}
      title={etiqueta}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground/85 disabled:opacity-25 ${
        peligro ? "hover:bg-red-500/15 hover:text-red-300" : "hover:bg-white/10 hover:text-neon-green"
      }`}
    >
      {children}
    </button>
  );
}
