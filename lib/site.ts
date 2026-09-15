export const WHATSAPP_LINK = "https://wa.me/message/ELT6QN7TWA5HK1";

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
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
