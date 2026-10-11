// Medición propia: visitas y toques a WhatsApp/Instagram, guardados en la base del sitio
// para la sección "Resultados" del admin. Sin servicios externos ni datos personales.

export const TIPOS_METRICA = ["VISITA", "WHATSAPP", "COTIZACION", "INSTAGRAM"] as const;
export type TipoMetrica = (typeof TIPOS_METRICA)[number];

export const ORIGEN_LABEL: Record<string, string> = {
  ficha: "Ficha de un servicio",
  "boton-flotante": "Botón flotante",
  pie: "Pie de página",
  contacto: "Página de contacto",
  "consulta-fecha": "Consulta tu fecha",
  "catalogo-busqueda": "Catálogo (no encontró lo que buscaba)",
  "catalogo-asesoria": "Catálogo (pidió asesoría)",
  equipo: "Página del equipo",
  "mi-fiesta": "Cotización armada (Mi fiesta)",
};

const VISITANTE_KEY = "divertimania_visitante";

function visitanteId(): string | null {
  try {
    let id = localStorage.getItem(VISITANTE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITANTE_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

/** Registra un evento sin bloquear la navegación (sendBeacon sobrevive a la salida de la página). */
export function registrarMetrica(tipo: TipoMetrica, datos: { origen?: string; detalle?: string } = {}) {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({
    tipo,
    origen: datos.origen?.slice(0, 60),
    detalle: datos.detalle?.slice(0, 300),
    pagina: window.location.pathname.slice(0, 200),
    visitante: visitanteId(),
  });
  try {
    if (navigator.sendBeacon?.("/api/metricas", new Blob([payload], { type: "application/json" }))) return;
  } catch {
    // cae al fetch
  }
  fetch("/api/metricas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}
