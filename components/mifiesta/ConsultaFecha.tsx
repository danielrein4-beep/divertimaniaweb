"use client";

import { useMiFiesta } from "@/context/MiFiestaContext";
import { formatFechaAmigable } from "@/lib/miFiesta";
import { MENSAJES_WHATSAPP } from "@/lib/whatsapp";
import { useWhatsApp } from "@/components/site/SitioConfigProvider";
import { todayStr } from "@/lib/date";

export default function ConsultaFecha() {
  const { formData, updateFormData, openPanel } = useMiFiesta();
  const fecha = formData.fecha;
  const whatsapp = useWhatsApp();

  return (
    <div className="flex w-full flex-col items-stretch gap-4">
      <label className="flex flex-col gap-2 text-left text-sm font-medium">
        Fecha de la fiesta
        <input
          type="date"
          min={todayStr()}
          value={fecha}
          onChange={(e) => updateFormData({ fecha: e.target.value })}
          className="w-full rounded-2xl border border-border bg-background-card px-4 py-4 text-lg font-semibold outline-none [color-scheme:dark] focus:border-neon-green"
        />
      </label>

      <button
        type="button"
        disabled={!fecha}
        onClick={() => openPanel(2)}
        className="touch-target rounded-full bg-neon-green px-6 text-base font-bold text-background transition-colors hover:bg-neon-green-dark disabled:bg-white/10 disabled:text-muted"
      >
        {fecha ? `Cotizar para el ${formatFechaAmigable(fecha)}` : "Elige una fecha"}
      </button>

      {fecha && (
        <a
          href={whatsapp.link(MENSAJES_WHATSAPP.fecha(formatFechaAmigable(fecha)))}
          data-origen="consulta-fecha"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
        >
          Solo quiero preguntar si la fecha está libre
        </a>
      )}
    </div>
  );
}
