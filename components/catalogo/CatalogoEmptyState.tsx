"use client";

import React from "react";
import { SearchX } from "lucide-react";
import Button from "@/components/ui/Button";
import { getNoEncontradoWhatsAppLink } from "@/lib/whatsapp";

interface CatalogoEmptyStateProps {
  searchQuery: string;
  onSelectSuggestion: (sug: string) => void;
  onClearFilters: () => void;
}

const SUGERENCIAS = ["Mickey", "Show LED", "Princesas", "Baby Shower", "Espumanía"];

export default function CatalogoEmptyState({
  searchQuery,
  onSelectSuggestion,
  onClearFilters,
}: CatalogoEmptyStateProps) {
  const waLink = getNoEncontradoWhatsAppLink(searchQuery || "un show especial");

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 my-12 rounded-3xl border border-dashed border-border/80 bg-surface/60 max-w-xl mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-surface-raised border border-border flex items-center justify-center text-muted mb-4 shadow-inner">
        <SearchX className="w-7 h-7 stroke-[1.8]" />
      </div>

      <h3 className="font-display text-xl font-bold text-foreground">
        No encontramos servicios con esos filtros
      </h3>

      <p className="mt-2 text-sm text-muted max-w-md leading-relaxed">
        {searchQuery ? (
          <>
            No hay resultados para <span className="text-foreground font-semibold">“{searchQuery}”</span>.
          </>
        ) : (
          "No hay servicios que coincidan con la combinación de filtros seleccionada."
        )}
      </p>

      {/* Sugerencias de búsqueda */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-muted/70">Prueba con:</span>
        {SUGERENCIAS.map((sug) => (
          <button
            key={sug}
            type="button"
            onClick={() => onSelectSuggestion(sug)}
            className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-raised border border-border/60 text-neon-green hover:border-neon-green transition-colors cursor-pointer"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Acciones */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button variant="secondary" size="sm" onClick={onClearFilters}>
          Restablecer filtros
        </Button>
        <a href={waLink} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="sm">
            Preguntar por WhatsApp
          </Button>
        </a>
      </div>
    </div>
  );
}
