"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Clock, Plus, Users } from "lucide-react";
import { useMiFiesta } from "@/context/MiFiestaContext";
import PlaceholderImage from "@/components/site/PlaceholderImage";
import { fotoOptimizada } from "@/lib/fotoOptimizada";
import type { ClipTarjeta } from "@/lib/clipTarjeta";
import { useConexionLigera } from "@/lib/useConexionLigera";

const CONSULTA_SIN_MOVIMIENTO = "(prefers-reduced-motion: reduce)";
const suscribirSinMovimiento = (aviso: () => void) => {
  const mq = window.matchMedia(CONSULTA_SIN_MOVIMIENTO);
  mq.addEventListener("change", aviso);
  return () => mq.removeEventListener("change", aviso);
};
const leerSinMovimiento = () => window.matchMedia(CONSULTA_SIN_MOVIMIENTO).matches;

export interface ServicioCardProps {
  id: string;
  nombre: string;
  categoria: string;
  descripcion?: string;
  fotoUrl?: string | null;
  /** Videos cortos de la tarjeta: corren solos y, si son varios, uno tras otro en bucle. */
  videos?: ClipTarjeta[];
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
  videos = [],
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
  const ligera = useConexionLigera();

  // Todas las tarjetas con video lo reproducen solas (sin mouse ni toque), en bucle y sin sonido, mientras se ven
  // en pantalla; si tienen varios, uno tras otro. Se respeta "reducir movimiento" y el ahorro de datos:
  // ahí queda la foto, con el video de muestra al pasar el mouse.
  const sinMovimiento = useSyncExternalStore(suscribirSinMovimiento, leerSinMovimiento, () => false);
  const [indice, setIndice] = useState(0);
  const varios = videos.length > 1;
  const clip = videos.length ? videos[indice % videos.length] : null;
  const automatico = Boolean(clip) && !ligera && !sinMovimiento;
  const enPantalla = useRef(false);
  const primeraCarga = useRef(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!automatico || !video) return;
    const io = new IntersectionObserver(
      ([e]) => {
        enPantalla.current = e.isIntersecting;
        if (e.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [automatico]);

  // Al pasar al siguiente video de la tarjeta se carga y, si la tarjeta se ve, arranca.
  useEffect(() => {
    const video = videoRef.current;
    if (!automatico || !video) return;
    if (primeraCarga.current) {
      primeraCarga.current = false;
      return;
    }
    video.load();
    if (enPantalla.current) video.play().catch(() => {});
  }, [indice, automatico]);

  // Video de muestra con mouse cuando no corre solo.
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

  const agregarAMiFiesta = () => {
    if (tieneOpciones) {
      router.push(`/catalogo/${id}`);
      return;
    }
    toggleItem({ servicioId: id, nombre, categoria, fotoUrl });
  };

  return (
    <div
      onMouseEnter={clip && !automatico ? startVideo : undefined}
      onMouseLeave={clip && !automatico ? stopVideo : undefined}
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-background-card transition-colors ${
        added ? "border-neon-green/70" : "border-white/10 hover:border-white/25"
      }`}
    >
      <Link href={`/catalogo/${id}`} className="relative block aspect-[4/5] w-full overflow-hidden">
        {automatico && clip ? (
          // Con el video corriendo solo se ve un único medio: el video (con su fotograma mientras carga).
          <video
            ref={videoRef}
            src={clip.url}
            poster={clip.poster ?? fotoUrl ? fotoOptimizada((clip.poster ?? fotoUrl) as string) : undefined}
            muted
            loop={!varios}
            onEnded={varios ? () => setIndice((i) => (i + 1) % videos.length) : undefined}
            playsInline
            preload="none"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <>
            {fotoUrl ? (
              <Image
                src={fotoUrl}
                alt=""
                fill
                priority={priority}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : (
              <PlaceholderImage label={nombre} categoria={categoria} compact className="h-full w-full" />
            )}

            {clip && (
              <video
                ref={videoRef}
                src={clip.url}
                poster={clip.poster ? fotoOptimizada(clip.poster) : undefined}
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
          </>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

        {(masPedido || soloAdultos) && (
          <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
            {soloAdultos && (
              <span className="rounded-md bg-red-600 px-2 py-1 text-[11px] font-bold leading-none text-white">+18</span>
            )}
            {masPedido && (
              <span className="-rotate-2 rounded-md bg-neon-green px-2 py-1 text-[11px] font-bold uppercase leading-none tracking-wide text-background shadow-md">
                Más pedido
              </span>
            )}
          </div>
        )}

        <h3 className="ig-caption pointer-events-none absolute inset-x-3 bottom-3 line-clamp-2 text-base leading-tight sm:text-lg">
          {nombre}
        </h3>
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 p-2.5 sm:p-3">
        {(edadIdeal || duracion) && (
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground/75">
            {edadIdeal && (
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-muted" aria-hidden />
                {edadIdeal}
              </span>
            )}
            {duracion && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-muted" aria-hidden />
                {duracion}
              </span>
            )}
          </p>
        )}
        <button
          type="button"
          onClick={agregarAMiFiesta}
          aria-label={
            tieneOpciones
              ? `Ver opciones de ${nombre}`
              : added
                ? `En tu fiesta: ${nombre}. Toca para quitarlo`
                : `Agregar ${nombre} a mi fiesta`
          }
          aria-pressed={tieneOpciones ? undefined : added}
          className={`mt-auto flex h-11 w-full items-center justify-center gap-1.5 rounded-lg text-sm font-bold transition-colors active:scale-[0.98] ${
            added
              ? "anim-pop bg-neon-green text-background"
              : tieneOpciones
                ? "border border-white/15 text-foreground hover:border-white/35"
                : "border border-neon-green/55 text-neon-green hover:bg-neon-green hover:text-background"
          }`}
        >
          {added ? (
            <>
              <Check className="h-4 w-4 stroke-[3]" aria-hidden /> En tu fiesta
            </>
          ) : tieneOpciones ? (
            <>
              Ver opciones <ChevronRight className="h-4 w-4" aria-hidden />
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 stroke-[3]" aria-hidden /> Agregar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
