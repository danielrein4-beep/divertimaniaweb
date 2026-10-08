"use client";

import React from "react";
import { CATEGORIAS } from "@/lib/site";
import Chip from "@/components/ui/Chip";

export const OCASIONES_FILTRO = [
  { label: "Todas las ocasiones", value: "todas" },
  { label: "Cumpleaños", value: "cumpleanos" },
  { label: "Baby Shower", value: "baby-shower" },
  { label: "15 años", value: "quince" },
  { label: "Boda", value: "boda" },
  { label: "Corporativo", value: "corporativo" },
  { label: "Graduación", value: "graduacion" },
  { label: "Navidad", value: "navidad" },
];

export const EDADES_FILTRO = [
  { label: "Todas las edades", value: "todas" },
  { label: "1 a 4 años", value: "1-4" },
  { label: "5 a 10 años", value: "5-10" },
  { label: "Adolescentes", value: "adolescentes" },
  { label: "Adultos", value: "adultos" },
];

interface CatalogoFiltrosProps {
  categoriaActiva: string;
  onCategoriaChange: (cat: string) => void;
  ocasionActiva: string;
  onOcasionChange: (ocasion: string) => void;
  edadActiva: string;
  onEdadChange: (edad: string) => void;
}

export default function CatalogoFiltros({
  categoriaActiva,
  onCategoriaChange,
  ocasionActiva,
  onOcasionChange,
  edadActiva,
  onEdadChange,
}: CatalogoFiltrosProps) {
  const todasLasCategorias = ["Todas", ...CATEGORIAS];

  return (
    <div className="sticky top-16 z-20 -mx-4 px-4 sm:mx-0 sm:px-0 py-3 bg-background/95 backdrop-blur-md border-b border-border/40 flex flex-col gap-3">
      {/* Pestañas principales de categoría */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {todasLasCategorias.map((cat) => {
          const isActive = categoriaActiva === cat;
          const isAdultos = cat === "Show para Adultos";

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoriaChange(cat)}
              className={`shrink-0 touch-target px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? isAdultos
                    ? "bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm"
                    : "bg-neon-green text-[#0a0a0f] font-bold shadow-md shadow-neon-green/10"
                  : isAdultos
                  ? "bg-surface text-red-400/80 border border-red-500/20 hover:border-red-500/40"
                  : "bg-surface text-muted hover:text-foreground border border-border/60 hover:border-border"
              }`}
            >
              {cat}
              {isAdultos && <span className="ml-1 text-[10px] font-bold">+18</span>}
            </button>
          );
        })}
      </div>

      {/* Filtros secundarios: ocasión y edad */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-muted">
        {/* Chips de ocasión */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-semibold text-muted/70 uppercase tracking-wider shrink-0 mr-1">
            Ocasión:
          </span>
          {OCASIONES_FILTRO.map((item) => (
            <Chip
              key={item.value}
              selected={ocasionActiva === item.value}
              onClick={() => onOcasionChange(item.value)}
            >
              {item.label}
            </Chip>
          ))}
        </div>

        {/* Chips de edad */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-semibold text-muted/70 uppercase tracking-wider shrink-0 mr-1">
            Edad:
          </span>
          {EDADES_FILTRO.map((item) => (
            <Chip
              key={item.value}
              selected={edadActiva === item.value}
              onClick={() => onEdadChange(item.value)}
            >
              {item.label}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
