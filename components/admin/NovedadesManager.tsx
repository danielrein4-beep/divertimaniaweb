"use client";

import { FormEvent, useState } from "react";

type Novedad = {
  id: string;
  badge: string;
  titulo: string;
  descripcion: string;
  fotoUrl: string | null;
  ctaTexto: string;
  ctaUrl: string | null;
  activo: boolean;
  orden: number;
};

const emptyForm = { badge: "", titulo: "", descripcion: "", fotoUrl: "", ctaTexto: "Consultar disponibilidad", ctaUrl: "" };

export default function NovedadesManager({ initialNovedades }: { initialNovedades: Novedad[] }) {
  const [novedades, setNovedades] = useState(initialNovedades);
  const [form, setForm] = useState(emptyForm);
  const [creando, setCreando] = useState(false);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreando(true);
    const res = await fetch("/api/novedades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, orden: novedades.length, activo: true }),
    });
    if (res.ok) {
      const data = await res.json();
      setNovedades((prev) => [...prev, data.novedad]);
      setForm(emptyForm);
    }
    setCreando(false);
  }

  async function handleToggleActivo(n: Novedad) {
    setNovedades((prev) => prev.map((x) => (x.id === n.id ? { ...x, activo: !x.activo } : x)));
    await fetch(`/api/novedades/${n.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...n, activo: !n.activo }),
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta novedad?")) return;
    setNovedades((prev) => prev.filter((n) => n.id !== id));
    await fetch(`/api/novedades/${id}`, { method: "DELETE" });
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleCreate} className="card-glass flex flex-col gap-3 rounded-2xl p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            Etiqueta (badge)
            <input
              required
              placeholder="Especial de Halloween"
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Título
            <input
              required
              placeholder="¡Abrimos agenda para Halloween!"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          Descripción
          <textarea
            required
            rows={2}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="resize-none rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm">
            Foto (opcional)
            <input
              placeholder="/images/nombre.jpg"
              value={form.fotoUrl}
              onChange={(e) => setForm({ ...form, fotoUrl: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Texto del botón
            <input
              value={form.ctaTexto}
              onChange={(e) => setForm({ ...form, ctaTexto: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Link del botón (opcional)
            <input
              placeholder="/disponibilidad"
              value={form.ctaUrl}
              onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={creando}
          className="self-start rounded-full bg-neon-green px-5 py-2 text-sm font-semibold text-background hover:scale-105 disabled:opacity-60"
        >
          Publicar novedad
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {novedades.length === 0 && <p className="text-sm text-muted">No hay novedades todavía.</p>}
        {novedades.map((n) => (
          <div key={n.id} className="card-glass flex items-center justify-between gap-3 rounded-xl p-4">
            <div>
              <p className="text-xs font-semibold text-neon-green">{n.badge}</p>
              <p className="font-medium">
                {n.titulo} {!n.activo && <span className="text-xs text-muted">(inactiva)</span>}
              </p>
              <p className="mt-1 text-xs text-muted">{n.descripcion}</p>
            </div>
            <div className="flex flex-none items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleActivo(n)}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:border-neon-green hover:text-neon-green"
              >
                {n.activo ? "Desactivar" : "Activar"}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(n.id)}
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
