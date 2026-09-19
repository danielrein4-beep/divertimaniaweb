"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { WHATSAPP_LINK } from "@/lib/site";

export type NovedadDTO = {
  id: string;
  badge: string;
  titulo: string;
  descripcion: string;
  fotoUrl: string | null;
  ctaTexto: string;
  ctaUrl: string | null;
};

export default function NovedadesPanel({
  novedad,
  durationMs = 5500,
  fadeMs = 700,
  onComplete,
}: {
  novedad: NovedadDTO;
  durationMs?: number;
  fadeMs?: number;
  onComplete: () => void;
}) {
  const [canPortal, setCanPortal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => setCanPortal(true), []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const fadeTimer = setTimeout(() => setFading(true), durationMs);
    const doneTimer = setTimeout(onComplete, durationMs + fadeMs);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!canPortal) return null;

  const href = novedad.ctaUrl || WHATSAPP_LINK;
  const external = href.startsWith("http");

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-radial-glow px-6 transition-opacity ease-out"
      style={{ opacity: visible && !fading ? 1 : 0, transitionDuration: `${fadeMs}ms` }}
      aria-hidden="true"
    >
      <div className="flex max-w-lg flex-col items-center gap-4 text-center">
        <span className="rounded-full border border-neon-green/40 bg-neon-green/10 px-4 py-1 text-sm font-medium text-neon-green">
          {novedad.badge}
        </span>
        {novedad.fotoUrl && (
          <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-border bg-background-card sm:h-48 sm:w-48">
            <Image src={novedad.fotoUrl} alt={novedad.titulo} fill className="object-cover" sizes="192px" />
          </div>
        )}
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">{novedad.titulo}</h2>
        <p className="text-muted">{novedad.descripcion}</p>
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="rounded-full bg-neon-green px-6 py-3 font-semibold text-background transition-transform hover:scale-105"
        >
          {novedad.ctaTexto}
        </a>
      </div>
    </div>,
    document.body
  );
}
