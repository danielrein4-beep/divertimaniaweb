"use client";

import { FormEvent, useState } from "react";

type ServicioData = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  fotoUrl: string | null;
  incluye: string | null;
  edadIdeal: string | null;
  duracion: string | null;
  masPedido: boolean;
  destacado: boolean;
  soloAdultos: boolean;
  ocasiones: string | null;
  combinaCon: string | null;
};

export default function ServicioCamposEditor({ initialServicio }: { initialServicio: ServicioData }) {
  const [servicio, setServicio] = useState<ServicioData>(initialServicio);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);

    const res = await fetch(`/api/servicios/${servicio.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: servicio.nombre,
        categoria: servicio.categoria,
        descripcion: servicio.descripcion,
        fotoUrl: servicio.fotoUrl?.trim() || null,
        incluye: servicio.incluye?.trim() || null,
        edadIdeal: servicio.edadIdeal?.trim() || null,
        duracion: servicio.duracion?.trim() || null,
        masPedido: servicio.masPedido,
        destacado: servicio.destacado,
        soloAdultos: servicio.soloAdultos,
        ocasiones: servicio.ocasiones?.trim() || null,
        combinaCon: servicio.combinaCon?.trim() || null,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setServicio(data.servicio);
      setMensaje("¡Cambios guardados exitosamente!");
      setTimeout(() => setMensaje(null), 3000);
    } else {
      setMensaje("Error al guardar los cambios.");
    }
    setGuardando(false);
  }

  return (
    <form onSubmit={handleSubmit} className="card-glass flex flex-col gap-5 rounded-2xl p-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <h2 className="text-lg font-semibold text-foreground">Detalles, Ficha y Metadatos</h2>
        {mensaje && <span className="text-sm font-medium text-neon-green">{mensaje}</span>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Foto Principal (URL)
          <input
            value={servicio.fotoUrl || ""}
            onChange={(e) => setServicio({ ...servicio, fotoUrl: e.target.value })}
            placeholder="/images/ejemplo.jpg"
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Edad Ideal (ej: 3 a 8 años)
          <input
            value={servicio.edadIdeal || ""}
            onChange={(e) => setServicio({ ...servicio, edadIdeal: e.target.value })}
            placeholder="3 a 8 años"
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Duración (ej: 1 hora, 3 horas)
          <input
            value={servicio.duracion || ""}
            onChange={(e) => setServicio({ ...servicio, duracion: e.target.value })}
            placeholder="1 hora"
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Ocasiones (separadas por comas)
          <input
            value={servicio.ocasiones || ""}
            onChange={(e) => setServicio({ ...servicio, ocasiones: e.target.value })}
            placeholder="cumpleanos, quince, boda, corporativo, graduacion, baby-shower, navidad"
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          Combina con (IDs de servicios sugeridos separados por coma)
          <input
            value={servicio.combinaCon || ""}
            onChange={(e) => setServicio({ ...servicio, combinaCon: e.target.value })}
            placeholder="id1, id2, id3"
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green font-mono text-xs"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-6 py-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={servicio.masPedido}
            onChange={(e) => setServicio({ ...servicio, masPedido: e.target.checked })}
            className="h-4 w-4 rounded accent-neon-green"
          />
          <span className="font-medium text-foreground">🔥 Más pedido</span>
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={servicio.destacado}
            onChange={(e) => setServicio({ ...servicio, destacado: e.target.checked })}
            className="h-4 w-4 rounded accent-neon-green"
          />
          <span className="font-medium text-foreground">⭐ Destacado en Inicio</span>
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={servicio.soloAdultos}
            onChange={(e) => setServicio({ ...servicio, soloAdultos: e.target.checked })}
            className="h-4 w-4 rounded accent-neon-green"
          />
          <span className="font-medium text-amber-400">🔞 Solo Adultos (+18)</span>
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Descripción general
        <textarea
          rows={2}
          value={servicio.descripcion || ""}
          onChange={(e) => setServicio({ ...servicio, descripcion: e.target.value })}
          className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Qué incluye (una viñeta por línea)
        <textarea
          rows={4}
          value={servicio.incluye || ""}
          onChange={(e) => setServicio({ ...servicio, incluye: e.target.value })}
          placeholder="Sonido profesional con DJ&#10;2 recreadores uniformados&#10;Set de pintacaritas con glitter"
          className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green text-sm"
        />
      </label>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={guardando}
          className="rounded-full bg-neon-green px-6 py-2.5 text-sm font-semibold text-background hover:scale-105 disabled:opacity-60"
        >
          {guardando ? "Guardando..." : "Guardar metadatos del servicio"}
        </button>
      </div>
    </form>
  );
}
