"use client";

import { FormEvent, useState } from "react";

type Recreador = {
  id: string;
  nombre: string;
  cargo: string;
  descripcion: string;
  fotoUrl: string | null;
  orden: number;
  activo: boolean;
};

const emptyForm = { nombre: "", cargo: "", descripcion: "", fotoUrl: "" };

export default function EquipoManager({ initialRecreadores }: { initialRecreadores: Recreador[] }) {
  const [recreadores, setRecreadores] = useState(initialRecreadores);
  const [form, setForm] = useState(emptyForm);
  const [creando, setCreando] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreando(true);
    const res = await fetch("/api/recreadores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, orden: recreadores.length, activo: true }),
    });
    if (res.ok) {
      const data = await res.json();
      setRecreadores((prev) => [...prev, data.recreador]);
      setForm(emptyForm);
    }
    setCreando(false);
  }

  async function handleToggleActivo(r: Recreador) {
    setRecreadores((prev) => prev.map((x) => (x.id === r.id ? { ...x, activo: !x.activo } : x)));
    await fetch(`/api/recreadores/${r.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...r, activo: !r.activo }),
    });
  }

  async function handleSaveEdit(r: Recreador) {
    await fetch(`/api/recreadores/${r.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(r),
    });
    setEditandoId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este recreador del equipo?")) return;
    setRecreadores((prev) => prev.filter((r) => r.id !== id));
    await fetch(`/api/recreadores/${id}`, { method: "DELETE" });
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleCreate} className="card-glass flex flex-col gap-3 rounded-2xl p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            Nombre
            <input
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Cargo
            <input
              required
              placeholder="Animador principal, Coordinador de shows..."
              value={form.cargo}
              onChange={(e) => setForm({ ...form, cargo: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          Descripción / características
          <textarea
            required
            rows={2}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="resize-none rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Foto (ruta en /public, ej. /images/nombre.jpg)
          <input
            value={form.fotoUrl}
            onChange={(e) => setForm({ ...form, fotoUrl: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
          />
        </label>
        <button
          type="submit"
          disabled={creando}
          className="self-start rounded-full bg-neon-green px-5 py-2 text-sm font-semibold text-background hover:scale-105 disabled:opacity-60"
        >
          Agregar al equipo
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {recreadores.map((r) =>
          editandoId === r.id ? (
            <div key={r.id} className="card-glass flex flex-col gap-2 rounded-xl p-4">
              <input
                value={r.nombre}
                onChange={(e) => setRecreadores((prev) => prev.map((x) => (x.id === r.id ? { ...x, nombre: e.target.value } : x)))}
                className="rounded-lg border border-border bg-background px-2 py-1 text-sm outline-none focus:border-neon-green"
              />
              <input
                value={r.cargo}
                onChange={(e) => setRecreadores((prev) => prev.map((x) => (x.id === r.id ? { ...x, cargo: e.target.value } : x)))}
                className="rounded-lg border border-border bg-background px-2 py-1 text-sm outline-none focus:border-neon-green"
              />
              <textarea
                rows={2}
                value={r.descripcion}
                onChange={(e) => setRecreadores((prev) => prev.map((x) => (x.id === r.id ? { ...x, descripcion: e.target.value } : x)))}
                className="resize-none rounded-lg border border-border bg-background px-2 py-1 text-sm outline-none focus:border-neon-green"
              />
              <input
                placeholder="/images/nombre.jpg"
                value={r.fotoUrl ?? ""}
                onChange={(e) => setRecreadores((prev) => prev.map((x) => (x.id === r.id ? { ...x, fotoUrl: e.target.value } : x)))}
                className="rounded-lg border border-border bg-background px-2 py-1 text-sm outline-none focus:border-neon-green"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveEdit(r)}
                  className="rounded-full bg-neon-green px-4 py-1.5 text-xs font-semibold text-background"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setEditandoId(null)}
                  className="rounded-full border border-border px-4 py-1.5 text-xs text-muted"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div key={r.id} className="card-glass flex items-center justify-between gap-3 rounded-xl p-4">
              <div>
                <p className="font-medium">
                  {r.nombre} {!r.activo && <span className="text-xs text-muted">(oculto)</span>}
                </p>
                <p className="text-xs text-neon-green">{r.cargo}</p>
                <p className="mt-1 text-xs text-muted">{r.descripcion}</p>
              </div>
              <div className="flex flex-none items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleActivo(r)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:border-neon-green hover:text-neon-green"
                >
                  {r.activo ? "Ocultar" : "Mostrar"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditandoId(r.id)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:border-neon-green hover:text-neon-green"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(r.id)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:border-red-400 hover:text-red-400"
                >
                  Eliminar
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
