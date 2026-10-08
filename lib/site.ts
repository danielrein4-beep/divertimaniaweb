export const WHATSAPP_LINK = "https://wa.me/message/ELT6QN7TWA5HK1";

// Número real de Divertimania (del catálogo oficial) para enlaces con mensaje
// pre-llenado — el link corto de arriba no admite texto personalizado.
export const WHATSAPP_PHONE = "584147286881";

export const WHATSAPP_DISPLAY = "+58 414-728-6881";
export const INSTAGRAM_HANDLE = "divertimania2";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

/** true en /catalogo/[id] (la ficha tiene su propia barra fija). */
export function esFichaDeServicio(pathname: string | null): boolean {
  return Boolean(pathname && /^\/catalogo\/[^/]+$/.test(pathname));
}

export function buildWhatsAppLink(mensaje: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(mensaje)}`;
}

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/equipo", label: "Equipo" },
  { href: "/galeria", label: "Galería" },
  { href: "/disponibilidad", label: "Consulta tu fecha" },
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
