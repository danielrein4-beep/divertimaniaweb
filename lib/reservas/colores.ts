import type { EstadoReserva } from "./estados";

/** Color de la etiqueta de cada estado en el panel. */
export const COLOR_ESTADO: Record<EstadoReserva, string> = {
  SOLICITADA: "text-neon-green ring-neon-green/40",
  ESPERANDO_PAGO: "text-foreground/80 ring-white/25",
  PAGO_REPORTADO: "text-gold ring-gold/40",
  CONFIRMADA: "text-sky-300 ring-sky-400/40",
  RECHAZADA: "text-muted ring-white/15",
};
