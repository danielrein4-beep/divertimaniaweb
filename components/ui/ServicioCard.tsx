"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Check, Flame, Clock, Users, ShieldAlert } from "lucide-react";
import { useMiFiesta } from "@/context/MiFiestaContext";
import PlaceholderImage from "@/components/site/PlaceholderImage";
import Badge from "./Badge";

export interface ServicioCardProps {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  fotoUrl?: string | null;
  videoUrl?: string | null;
  posterUrl?: string | null;
  edadIdeal?: string | null;
  duracion?: string | null;
  masPedido?: boolean;
  destacado?: boolean;
  soloAdultos?: boolean;
  priority?: boolean;
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
}: ServicioCardProps) {
  const { isInFiesta, toggleItem } = useMiFiesta();
  const added = isInFiesta(id);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (videoUrl && videoRef.current) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoUrl && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      servicioId: id,
      nombre,
      categoria,
      fotoUrl,
    });
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#14141e] border border-white/10 shadow-lg hover:border-white/25 hover:shadow-2xl transition-all duration-300"
    >
      <Link href={`/catalogo/${id}`} className="block relative aspect-[4/5] w-full overflow-hidden bg-black/40">
        {/* Foto a sangre o Placeholder */}
        {fotoUrl ? (
          <Image
            src={fotoUrl}
            alt={nombre}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
              isPlaying ? "opacity-0" : "opacity-100"
            }`}
          />
        ) : (
          <PlaceholderImage label={nombre} categoria={categoria} className="h-full w-full" />
        )}

        {/* Video en hover en escritorio */}
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl || fotoUrl || undefined}
            muted
            loop
            playsInline
            preload="none"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
        )}

        {/* Degradado oscuro abajo para contraste y legibilidad óptima */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent opacity-90 pointer-events-none" />

        {/* Badges superiores */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-1.5 pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5 max-w-[80%]">
            {soloAdultos && (
              <Badge variant="danger" size="sm" icon={<ShieldAlert className="w-3 h-3" />}>
                +18
              </Badge>
            )}
            {masPedido && (
              <Badge variant="gold" size="sm" icon={<Flame className="w-3 h-3 text-amber-400" />}>
                Más pedido
              </Badge>
            )}
          </div>
        </div>

        {/* Botón circular "+" flotante (✓ cuando ya está en Mi fiesta) */}
        <button
          type="button"
          onClick={handleAddClick}
          aria-label={added ? `Quitar ${nombre} de mi fiesta` : `Agregar ${nombre} a mi fiesta`}
          className={`absolute bottom-3.5 right-3.5 z-10 touch-target w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer ${
            added
              ? "bg-neon-green text-[#0a0a0f] scale-105 shadow-[0_0_16px_rgba(157,255,60,0.4)]"
              : "bg-[#181824]/90 text-foreground hover:bg-neon-green hover:text-[#0a0a0f] border border-white/15 hover:border-neon-green active:scale-95"
          }`}
        >
          {added ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Plus className="w-5 h-5 stroke-[2.5]" />}
        </button>

        {/* Nombre y metadatos sobre la foto */}
        <div className="absolute bottom-3 left-3.5 right-16 flex flex-col gap-1 pointer-events-none">
          <span className="text-[11px] font-semibold tracking-wider text-muted/90 uppercase line-clamp-1">
            {categoria}
          </span>
          <h3 className="type-h3 text-foreground font-bold text-base sm:text-lg leading-tight line-clamp-2 drop-shadow-md group-hover:text-neon-green transition-colors">
            {nombre}
          </h3>

          {/* Badges sutiles de edad o duración */}
          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted/80">
            {edadIdeal && (
              <span className="inline-flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{edadIdeal}</span>
              </span>
            )}
            {duracion && (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{duracion}</span>
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
