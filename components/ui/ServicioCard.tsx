"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Clock, Flame, Plus, Users } from "lucide-react";
import { useMiFiesta } from "@/context/MiFiestaContext";
import PlaceholderImage from "@/components/site/PlaceholderImage";

export interface ServicioCardProps {
  id: string;
  nombre: string;
  categoria: string;
  descripcion?: string;
  fotoUrl?: string | null;
  videoUrl?: string | null;
  posterUrl?: string | null;
  edadIdeal?: string | null;
  duracion?: string | null;
  masPedido?: boolean;
  destacado?: boolean;
  soloAdultos?: boolean;
  priority?: boolean;
  /** Tiene variantes o dinámicas: el "+" lleva a la ficha para elegirlas. */
  tieneOpciones?: boolean;
}

export default function ServicioCard({
  id,
  nombre,
  categoria,
  fotoUrl,
  videoUrl,
  posterUrl,
  edadIdeal,
  duracion,
  masPedido,
  soloAdultos,
  priority = false,
  tieneOpciones = false,
}: ServicioCardProps) {
  const { isInFiesta, toggleItem } = useMiFiesta();
  const router = useRouter();
  const added = isInFiesta(id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Video de muestra solo con mouse (en celular no se descarga).
  const startVideo = () => {
    videoRef.current
      ?.play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  };
  const stopVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const handleAdd = () => {
    if (tieneOpciones) {
      router.push(`/catalogo/${id}`);
      return;
    }
    toggleItem({ servicioId: id, nombre, categoria, fotoUrl });
  };

  return (
    <div
      onMouseEnter={videoUrl ? startVideo : undefined}
      onMouseLeave={videoUrl ? stopVideo : undefined}
      className={`group relative overflow-hidden rounded-2xl border bg-background-card transition-colors ${
        added ? "border-neon-green/70" : "border-border hover:border-white/25"
      }`}
    >
      <Link href={`/catalogo/${id}`} className="relative block aspect-[4/5] w-full overflow-hidden">
        {fotoUrl ? (
          <Image
            src={fotoUrl}
            alt={nombre}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <PlaceholderImage label={nombre} categoria={categoria} compact className="h-full w-full" />
        )}

        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl || undefined}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              isPlaying ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

        {(masPedido || soloAdultos) && (
          <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
            {soloAdultos && (
              <span className="rounded-full bg-red-500/90 px-2 py-0.5 text-[11px] font-bold text-white">+18</span>
            )}
            {masPedido && (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-gold backdrop-blur-sm">
                <Flame className="h-3 w-3" aria-hidden />
                Más pedido
              </span>
            )}
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-3 bottom-3 pr-12">
          <h3 className="line-clamp-2 font-display text-base font-extrabold leading-tight text-white sm:text-lg">
            {nombre}
          </h3>
          {(edadIdeal || duracion) && (
            <p className="mt-1 hidden items-center gap-3 text-xs text-white/70 sm:flex">
              {edadIdeal && (
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" aria-hidden />
                  {edadIdeal}
                </span>
              )}
              {duracion && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" aria-hidden />
                  {duracion}
                </span>
              )}
            </p>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={handleAdd}
        aria-label={
          tieneOpciones
            ? `Elegir opciones de ${nombre}`
            : added
              ? `Quitar ${nombre} de mi fiesta`
              : `Agregar ${nombre} a mi fiesta`
        }
        aria-pressed={tieneOpciones ? undefined : added}
        className={`absolute bottom-2.5 right-2.5 z-10 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all active:scale-90 ${
          added
            ? "anim-pop bg-neon-green text-background"
            : "border border-white/20 bg-black/60 text-white backdrop-blur-sm hover:border-neon-green hover:bg-neon-green hover:text-background"
        }`}
      >
        {added ? <Check className="h-5 w-5 stroke-[2.5]" /> : <Plus className="h-5 w-5 stroke-[2.5]" />}
      </button>
    </div>
  );
}
