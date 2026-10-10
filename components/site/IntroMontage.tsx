"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "@/lib/useIsClient";

type IntroMontageProps = {
  videos: string[];
  maxRows?: number;
  durationMs?: number;
  fadeMs?: number;
  onComplete: () => void;
};

/** "/reels/intro/reel-3.mp4" → "/reels/posters/reel-3-poster.jpg" (portada mientras carga el video). */
export function posterDeReel(src: string): string | undefined {
  const m = src.match(/reel-(\d+)\.mp4$/);
  return m ? `/reels/posters/reel-${m[1]}-poster.jpg` : undefined;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Para un ancho/alto dado y un máximo de tiles disponibles (= cantidad de
 * videos, para garantizar CERO repetidos), busca la combinación filas x
 * columnas que más se acerque a tiles 9:16 sin superar `maxTiles`.
 */
function computeGrid(width: number, height: number, maxTiles: number, maxRows: number) {
  let best = { rows: 1, cols: 1, count: 1, diff: Infinity };

  for (let rows = 1; rows <= maxRows; rows += 1) {
    const tileHeight = height / rows;
    const idealTileWidth = tileHeight * (9 / 16);
    let cols = Math.max(1, Math.round(width / idealTileWidth));
    if (rows * cols > maxTiles) {
      cols = Math.max(1, Math.floor(maxTiles / rows));
    }
    if (cols === 0) continue;

    const count = rows * cols;
    const actualAspect = width / cols / tileHeight;
    const diff = Math.abs(actualAspect - 9 / 16);

    if (count > best.count || (count === best.count && diff < best.diff)) {
      best = { rows, cols, count, diff };
    }
  }

  return best;
}

/**
 * Mosaico de reels (9:16) a pantalla completa (fixed, cubre TODO el
 * viewport, no solo el hero) por `durationMs`, calculando en vivo cuántas
 * columnas/filas entran sin repetir ningún video, y luego se difumina para
 * revelar el contenido debajo (ver Hero.tsx).
 */
export default function IntroMontage({
  videos,
  maxRows = 3,
  durationMs = 5000,
  fadeMs = 900,
  onComplete,
}: IntroMontageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [grid, setGrid] = useState({ rows: 1, cols: 1 });
  const [fading, setFading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const canPortal = useIsClient();

  const shuffledVideos = useMemo(() => shuffle(videos), [videos]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || shuffledVideos.length === 0) return;

    const compute = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      const best = computeGrid(w, h, shuffledVideos.length, maxRows);
      setGrid({ rows: best.rows, cols: best.cols });
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [maxRows, shuffledVideos.length, canPortal]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      onComplete();
      return;
    }

    const raf = requestAnimationFrame(() => setMounted(true));
    const fadeTimer = setTimeout(() => setFading(true), durationMs);
    const doneTimer = setTimeout(onComplete, durationMs + fadeMs);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tileCount = grid.rows * grid.cols;

  const saltar = () => {
    if (fading) return;
    setFading(true);
    setTimeout(onComplete, Math.min(fadeMs, 400));
  };

  if (!canPortal) return null;

  return createPortal(
    <div
      ref={containerRef}
      onClick={saltar}
      className="fixed inset-0 z-[60] grid cursor-pointer overflow-hidden transition-[opacity,filter] ease-out"
      style={{
        gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
        gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
        gap: 0,
        opacity: fading ? 0 : 1,
        filter: fading ? "blur(28px)" : "blur(0px)",
        transitionDuration: `${fadeMs}ms`,
      }}
    >
      {/* Cada tile usa un video distinto; nunca hay más tiles que videos, así que ninguno se repite. */}
      {Array.from({ length: tileCount }).map((_, i) => {
        const src = shuffledVideos[i];
        return (
          <div
            key={i}
            className="relative overflow-hidden bg-background-elevated transition-opacity ease-out"
            style={{
              opacity: mounted ? 1 : 0,
              transitionDuration: "600ms",
              transitionDelay: `${i * 45}ms`,
            }}
          >
            {src && (
              <video
                aria-hidden
                className="absolute h-[calc(100%+2px)] w-[calc(100%+2px)] object-cover"
                style={{ top: -1, left: -1 }}
                src={src}
                poster={posterDeReel(src)}
                muted
                autoPlay
                loop
                playsInline
              />
            )}
          </div>
        );
      })}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(11,11,11,0.6) 100%)" }}
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          saltar();
        }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/30 bg-black/50 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/70"
      >
        Entrar
      </button>
    </div>,
    document.body
  );
}
