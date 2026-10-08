"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { TIPOS_SERVICIO_MEDIA, TIPO_SERVICIO_MEDIA_LABEL, type TipoServicioMedia } from "@/lib/validation";

type MediaItem = {
  id: string;
  servicioId: string;
  url: string;
  tipo: TipoServicioMedia;
  poster: string | null;
  orden: number;
};

export default function MediaManager({
  servicioId,
  initialMedia,
}: {
  servicioId: string;
  initialMedia: MediaItem[];
}) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [url, setUrl] = useState("");
  const [tipo, setTipo] = useState<TipoServicioMedia>("FOTO");
  const [poster, setPoster] = useState("");
  const [orden, setOrden] = useState(0);
  const [guardando, setGuardando] = useState(false);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setGuardando(true);
    const res = await fetch(`/api/servicios/${servicioId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        tipo,
        poster: poster.trim() || null,
        orden,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setMedia((prev) => [...prev, data.media].sort((a, b) => a.orden - b.orden));
      setUrl("");
      setPoster("");
      setOrden(media.length + 1);
    }
    setGuardando(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este archivo multimedia del servicio?")) return;
    setMedia((prev) => prev.filter((m) => m.id !== id));
    await fetch(`/api/servicios/${servicioId}/media/${id}`, { method: "DELETE" });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Fotos y Videos (Galería y Reels)</h2>
        <span className="text-xs text-muted">{media.length} elementos</span>
      </div>

      <form onSubmit={handleCreate} className="card-glass flex flex-wrap items-end gap-3 rounded-2xl p-5">
        <label className="flex flex-col gap-1 text-sm">
          Tipo
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoServicioMedia)}
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
          >
            {TIPOS_SERVICIO_MEDIA.map((t) => (
              <option key={t} value={t}>
                {TIPO_SERVICIO_MEDIA_LABEL[t]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-[240px] flex-1 flex-col gap-1 text-sm">
          URL del recurso (ej: /images/foto.jpg o /reels/reel-1.mp4)
          <input
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/images/... o /reels/..."
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
          />
        </label>

        {tipo === "VIDEO" && (
          <label className="flex min-w-[200px] flex-col gap-1 text-sm">
            Poster (.jpg)
            <input
              value={poster}
              onChange={(e) => setPoster(e.target.value)}
              placeholder="/reels/posters/..."
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
        )}

        <label className="flex w-20 flex-col gap-1 text-sm">
          Orden
          <input
            type="number"
            value={orden}
            onChange={(e) => setOrden(Number(e.target.value))}
            className="rounded-lg border border-border bg-background px-2 py-2 outline-none focus:border-neon-green"
          />
        </label>

        <button
          type="submit"
          disabled={guardando}
          className="rounded-full bg-neon-green px-5 py-2 text-sm font-semibold text-background hover:scale-105 disabled:opacity-60"
        >
          Agregar {tipo === "VIDEO" ? "Video" : "Foto"}
        </button>
      </form>

      {media.length === 0 ? (
        <p className="text-sm text-muted">Aún no hay fotos secundarias ni videos para este servicio.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {media.map((item) => (
            <div key={item.id} className="card-glass flex flex-col gap-2 rounded-xl p-3">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/40">
                {item.tipo === "FOTO" ? (
                  <Image
                    src={item.url}
                    alt="Foto de servicio"
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                ) : (
                  <div className="relative h-full w-full">
                    {item.poster && (
                      <Image
                        src={item.poster}
                        alt="Poster de video"
                        fill
                        className="object-cover"
                        sizes="300px"
                      />
                    )}
                    <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold text-neon-green">
                      VIDEO
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="truncate max-w-[180px] font-mono">{item.url}</span>
                <span>Orden: {item.orden}</span>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="mt-1 rounded-full border border-border py-1 text-xs text-muted hover:border-red-400 hover:text-red-400"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
