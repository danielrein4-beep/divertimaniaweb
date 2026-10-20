// Ocasiones que el cliente puede elegir. `slug` coincide con los valores guardados en
// Servicio.ocasiones; `tipoEvento` es la opción del formulario de Mi fiesta.
export const OCASIONES = [
  { slug: "cumpleanos", nombre: "Cumpleaños", tipoEvento: "Cumpleaños", foto: "/images/cumpleanos-portada.jpg", video: "/videos/cumpleanos.mp4" },
  { slug: "baby-shower", nombre: "Baby Shower", tipoEvento: "Baby Shower", foto: "/images/baby-shower.png", video: "/videos/baby-shower.mp4" },
  { slug: "gender-reveal", nombre: "Gender Reveal", tipoEvento: "Revelación de género", foto: "/images/gender-reveal-portada.jpg", video: "/videos/gender-reveal.mp4" },
  { slug: "quince", nombre: "15 años", tipoEvento: "15 años", foto: "/images/quince-portada.jpg", video: "/videos/quince.mp4" },
  { slug: "boda", nombre: "Bodas", tipoEvento: "Boda", foto: "/images/boda-portada.jpg", video: "/videos/boda.mp4" },
  { slug: "corporativo", nombre: "Corporativos", tipoEvento: "Corporativo", foto: "/images/corporativo-portada.jpg", video: "/videos/corporativo.mp4" },
  { slug: "graduacion", nombre: "Graduaciones", tipoEvento: "Graduación", foto: "/images/mickey-minnie-graduacion.jpg" },
  { slug: "navidad", nombre: "Navidad", tipoEvento: "Navidad", foto: "/images/mickey-navidad-show.png" },
] as const;

export type OcasionSlug = (typeof OCASIONES)[number]["slug"];

export function getOcasion(slug: string | undefined | null) {
  return OCASIONES.find((o) => o.slug === slug);
}
