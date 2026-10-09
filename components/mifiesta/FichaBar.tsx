"use client";

import { Check, Plus } from "lucide-react";
import { useMiFiesta } from "@/context/MiFiestaContext";
import { MENSAJES_WHATSAPP } from "@/lib/whatsapp";
import { useWhatsApp } from "@/components/site/SitioConfigProvider";
import { useBottomBarSpace } from "@/lib/useBottomBarSpace";

/** Barra fija de la ficha: agregar el servicio, ver la fiesta o cotizar solo este. */
export default function FichaBar({
  servicioId,
  nombre,
  categoria,
  fotoUrl,
  tieneOpciones,
}: {
  servicioId: string;
  nombre: string;
  categoria: string;
  fotoUrl: string | null;
  tieneOpciones: boolean;
}) {
  const { items, isInFiesta, toggleItem, openPanel, isPanelOpen } = useMiFiesta();
  const whatsapp = useWhatsApp();
  useBottomBarSpace(true);
  if (isPanelOpen) return null;

  const enFiesta = isInFiesta(servicioId);
  const total = items.length;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background-elevated/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center gap-3">
        {tieneOpciones ? (
          <p className="min-w-0 flex-1 text-sm text-muted">
            {enFiesta ? (
              <span className="text-neon-green">Ya está en tu fiesta</span>
            ) : (
              "Elige arriba y toca Agregar"
            )}
          </p>
        ) : (
          <button
            type="button"
            onClick={() => toggleItem({ servicioId, nombre, categoria, fotoUrl })}
            aria-pressed={enFiesta}
            className={`touch-target flex flex-1 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition-colors ${
              enFiesta
                ? "border border-neon-green text-neon-green"
                : "bg-neon-green text-background hover:bg-neon-green-dark"
            }`}
          >
            {enFiesta ? <Check className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
            {enFiesta ? "En tu fiesta" : "Agregar a mi fiesta"}
          </button>
        )}

        {total > 0 ? (
          <button
            type="button"
            onClick={() => openPanel(1)}
            className={`touch-target shrink-0 rounded-full px-5 text-sm font-bold transition-colors ${
              tieneOpciones || enFiesta
                ? "bg-neon-green text-background hover:bg-neon-green-dark"
                : "border border-white/20 hover:border-neon-green"
            }`}
          >
            Cotizar ({total})
          </button>
        ) : (
          <a
            href={whatsapp.link(MENSAJES_WHATSAPP.servicio(nombre))}
            data-origen="ficha"
            data-detalle={nombre}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-target shrink-0 rounded-full border border-white/20 px-4 text-sm font-semibold transition-colors hover:border-neon-green hover:text-neon-green"
          >
            Cotizar solo este
          </a>
        )}
      </div>
    </div>
  );
}
