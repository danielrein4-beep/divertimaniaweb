"use client";

import { FormEvent, useState } from "react";
import { TIPOS_OPCION, TIPO_OPCION_LABEL, type TipoOpcion } from "@/lib/validation";

type Opcion = {
  id: string;
  tipo: TipoOpcion;
  grupo: string | null;
  nombre: string;
  descripcion: string | null;
  videoUrl: string | null;
  orden: number;
};

const emptyForm = { tipo: "DINAMICA" as TipoOpcion, grupo: "", nombre: "", descripcion: "", videoUrl: "" };

export default function OpcionesManager({ servicioId, initialOpciones }: { servicioId: string; initialOpciones: Opcion[] }) {
  const [opciones, setOpciones] = useState(initialOpciones);
  const [form, setForm] = useState(emptyForm);
  const [creando, setCreando] = useState(false);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreando(true);
    const res = await fetch(`/api/servicios/${servicioId}/opciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, orden: opciones.length }),
    });
    if (res.ok) {
      const data = await res.json();
      setOpciones((prev) => [...prev, data.opcion]);
      setForm(emptyForm);
    }
    setCreando(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta opción?")) return;
    setOpciones((prev) => prev.filter((o) => o.id !== id));
    await fetch(`/api/opciones/${id}`, { method: "DELETE" });
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleCreate} className="card-glass flex flex-col gap-3 rounded-2xl p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            Tipo
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoOpcion })}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            >
              {TIPOS_OPCION.map((t) => (
                <option key={t} value={t}>
                  {TIPO_OPCION_LABEL[t]}
                </option>
              ))}
            </select>
          </label>
          {form.tipo === "VARIANTE" && (
            <label className="flex flex-col gap-1 text-sm">
              Personaje (grupo)
              <input
                required
                placeholder="Rapunzel"
                value={form.grupo}
                onChange={(e) => setForm({ ...form, grupo: e.target.value })}
                className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
              />
            </label>
          )}
        </div>
        <label className="flex flex-col gap-1 text-sm">
          Nombre
          <input
            required
            placeholder={form.tipo === "VARIANTE" ? "Rapunzel con el príncipe" : "Carrera de biberones"}
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Descripción
          <textarea
            rows={2}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="resize-none rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Video corto (opcional — ruta en /public, ej. /videos/juego.mp4, o URL externa)
          <input
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
          />
        </label>
        <button
          type="submit"
          disabled={creando}
          className="self-start rounded-full bg-neon-green px-5 py-2 text-sm font-semibold text-background hover:scale-105 disabled:opacity-60"
        >
          Agregar opción
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {opciones.length === 0 && <p className="text-sm text-muted">Este servicio todavía no tiene variantes ni dinámicas.</p>}
        {opciones.map((o) => (
          <div key={o.id} className="card-glass flex items-center justify-between gap-3 rounded-xl p-4">
            <div>
              <p className="text-xs text-muted">
                {TIPO_OPCION_LABEL[o.tipo]}
                {o.grupo ? ` · ${o.grupo}` : ""}
              </p>
              <p className="font-medium">{o.nombre}</p>
              {o.descripcion && <p className="text-xs text-muted">{o.descripcion}</p>}
            </div>
            <button
              type="button"
              onClick={() => handleDelete(o.id)}
              className="flex-none rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:border-red-400 hover:text-red-400"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
