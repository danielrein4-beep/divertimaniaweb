"use client";

import { useEffect, useState } from "react";
import MonthCalendar from "@/components/calendar/MonthCalendar";
import { todayStr } from "@/lib/date";
import { useMiFiesta } from "@/context/MiFiestaContext";
import { getFechaWhatsAppLink } from "@/lib/whatsapp";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { CalendarCheck, MessageCircle, Sparkles } from "lucide-react";

type FechaConteo = { fecha: string; cantidad: number };

function nivelActividad(cantidad: number): { label: string; className: string } {
  if (cantidad === 0) return { label: "", className: "" };
  if (cantidad <= 2) return { label: "Con evento", className: "bg-neon-green/20 text-neon-green" };
  return { label: "Alta demanda", className: "bg-gold/20 text-gold" };
}

export default function DisponibilidadPage() {
  const [conteos, setConteos] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedFecha, setSelectedFecha] = useState<string>("");
  const { updateFormData, openSheet } = useMiFiesta();
  const today = todayStr();

  useEffect(() => {
    fetch("/api/eventos/publico")
      .then((res) => res.json())
      .then((data: { fechas: FechaConteo[] }) => {
        setConteos(new Map(data.fechas.map((f) => [f.fecha, f.cantidad])));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSelectDate = (dateStr: string) => {
    if (dateStr < today) return;
    setSelectedFecha(dateStr);
    updateFormData({ fecha: dateStr });
  };

  const handleArmarFiesta = () => {
    if (selectedFecha) {
      updateFormData({ fecha: selectedFecha });
    }
    openSheet(1);
  };

  const waLink = selectedFecha ? getFechaWhatsAppLink(selectedFecha) : "";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-14 flex flex-col gap-8">
      <SectionHeader
        badge="Disponibilidad 2026"
        title="Consulta la fecha de tu evento"
        underlineWord="fecha"
        subtitle="Contamos con varios equipos simultáneos en todo el Estado Táchira, por lo que casi siempre podemos cubrir tu evento aunque el día tenga actividad. Toca una fecha para verificarla."
        align="center"
        tilt="left"
      />

      {/* Calendario interactivo */}
      <div className="rounded-3xl border border-white/10 bg-surface p-4 sm:p-8 shadow-xl">
        <MonthCalendar
          renderDay={(dateStr, day) => {
            const cantidad = conteos.get(dateStr) ?? 0;
            const nivel = nivelActividad(cantidad);
            const esPasado = dateStr < today;
            const isSelected = selectedFecha === dateStr;

            return (
              <button
                type="button"
                disabled={esPasado}
                onClick={() => handleSelectDate(dateStr)}
                className={`touch-target flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-xl text-sm transition-all cursor-pointer ${
                  esPasado
                    ? "text-muted/30 cursor-not-allowed"
                    : isSelected
                    ? "bg-neon-green text-[#0a0a0f] font-bold shadow-md shadow-neon-green/30 scale-105"
                    : "text-foreground hover:bg-white/10"
                } ${dateStr === today && !isSelected ? "ring-1 ring-neon-green" : ""}`}
              >
                <span>{day}</span>
                {!esPasado && nivel.label && !loading && !isSelected && (
                  <span className={`rounded-full px-1.5 text-[9px] font-semibold ${nivel.className}`}>
                    {nivel.label}
                  </span>
                )}
              </button>
            );
          }}
        />
      </div>

      {/* Panel de fecha seleccionada */}
      {selectedFecha ? (
        <div className="rounded-3xl border border-neon-green/40 bg-gradient-to-r from-neon-green/10 via-surface to-surface p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl animate-in fade-in duration-300">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-neon-green/20 border border-neon-green/40 flex items-center justify-center text-neon-green shrink-0">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted uppercase font-bold tracking-wider">Fecha seleccionada</p>
              <h3 className="font-display font-extrabold text-xl text-foreground">
                {selectedFecha}
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Guardada en tu plan de cotización
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="md" leftIcon={<MessageCircle className="w-4 h-4" />}>
                Consultar por WhatsApp
              </Button>
            </a>
            <Button
              variant="primary"
              size="md"
              onClick={handleArmarFiesta}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Armar fiesta para esta fecha
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 rounded-2xl border border-white/5 bg-surface/50 text-muted text-sm">
          💡 Toca cualquier fecha en el calendario para consultar disponibilidad inmediata o comenzar a armar tu fiesta.
        </div>
      )}
    </div>
  );
}
