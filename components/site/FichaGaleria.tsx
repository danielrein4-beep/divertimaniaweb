"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export type MediaItem = { url: string; tipo: "FOTO" | "VIDEO"; poster?: string | null };

/** Galería deslizable (scroll-snap) con fotos y reels. */
export default function FichaGaleria({ media, nombre }: { media: MediaItem[]; nombre: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setActivo(Math.round(el.scrollLeft / el.clientWidth));
  };

  const irA = (i: number) => {
    const el = trackRef.current;
    el?.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="scrollbar-none flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-3xl bg-background-card sm:aspect-[4/5]"
        aria-label={`Fotos y videos de ${nombre}`}
      >
        {media.map((m, i) => (
          <div key={m.url + i} className="relative h-full w-full shrink-0 snap-center">
            {m.tipo === "VIDEO" ? (
              <video
                src={m.url}
                poster={m.poster ?? undefined}
                controls
                muted
                playsInline
                preload="none"
                className="h-full w-full bg-black object-cover"
              />
            ) : (
              <Image
                src={m.url}
                alt={i === 0 ? nombre : `${nombre}, foto ${i + 1}`}
                fill
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, 560px"
                className="object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {media.length > 1 && (
        <>
          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {activo + 1}/{media.length}
          </span>
          <div className="mt-3 flex justify-center gap-1.5">
            {media.map((m, i) => (
              <button
                key={m.url + i}
                type="button"
                onClick={() => irA(i)}
                aria-label={`Ver ${m.tipo === "VIDEO" ? "video" : "foto"} ${i + 1}`}
                aria-current={i === activo}
                className="flex h-6 items-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all ${
                    i === activo ? "w-6 bg-neon-green" : "w-1.5 bg-white/30"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
