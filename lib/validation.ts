export const ESTADOS_EVENTO = ["COTIZACION", "CONFIRMADO", "CANCELADO"] as const;
export type EstadoEvento = (typeof ESTADOS_EVENTO)[number];

export const TIPOS_RECURSO = ["PERSONAJE", "EQUIPO", "PERSONAL"] as const;
export type TipoRecurso = (typeof TIPOS_RECURSO)[number];

export const ESTADOS_SOLICITUD = ["NUEVA", "CONTACTADA", "CONVERTIDA", "DESCARTADA"] as const;
export type EstadoSolicitud = (typeof ESTADOS_SOLICITUD)[number];

export const ESTADO_EVENTO_LABEL: Record<EstadoEvento, string> = {
  COTIZACION: "Cotización",
  CONFIRMADO: "Confirmado",
  CANCELADO: "Cancelado",
};

export const TIPO_RECURSO_LABEL: Record<TipoRecurso, string> = {
  PERSONAJE: "Personaje",
  EQUIPO: "Equipo",
  PERSONAL: "Personal",
};

export const ESTADO_SOLICITUD_LABEL: Record<EstadoSolicitud, string> = {
  NUEVA: "Nueva",
  CONTACTADA: "Contactada",
  CONVERTIDA: "Convertida",
  DESCARTADA: "Descartada",
};

export const TIPOS_OPCION = ["VARIANTE", "DINAMICA"] as const;
export type TipoOpcion = (typeof TIPOS_OPCION)[number];

export const TIPO_OPCION_LABEL: Record<TipoOpcion, string> = {
  VARIANTE: "Variante de personaje",
  DINAMICA: "Dinámica / juego",
};
