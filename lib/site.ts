export const INSTAGRAM_HANDLE = "divertimania2";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

// Datos del perfil de Instagram (@divertimania2), tomados del perfil en octubre 2026.
// Actualizarlos a mano cuando cambien.
export const PERFIL_IG = {
  publicaciones: "1.060",
  seguidores: "16,8 mil",
  bio: [
    { icono: "🤩", texto: "Creamos momentos inolvidables" },
    { icono: "🪅", texto: "Bodas · 15 años · corporativos y fiestas infantiles" },
    { icono: "🎤", texto: "Animación · Shows · Personajes · Hora Loca" },
  ],
};

/** true en /catalogo/[id] (la ficha tiene su propia barra fija). */
export function esFichaDeServicio(pathname: string | null): boolean {
  return Boolean(pathname && /^\/catalogo\/[^/]+$/.test(pathname));
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
