// Ocasiones que el cliente puede elegir. `slug` coincide con los valores guardados en
// Servicio.ocasiones; `tipoEvento` es la opción del formulario de Mi fiesta.
export const OCASIONES = [
  { slug: "cumpleanos", nombre: "Cumpleaños", tipoEvento: "Cumpleaños", foto: "/images/fiestas-infantiles-mario.jpg" },
  { slug: "baby-shower", nombre: "Baby Shower", tipoEvento: "Baby Shower", foto: "/images/baby-shower.png" },
  { slug: "quince", nombre: "15 años", tipoEvento: "15 años", foto: "/images/show-led-hoop.jpg" },
  { slug: "boda", nombre: "Bodas", tipoEvento: "Boda", foto: "/images/bolas-disco-duo.jpg" },
  { slug: "corporativo", nombre: "Corporativos", tipoEvento: "Corporativo", foto: "/images/show-tematico-kpop.jpg" },
  { slug: "graduacion", nombre: "Graduaciones", tipoEvento: "Graduación", foto: "/images/mickey-minnie-graduacion.jpg" },
  { slug: "navidad", nombre: "Navidad", tipoEvento: "Navidad", foto: "/images/mickey-navidad-show.png" },
] as const;

export type OcasionSlug = (typeof OCASIONES)[number]["slug"];

export function getOcasion(slug: string | undefined | null) {
  return OCASIONES.find((o) => o.slug === slug);
}
