"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pin, Play } from "lucide-react";

export type FeedItem =
  | { tipo: "fijado"; id: string; titulo: string; fotoUrl: string; href: string }
  | { tipo: "reel"; id: string; titulo: string; videoUrl: string; poster: string | null; href: string };

/**
 * Cuadrícula de 3 columnas como su feed de Instagram. Cada reel corto (6 s, sin audio)
 * solo se reproduce mientras está en pantalla, y cada mosaico abre la ficha del servicio.
 */
export default function FeedReels({ items }: { items: FeedItem[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const videos = Array.from(grid.querySelectorAll("video"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        }
      },
      { threshold: 0.5 }
    );
    videos.forEach((v) => observer.observe(v));
    return () => observer.disconnect();
  }, [items]);

  return (
    <div ref={gridRef} className="grid grid-cols-3 gap-[2px]">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          aria-label={item.titulo}
          className="group relative block aspect-[3/4] overflow-hidden bg-background-card"
        >
          {item.tipo === "fijado" ? (
            <Image
              src={item.fotoUrl}
              alt=""
              fill
              sizes="(max-width: 1024px) 33vw, 200px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <video
              src={item.videoUrl}
              poster={item.poster ?? undefined}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}

          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <span className="pointer-events-none absolute right-1.5 top-1.5 text-white drop-shadow">
            {item.tipo === "fijado" ? (
              <Pin className="h-4 w-4 rotate-45 fill-white" aria-hidden />
            ) : (
              <Play className="h-4 w-4 fill-white" aria-hidden />
            )}
          </span>
          <span className="ig-caption pointer-events-none absolute inset-x-1.5 bottom-1.5 line-clamp-2 text-[13px] leading-tight sm:text-sm">
            {item.titulo}
          </span>
        </Link>
      ))}
    </div>
  );
}
