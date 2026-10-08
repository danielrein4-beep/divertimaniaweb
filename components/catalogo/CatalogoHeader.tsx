"use client";

import React from "react";
import { Search, X } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

interface CatalogoHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function CatalogoHeader({ searchQuery, onSearchChange }: CatalogoHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center gap-6 pt-4 pb-2">
      <SectionHeader
        badge="Catálogo 2026"
        title="Todo para tu fiesta en un solo lugar"
        underlineWord="fiesta"
        subtitle="Explora shows, personajes y experiencias. Agrega lo que te guste con el botón + para armar tu cotización en 2 minutos."
        align="center"
        tilt="right"
      />

      {/* Buscador interactivo */}
      <div className="relative w-full max-w-lg mt-2">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Busca un personaje, show o temática..."
            aria-label="Buscar servicio o personaje"
            className="w-full h-12 pl-12 pr-10 rounded-full bg-surface-raised border border-border/80 text-foreground placeholder:text-muted/70 text-sm focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Limpiar búsqueda"
              className="absolute right-3.5 p-1 rounded-full text-muted hover:text-foreground hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
