"use client";

import { FormEvent, useState } from "react";
import Desplegable from "@/components/admin/Desplegable";
import { listaClase } from "@/components/admin/Encabezado";
import { Aviso } from "@/components/admin/ui";
import { useColeccion } from "@/components/admin/useColeccion";
import { TIPOS_RECURSO, TIPO_RECURSO_LABEL, type TipoRecurso } from "@/lib/validation";

type Recurso = { id: string; nombre: string; tipo: TipoRecurso; cantidadTotal: number };

const porNombre = (a: Recurso, b: Recurso) => a.nombre.localeCompare(b.nombre);

/** Inventario: trajes, equipos y personal con la cantidad disponible para los eventos. */
export default function RecursosManager({ iniciales }: { iniciales: Recurso[] }) {
  const { items: recursos, error, crear, actualizar, borrar } = useColeccion(iniciales, "/api/recursos", "recurso");
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState<TipoRecurso>("EQUIPO");
  const [cantidadTotal, setCantidadTotal] = useState(1);
  const [creando, setCreando] = useState(false);

  async function agregar(e: FormEvent) {
    e.preventDefault();
    setCreando(true);
    if (await crear({ nombre, tipo, cantidadTotal }, porNombre)) {
      setNombre("");
      setCantidadTotal(1);
    }
    setCreando(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {error && <Aviso tipo="error">{error}</Aviso>}
      <Desplegable etiqueta="Agregar recurso">
      <form onSubmit={agregar} className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Nombre
          <input
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-48 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Tipo
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoRecurso)}
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
          >
            {TIPOS_RECURSO.map((t) => (
              <option key={t} value={t}>
                {TIPO_RECURSO_LABEL[t]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Cantidad disponible
          <input
            type="number"
            min={1}
            value={cantidadTotal}
            onChange={(e) => setCantidadTotal(Number(e.target.value))}
            className="w-28 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
          />
        </label>
        <button
          type="submit"
          disabled={creando}
          className="rounded-full bg-neon-green px-5 py-2 text-sm font-semibold text-background hover:scale-105 disabled:opacity-60"
        >
          Agregar recurso
        </button>
      </form>
      </Desplegable>

      <div className={listaClase}>
        {recursos.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="font-medium">{r.nombre}</p>
              <p className="text-xs text-muted">{TIPO_RECURSO_LABEL[r.tipo]}</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-muted">
                Disponibles
                <input
                  type="number"
                  min={1}
                  value={r.cantidadTotal}
                  onChange={(e) => actualizar(r, { cantidadTotal: Number(e.target.value) })}
                  className="w-20 rounded-md border border-white/15 bg-background px-2 py-1.5 text-right font-mono tabular-nums outline-none focus:border-neon-green"
                />
              </label>
              <button
                type="button"
                onClick={() => borrar(r, "¿Eliminar este recurso?")}
                className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-muted hover:bg-red-500/10 hover:text-red-300"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
