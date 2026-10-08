"use client";

import Link from "next/link";
import { useMiFiesta } from "@/context/MiFiestaContext";

/** Par de llamados principales: armar la fiesta en el catálogo o pedir cotización directo. */
export default function CotizarButtons({ className = "" }: { className?: string }) {
  const { items, openPanel } = useMiFiesta();

  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      <Link
        href="/catalogo"
        className="touch-target rounded-full bg-neon-green px-7 text-base font-bold text-background transition-transform hover:scale-105"
      >
        Arma tu fiesta
      </Link>
      <button
        type="button"
        onClick={() => openPanel(items.length > 0 ? 1 : 2)}
        className="touch-target rounded-full border border-white/20 px-7 text-base font-semibold text-foreground transition-colors hover:border-neon-green hover:text-neon-green"
      >
        Pedir cotización
      </button>
    </div>
  );
}
