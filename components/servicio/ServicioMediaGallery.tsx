"use client";

import React, { useState } from "react";
import Image from "next/image";
import PlaceholderImage from "@/components/site/PlaceholderImage";
import { Play } from "lucide-react";

export interface MediaItem {
  id: string;
  url: string;
  tipo: string; // "FOTO" | "VIDEO"
  poster?: string | null;
  orden: number;
}

interface ServicioMediaGalleryProps {
  nombre: string;
  categoria: string;
  fotoPrincipal: string | null;
  media: MediaItem[];
}

export default function ServicioMediaGallery({
  nombre,
  categoria,
  fotoPrincipal,
  media,
}: ServicioMediaGalleryProps) {
  // Consolidar lista de items visuales
  const allMedia: MediaItem[] = media.length > 0
    ? media
    : fotoPrincipal
    ? [{ id: "main", url: fotoPrincipal, tipo: "FOTO", poster: null, orden: 0 }]
    : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const currentItem = allMedia[activeIndex];

  if (allMedia.length === 0) {
    return (
      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-3xl border border-white/10 bg-surface-raised">
        <PlaceholderImage label={nombre} categoria={categoria} className="h-full w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Contenedor principal de visualización */}
      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-xl">
        {currentItem.tipo === "VIDEO" ? (
          <div className="relative h-full w-full">
            <video
              key={currentItem.url}
              src={currentItem.url}
              poster={currentItem.poster || undefined}
              controls
              playsInline
              className="h-full w-full object-contain bg-black"
            />
          </div>
        ) : (
          <Image
            src={currentItem.url}
            alt={`${nombre} - ${activeIndex + 1}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover transition-all duration-300"
          />
        )}
      </div>

      {/* Miniaturas en escritorio y selector en móvil */}
      {allMedia.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          {allMedia.map((item, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Ver medio ${idx + 1}`}
                className={`relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-neon-green ring-2 ring-neon-green/30 scale-105"
                    : "border-white/10 opacity-70 hover:opacity-100"
                }`}
              >
                {item.tipo === "VIDEO" ? (
                  <div className="relative h-full w-full bg-black/80 flex items-center justify-center">
                    {item.poster ? (
                      <Image
                        src={item.poster}
                        alt="Miniatura video"
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>
                ) : (
                  <Image
                    src={item.url}
                    alt={`Miniatura ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
