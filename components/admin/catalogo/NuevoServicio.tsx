"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { pedir } from "@/components/admin/subir";
import { Aviso, Campo, inputClase } from "@/components/admin/ui";

/** Ventana para crear un servicio: nombre y sección; luego se abre su ficha para completarlo. */
export default function NuevoServicio({
  categorias,
  inicial,
  onCerrar,
}: {
  categorias: string[];
  inicial: string | null;
  onCerrar: () => void;
}) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState(inicial ?? categorias[0] ?? "");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  async function crear(e: FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError("");
    try {
      const { servicio } = await pedir<{ servicio: { id: string } }>("/api/servicios", "POST", { nombre, categoria });
      router.push(`/admin/catalogo/${servicio.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear.");
      setGuardando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center" onClick={onCerrar}>
      <form
        onSubmit={crear}
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-white/10 bg-background-elevated p-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Nuevo servicio</h2>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className="rounded-lg p-2 text-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <Campo etiqueta="Nombre" ayuda="Ej: Show de Bluey, Hora Loca, Toro mecánico">
          <input autoFocus required minLength={2} value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClase} />
        </Campo>
        <Campo etiqueta="Sección">
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={inputClase}>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Campo>
        <p className="text-xs text-muted">Se crea oculto. Después le pones foto y detalles, y lo activas cuando esté listo.</p>
        {error && <Aviso tipo="error">{error}</Aviso>}
        <button
          type="submit"
          disabled={guardando}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neon-green text-sm font-bold text-background hover:bg-neon-green-dark disabled:opacity-50"
        >
          {guardando && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Crear y completar
        </button>
      </form>
    </div>
  );
}
