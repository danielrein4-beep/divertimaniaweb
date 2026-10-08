"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Check, Sparkles } from "lucide-react";
import { useMiFiesta } from "@/context/MiFiestaContext";
import PlaceholderImage from "@/components/site/PlaceholderImage";

export interface CombinaItem {
  id: string;
  nombre: string;
  categoria: string;
  fotoUrl: string | null;
}

interface ServicioCombinaConProps {
  servicios: CombinaItem[];
}

export default function ServicioCombinaCon({ servicios }: ServicioCombinaConProps) {
  const { isInFiesta, toggleItem } = useMiFiesta();

  if (!servicios || servicios.length === 0) return null;

  return (
    <div className="flex flex-col gap-5 pt-4">
      <div>
        <h2 className="type-h3 font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-neon-green" />
          <span>Combina perfecto con tu evento</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Nuestros clientes suelen agregar estas opciones para una fiesta completa.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {servicios.map((s) => {
          const added = isInFiesta(s.id);

          return (
            <div
              key={s.id}
              className="group relative flex items-center gap-3.5 p-3 rounded-2xl bg-surface border border-white/10 hover:border-white/20 transition-all"
            >
              <Link
                href={`/catalogo/${s.id}`}
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-black/40"
              >
                {s.fotoUrl ? (
                  <Image
                    src={s.fotoUrl}
                    alt={s.nombre}
                    fill
                    sizes="64px"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <PlaceholderImage label={s.nombre} categoria={s.categoria} className="h-full w-full" />
                )}
              </Link>

              <div className="flex flex-col flex-1 min-w-0 pr-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted truncate">
                  {s.categoria}
                </span>
                <Link
                  href={`/catalogo/${s.id}`}
                  className="font-bold text-sm text-foreground hover:text-neon-green transition-colors truncate"
                >
                  {s.nombre}
                </Link>
              </div>

              <button
                type="button"
                onClick={() =>
                  toggleItem({
                    servicioId: s.id,
                    nombre: s.nombre,
                    categoria: s.categoria,
                    fotoUrl: s.fotoUrl,
                  })
                }
                aria-label={added ? `Quitar ${s.nombre}` : `Agregar ${s.nombre}`}
                className={`touch-target h-9 w-9 shrink-0 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  added
                    ? "bg-neon-green text-[#0a0a0f] shadow-sm"
                    : "bg-surface-raised border border-white/15 text-foreground hover:bg-neon-green hover:text-[#0a0a0f]"
                }`}
              >
                {added ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
