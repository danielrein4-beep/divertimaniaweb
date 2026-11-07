import type { OcasionSlug } from "@/lib/ocasiones";
import type { Pregunta } from "@/lib/negocio";

/** Un paquete armado con servicios del catálogo. `desde` en US$; null = «a tu medida» hasta que se confirme. */
export type Paquete = {
  nombre: string;
  para: string;
  incluye: string[];
  desde: number | null;
  destacado?: boolean;
};

/** Contenido de la página de una ocasión (/fiestas/<ruta>). */
export type Fiesta = {
  ocasion: OcasionSlug;
  /** Dirección legible para Google: /fiestas/15-anos, /fiestas/empresas… */
  ruta: string;
  h1: string;
  bajada: string;
  porque: { titulo: string; texto: string }[];
  paquetes: Paquete[];
  preguntas: Pregunta[];
  seo: { titulo: string; descripcion: string };
  /** Otras ocasiones cuyos servicios también sirven aquí (ej. gender reveal usa los de baby shower). */
  tambienServicios?: OcasionSlug[];
};
