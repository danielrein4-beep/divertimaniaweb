export const WHATSAPP_LINK = "https://wa.me/message/ELT6QN7TWA5HK1";

// Número real de Divertimania (del catálogo oficial) para enlaces con mensaje
// pre-llenado — el link corto de arriba no admite texto personalizado.
export const WHATSAPP_PHONE = "584147286881";

export function buildWhatsAppLink(mensaje: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(mensaje)}`;
}

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/equipo", label: "Equipo" },
  { href: "/galeria", label: "Galería" },
  { href: "/disponibilidad", label: "Disponibilidad" },
  { href: "/contacto", label: "Contacto" },
];

export const CATEGORIAS = [
  "Fiestas Infantiles",
  "Baby Shower",
  "Personajes",
  "Show para Adultos",
  "Estación Creativa",
  "Atracciones",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];
