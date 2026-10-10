"use client";

import { CheckCircle2 } from "lucide-react";
import { useMiFiesta } from "@/context/MiFiestaContext";
import EventoFormFields, { EnviarCotizacionButton } from "@/components/mifiesta/EventoFormFields";

/** Formulario de cotización embebido en la página (mismo estado que el panel de Mi fiesta). */
export default function ContactoCotizacion() {
  const { items, openPanel, isEnviado, isPanelOpen } = useMiFiesta();

  return (
    <div className="rounded-3xl border border-border bg-background-elevated p-5 sm:p-8">
      {items.length > 0 ? (
        <button
          type="button"
          onClick={() => openPanel(1)}
          className="mb-6 flex w-full items-center justify-between gap-3 rounded-2xl border border-neon-green/40 bg-neon-green/[0.06] p-4 text-left text-sm"
        >
          <span>
            <strong>{items.length} {items.length === 1 ? "servicio" : "servicios"}</strong> en tu fiesta. Van incluidos
            en el mensaje.
          </span>
          <span className="shrink-0 font-semibold text-neon-green">Ver</span>
        </button>
      ) : (
        <p className="mb-6 rounded-2xl border border-border p-4 text-sm text-muted">
          ¿Aún no sabes qué quieres? No pasa nada: te recomendamos según tu evento.
        </p>
      )}

      <EventoFormFields />

      <div className="mt-6">
        <EnviarCotizacionButton />
        {isEnviado && !isPanelOpen && (
          <p className="mt-3 flex items-center justify-center gap-2 text-sm text-neon-green">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            Se abrió WhatsApp con tu mensaje. Solo dale a enviar.
          </p>
        )}
      </div>
    </div>
  );
}
