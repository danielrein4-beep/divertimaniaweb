"use client";

import { FormEvent, useRef, useState } from "react";
import { Film, Loader2, X } from "lucide-react";
import { TIPOS_OPCION, TIPO_OPCION_LABEL, type TipoOpcion } from "@/lib/validation";
import SubirFoto from "@/components/admin/SubirFoto";
import { subirArchivo } from "@/lib/servidor";
import { Aviso, Campo, inputClase } from "@/components/admin/ui";

export type Opcion = {
  id: string;
  tipo: TipoOpcion;
  grupo: string | null;
  nombre: string;
  descripcion: string | null;
  videoUrl: string | null;
  fotoUrl: string | null;
  orden: number;
};

export type Datos = { tipo: TipoOpcion; grupo: string; nombre: string; descripcion: string; videoUrl: string; fotoUrl: string };
export const vacio: Datos = { tipo: "VARIANTE", grupo: "", nombre: "", descripcion: "", videoUrl: "", fotoUrl: "" };

export const aDatos = (o: Opcion): Datos => ({
  tipo: o.tipo,
  grupo: o.grupo ?? "",
  nombre: o.nombre,
  descripcion: o.descripcion ?? "",
  videoUrl: o.videoUrl ?? "",
  fotoUrl: o.fotoUrl ?? "",
});

/** Variantes de personaje (con foto) y dinámicas de juego de un servicio. Cada cambio se guarda al momento. */

/** Formulario de una variante o dinámica: tipo, grupo, nombre, descripción, foto y video. */
export default function FormOpcion({
  inicial,
  textoBoton,
  onGuardar,
  onCancelar,
}: {
  inicial: Datos;
  textoBoton: string;
  onGuardar: (d: Datos) => Promise<void>;
  onCancelar: () => void;
}) {
  const [d, setD] = useState(inicial);
  const [guardando, setGuardando] = useState(false);
  const [subiendoVideo, setSubiendoVideo] = useState(false);
  const [error, setError] = useState("");
  const inputVideo = useRef<HTMLInputElement>(null);
  const set = <K extends keyof Datos>(k: K, v: Datos[K]) => setD((x) => ({ ...x, [k]: v }));
  const esVariante = d.tipo === "VARIANTE";

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError("");
    try {
      await onGuardar(d);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
      setGuardando(false);
    }
  }

  async function subirVideo(file: File | undefined) {
    if (!file) return;
    setSubiendoVideo(true);
    setError("");
    try {
      const { url, tipo } = await subirArchivo(file);
      if (tipo !== "VIDEO") throw new Error("Eso no es un video. Usa un MP4.");
      set("videoUrl", url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir el video.");
    } finally {
      setSubiendoVideo(false);
    }
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4">
      <div className="flex gap-2" role="radiogroup" aria-label="Tipo">
        {TIPOS_OPCION.map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={d.tipo === t}
            onClick={() => set("tipo", t)}
            className={`h-10 rounded-lg border px-3 text-sm font-semibold ${
              d.tipo === t ? "border-neon-green bg-neon-green/15 text-neon-green" : "border-white/15 text-foreground/80"
            }`}
          >
            {TIPO_OPCION_LABEL[t]}
          </button>
        ))}
      </div>

      <div className={`grid gap-4 ${esVariante ? "sm:grid-cols-[160px_minmax(0,1fr)]" : ""}`}>
        {esVariante && (
          <div className="mx-auto w-40 sm:mx-0">
            <SubirFoto valor={d.fotoUrl || null} onCambio={(url) => set("fotoUrl", url ?? "")} aspecto="aspect-square" />
          </div>
        )}
        <div className="flex flex-col gap-3">
          {esVariante && (
            <Campo etiqueta="Personaje" ayuda="Agrupa las variantes del mismo personaje.">
              <input required value={d.grupo} onChange={(e) => set("grupo", e.target.value)} placeholder="Rapunzel" className={inputClase} />
            </Campo>
          )}
          <Campo etiqueta="Nombre">
            <input
              required
              minLength={2}
              value={d.nombre}
              onChange={(e) => set("nombre", e.target.value)}
              placeholder={esVariante ? "Rapunzel con el príncipe" : "Carrera de biberones"}
              className={inputClase}
            />
          </Campo>
          <Campo etiqueta="Descripción (opcional)">
            <textarea rows={2} value={d.descripcion} onChange={(e) => set("descripcion", e.target.value)} className={inputClase} />
          </Campo>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {d.videoUrl ? (
              <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white/10 px-3 font-semibold">
                <Film className="h-4 w-4" aria-hidden /> Video listo
                <button type="button" onClick={() => set("videoUrl", "")} aria-label="Quitar video" className="ml-1 text-muted hover:text-red-300">
                  <X className="h-4 w-4" />
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => inputVideo.current?.click()}
                disabled={subiendoVideo}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/15 px-3 font-semibold hover:border-neon-green hover:text-neon-green"
              >
                {subiendoVideo ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Film className="h-4 w-4" aria-hidden />}
                {subiendoVideo ? "Subiendo video…" : "Video corto (opcional)"}
              </button>
            )}
            <input
              ref={inputVideo}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              className="hidden"
              onChange={(e) => subirVideo(e.target.files?.[0])}
            />
          </div>
        </div>
      </div>

      {error && <Aviso tipo="error">{error}</Aviso>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={guardando || subiendoVideo}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-neon-green px-5 text-sm font-bold text-background hover:bg-neon-green-dark disabled:opacity-50"
        >
          {guardando && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {textoBoton}
        </button>
        <button type="button" onClick={onCancelar} className="h-11 rounded-lg px-4 text-sm font-semibold text-foreground/80 hover:text-foreground">
          Cancelar
        </button>
      </div>
    </form>
  );
}
