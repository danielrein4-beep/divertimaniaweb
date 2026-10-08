import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Calendar, ArrowRight } from "lucide-react";

export interface NovedadData {
  id: string;
  badge: string;
  titulo: string;
  descripcion: string;
  fotoUrl: string | null;
  ctaTexto: string;
  ctaUrl: string | null;
}

export default function BannerTemporada({ novedad }: { novedad: NovedadData | null }) {
  if (!novedad) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-12">
      <div className="relative overflow-hidden rounded-3xl border border-neon-green/30 bg-gradient-to-r from-neon-green/10 via-[#181826] to-magenta/10 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {novedad.fotoUrl && (
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden border-2 border-neon-green/40 shadow-md shrink-0 sticker-tilt-left">
                <Image
                  src={novedad.fotoUrl}
                  alt={novedad.titulo}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5 max-w-xl">
              <span className="inline-flex items-center gap-1.5 self-center sm:self-start rounded-full bg-neon-green/15 text-neon-green px-3 py-1 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                {novedad.badge}
              </span>
              <h3 className="type-h2 font-extrabold text-foreground tracking-tight">
                {novedad.titulo}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {novedad.descripcion}
              </p>
            </div>
          </div>

          <Link
            href={novedad.ctaUrl || "/catalogo"}
            className="touch-target inline-flex items-center gap-2 rounded-full bg-neon-green px-6 py-3.5 text-sm font-bold text-[#0a0a0f] hover:bg-neon-green-dark hover:scale-105 active:scale-95 transition-all shadow-lg shrink-0 cursor-pointer"
          >
            <span>{novedad.ctaTexto || "Consultar ahora"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
