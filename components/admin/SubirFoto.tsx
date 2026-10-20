"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { subirArchivo } from "@/components/admin/subir";

/** Foto única (portada): se toca o se arrastra una imagen, se sube y se muestra al momento. */
export default function SubirFoto({
  valor,
  onCambio,
  aspecto = "aspect-[4/5]",
}: {
  valor: string | null;
  onCambio: (url: string | null) => void;
  aspecto?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [encima, setEncima] = useState(false);
  const [error, setError] = useState("");

  async function subir(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Eso no es una foto. Usa JPG, PNG o WEBP.");
      return;
    }
    setError("");
    setSubiendo(true);
    try {
      const { url } = await subirArchivo(file);
      onCambio(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo subir la foto.");
    } finally {
      setSubiendo(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setEncima(true);
        }}
        onDragLeave={() => setEncima(false)}
        onDrop={(e) => {
          e.preventDefault();
          setEncima(false);
          subir(e.dataTransfer.files[0]);
        }}
        className={`group relative w-full overflow-hidden rounded-xl border-2 border-dashed transition-colors ${aspecto} ${
          encima ? "border-neon-green bg-neon-green/10" : valor ? "border-transparent" : "border-white/20 bg-background"
        }`}
      >
        {valor ? (
          <Image src={valor} alt="Foto de portada" fill sizes="360px" className="object-cover" />
        ) : (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center text-sm text-foreground/80 hover:text-foreground"
          >
            <ImagePlus className="h-8 w-8 text-neon-green" aria-hidden />
            <span className="font-semibold">Toca para subir una foto</span>
            <span className="text-xs text-muted">o arrástrala aquí · JPG, PNG o WEBP</span>
          </button>
        )}

        {subiendo && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 text-sm font-semibold text-white">
            <Loader2 className="h-7 w-7 animate-spin text-neon-green" aria-hidden />
            Subiendo…
          </div>
        )}
      </div>

      {valor && !subiendo && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 text-sm font-semibold text-foreground hover:border-neon-green hover:text-neon-green"
          >
            <RefreshCw className="h-4 w-4" aria-hidden /> Cambiar foto
          </button>
          <button
            type="button"
            onClick={() => onCambio(null)}
            aria-label="Quitar foto"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-muted hover:border-red-400 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}

      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => subir(e.target.files?.[0])}
      />
    </div>
  );
}
