import React from "react";
import { CheckCircle2, Clock, Users, ShieldAlert, Sparkles } from "lucide-react";
import Badge from "@/components/ui/Badge";

interface ServicioQueIncluyeProps {
  incluye: string | null;
  edadIdeal: string | null;
  duracion: string | null;
  soloAdultos: boolean;
  masPedido: boolean;
}

export default function ServicioQueIncluye({
  incluye,
  edadIdeal,
  duracion,
  soloAdultos,
  masPedido,
}: ServicioQueIncluyeProps) {
  // Parsear lista de items incluidos (por saltos de línea o comas)
  const items = incluye
    ? incluye
        .split(/\n|,/)
        .map((i) => i.trim())
        .filter(Boolean)
    : [
        "Animación profesional en vivo con equipo capacitado",
        "Música y dinámicas adaptadas al tipo de evento",
        "Vestuario temático de alta calidad e impecable",
        "Sesión de fotos y momentos especiales con los homenajeados",
      ];

  return (
    <div className="rounded-3xl border border-white/10 bg-surface p-6 sm:p-8 flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="type-h3 font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-neon-green" />
          <span>¿Qué incluye este servicio?</span>
        </h2>

        {/* Badges de especificación */}
        <div className="flex flex-wrap items-center gap-2">
          {soloAdultos && (
            <Badge variant="danger" size="sm" icon={<ShieldAlert className="w-3 h-3" />}>
              Exclusivo Adultos (+18)
            </Badge>
          )}
          {masPedido && (
            <Badge variant="gold" size="sm">
              Más pedido en Táchira
            </Badge>
          )}
        </div>
      </div>

      {/* Franja de duración y público */}
      {(duracion || edadIdeal) && (
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-surface-raised border border-white/5">
          {duracion && (
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-neon-green shrink-0" />
              <div>
                <p className="text-[11px] text-muted uppercase font-semibold">Duración aprox.</p>
                <p className="text-sm font-bold text-foreground">{duracion}</p>
              </div>
            </div>
          )}
          {edadIdeal && (
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-neon-green shrink-0" />
              <div>
                <p className="text-[11px] text-muted uppercase font-semibold">Público recomendado</p>
                <p className="text-sm font-bold text-foreground">{edadIdeal}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lista de viñetas con checkmarks */}
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-foreground/90">
            <CheckCircle2 className="w-4 h-4 text-neon-green shrink-0 mt-0.5" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
