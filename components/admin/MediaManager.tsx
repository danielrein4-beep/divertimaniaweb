"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Film, Loader2, Star, Trash2, Upload } from "lucide-react";
import { type TipoServicioMedia } from "@/lib/validation";
import { pedir, subirArchivo } from "@/components/admin/subir";

type MediaItem = {
  id: string;
  servicioId: string;
  url: string;
  tipo: TipoServicioMedia;
  poster: string | null;
  orden: number;
};

/** Galería de un servicio: subir varias fotos/videos a la vez, ordenar, borrar y elegir portada. */
export default function MediaManager({
  servicioId,
  initialMedia,
  portada,
  onUsarComoPortada,
}: {
  servicioId: string;
  initialMedia: MediaItem[];
  portada: string | null;
  onUsarComoPortada: (url: string) => void;
}) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [progreso, setProgreso] = useState<{ hecho: number; total: number } | null>(null);
  const [encima, setEncima] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function subirVarios(files: FileList | null) {
    const lista = Array.from(files ?? []).filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
    if (!lista.length) return;
    setError("");
    setProgreso({ hecho: 0, total: lista.length });
    const fallos: string[] = [];
    let siguiente = media.length;
    for (const [i, file] of lista.entries()) {
      try {
        const { url, tipo } = await subirArchivo(file);
        const { media: nuevo } = await pedir<{ media: MediaItem }>(`/api/servicios/${servicioId}/media`, "POST", {
          url,
          tipo,
          orden: siguiente++,
        });
        setMedia((prev) => [...prev, nuevo]);
      } catch (e) {
        fallos.push(`${file.name}: ${e instanceof Error ? e.message : "no se pudo subir"}`);
      }
      setProgreso({ hecho: i + 1, total: lista.length });
    }
    setProgreso(null);
    if (fallos.length) setError(fallos.join(" · "));
    if (input.current) input.current.value = "";
  }

  async function mover(index: number, delta: -1 | 1) {
    const destino = index + delta;
    if (destino < 0 || destino >= media.length) return;
    const nueva = [...media];
    [nueva[index], nueva[destino]] = [nueva[destino], nueva[index]];
    const anterior = media;
    setMedia(nueva);
    try {
      await pedir(`/api/servicios/${servicioId}/media`, "PUT", { ids: nueva.map((m) => m.id) });
    } catch (e) {
      setMedia(anterior);
      setError(e instanceof Error ? e.message : "No se pudo ordenar.");
    }
  }

  async function borrar(item: MediaItem) {
    if (!confirm(item.tipo === "VIDEO" ? "¿Quitar este video de la galería?" : "¿Quitar esta foto de la galería?")) return;
    setError("");
    try {
      await pedir(`/api/servicios/${servicioId}/media/${item.id}`, "DELETE");
      setMedia((prev) => prev.filter((m) => m.id !== item.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo quitar.");
    }
  }

  const fotos = media.filter((m) => m.tipo === "FOTO").length;

  return (
    <section className="card-glass flex flex-col gap-4 rounded-2xl p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold">Galería</h2>
          <p className="text-sm text-muted">
            {fotos} foto{fotos === 1 ? "" : "s"} · {media.length - fotos} video{media.length - fotos === 1 ? "" : "s"}. Se ven
            en la ficha del servicio, en este orden.
          </p>
        </div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setEncima(true);
        }}
        onDragLeave={() => setEncima(false)}
        onDrop={(e) => {
          e.preventDefault();
          setEncima(false);
          subirVarios(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-7 text-center transition-colors ${
          encima ? "border-neon-green bg-neon-green/10" : "border-white/20"
        }`}
      >
        {progreso ? (
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Loader2 className="h-5 w-5 animate-spin text-neon-green" aria-hidden />
            Subiendo {Math.min(progreso.hecho + 1, progreso.total)} de {progreso.total}…
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={() => input.current?.click()}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-neon-green px-5 text-sm font-bold text-background hover:bg-neon-green-dark"
            >
              <Upload className="h-4 w-4" aria-hidden /> Subir fotos o videos
            </button>
            <p className="text-xs text-muted">Puedes elegir varias a la vez o arrastrarlas aquí. Videos MP4 hasta 80 MB.</p>
          </>
        )}
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {media.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {media.map((item, i) => {
            const esPortada = item.tipo === "FOTO" && item.url === portada;
            return (
              <li key={item.id} className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40">
                <div className="relative aspect-[4/5] w-full">
                  {item.tipo === "FOTO" ? (
                    <Image src={item.url} alt="" fill sizes="220px" className="object-cover" />
                  ) : item.poster ? (
                    <Image src={item.poster} alt="" fill sizes="220px" className="object-cover" />
                  ) : (
                    <video src={item.url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                  )}
                  {item.tipo === "VIDEO" && (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/75 px-2 py-1 text-[11px] font-bold text-white">
                      <Film className="h-3 w-3" aria-hidden /> Video
                    </span>
                  )}
                  {esPortada && (
                    <span className="absolute left-2 top-2 rounded-md bg-neon-green px-2 py-1 text-[11px] font-bold text-background">
                      Portada
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 border-t border-white/10 p-1.5">
                  <BotonIcono etiqueta="Mover antes" onClick={() => mover(i, -1)} disabled={i === 0}>
                    <ChevronLeft className="h-4 w-4" />
                  </BotonIcono>
                  <BotonIcono etiqueta="Mover después" onClick={() => mover(i, 1)} disabled={i === media.length - 1}>
                    <ChevronRight className="h-4 w-4" />
                  </BotonIcono>
                  {item.tipo === "FOTO" && !esPortada && (
                    <BotonIcono etiqueta="Usar como portada" onClick={() => onUsarComoPortada(item.url)}>
                      <Star className="h-4 w-4" />
                    </BotonIcono>
                  )}
                  <span className="flex-1" />
                  <BotonIcono etiqueta="Quitar" onClick={() => borrar(item)} peligro>
                    <Trash2 className="h-4 w-4" />
                  </BotonIcono>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <input
        ref={input}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
        className="hidden"
        onChange={(e) => subirVarios(e.target.files)}
      />
    </section>
  );
}

function BotonIcono({
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
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground/80 transition-colors disabled:opacity-30 ${
        peligro ? "hover:bg-red-500/15 hover:text-red-300" : "hover:bg-white/10 hover:text-neon-green"
      }`}
    >
      {children}
    </button>
  );
}
