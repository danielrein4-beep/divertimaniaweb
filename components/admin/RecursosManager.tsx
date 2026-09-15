"use client";

import { FormEvent, useState } from "react";
import { TIPOS_RECURSO, TIPO_RECURSO_LABEL, type TipoRecurso } from "@/lib/validation";

type Recurso = { id: string; nombre: string; tipo: TipoRecurso; cantidadTotal: number };

export default function RecursosManager({ initialRecursos }: { initialRecursos: Recurso[] }) {
  const [recursos, setRecursos] = useState(initialRecursos);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState<TipoRecurso>("EQUIPO");
  const [cantidadTotal, setCantidadTotal] = useState(1);
  const [creando, setCreando] = useState(false);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreando(true);
    const res = await fetch("/api/recursos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, tipo, cantidadTotal }),
    });
    if (res.ok) {
      const data = await res.json();
      setRecursos((prev) => [...prev, data.recurso].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      setNombre("");
      setCantidadTotal(1);
    }
    setCreando(false);
  }

  async function handleUpdateCantidad(id: string, cantidadTotal: number) {
    const recurso = recursos.find((r) => r.id === id);
    if (!recurso) return;
    setRecursos((prev) => prev.map((r) => (r.id === id ? { ...r, cantidadTotal } : r)));
    await fetch(`/api/recursos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: recurso.nombre, tipo: recurso.tipo, cantidadTotal }),
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este recurso?")) return;
    setRecursos((prev) => prev.filter((r) => r.id !== id));
    await fetch(`/api/recursos/${id}`, { method: "DELETE" });
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleCreate} className="card-glass flex flex-wrap items-end gap-3 rounded-2xl p-5">
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

      <div className="flex flex-col gap-2">
        {recursos.map((r) => (
          <div key={r.id} className="card-glass flex items-center justify-between gap-3 rounded-xl p-4">
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
                  onChange={(e) => handleUpdateCantidad(r.id, Number(e.target.value))}
                  className="w-20 rounded-lg border border-border bg-background px-2 py-1 outline-none focus:border-neon-green"
                />
              </label>
              <button
                type="button"
                onClick={() => handleDelete(r.id)}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:border-red-400 hover:text-red-400"
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
