"use client";

import { useCallback, useRef, type CSSProperties, type MouseEvent } from "react";
import Image from "next/image";
import PlaceholderImage from "@/components/site/PlaceholderImage";
import "./ChromaGrid.css";

export interface ChromaGridItem {
  id: string;
  nombre: string;
  cargo: string;
  descripcion: string;
  fotoUrl: string | null;
  handle?: string | null;
  accentColor?: string;
}

interface ChromaGridProps {
  items: ChromaGridItem[];
  className?: string;
}

const ACCENT_COLORS = [
  { color: "#9dff3c", glow: "rgba(157, 255, 60, 0.35)" },
  { color: "#ffd166", glow: "rgba(255, 209, 102, 0.35)" },
  { color: "#ff4fd8", glow: "rgba(255, 79, 216, 0.35)" },
  { color: "#00f0ff", glow: "rgba(0, 240, 255, 0.35)" },
  { color: "#a78bfa", glow: "rgba(167, 139, 250, 0.35)" },
];

export default function ChromaGrid({ items, className = "" }: ChromaGridProps) {
  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  return (
    <div className={`chroma-grid ${className}`}>
      {items.map((item, index) => {
        const palette = ACCENT_COLORS[index % ACCENT_COLORS.length];
        const accent = item.accentColor ?? palette.color;
        const glow = palette.glow;

        const cardStyle: CSSProperties = {
          ["--card-accent" as string]: accent,
          ["--card-glow" as string]: glow,
        };

        const handle = item.handle || `@${item.nombre.toLowerCase().replace(/\s+/g, "")}`;

        return (
          <div
            key={item.id}
            className="chroma-card"
            style={cardStyle}
            onMouseMove={handleMouseMove}
            tabIndex={0}
          >
            <div className="chroma-card__image-wrap">
              {item.fotoUrl ? (
                <Image
                  src={item.fotoUrl}
                  alt={item.nombre}
                  fill
                  className="chroma-card__image"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <PlaceholderImage
                  label={item.nombre}
                  className="aspect-[4/5] w-full rounded-none border-0"
                />
              )}
            </div>

            <div className="chroma-card__content">
              <div className="chroma-card__header">
                <h3 className="chroma-card__name">{item.nombre}</h3>
                <span className="chroma-card__handle">{handle}</span>
              </div>
              <p className="chroma-card__role">{item.cargo}</p>
              <p className="chroma-card__desc">{item.descripcion}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
