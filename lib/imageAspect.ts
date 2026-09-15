// Relación de aspecto (ancho/alto) real de cada foto en public/images, para que
// las tarjetas se ajusten a la forma real de la imagen y no queden bordes vacíos.
export const IMAGE_ASPECT: Record<string, number> = {
  "/images/animacion-infantil-conejos.png": 0.614,
  "/images/dia-piscina-espuma.png": 0.665,
  "/images/baby-shower.png": 0.811,
  "/images/bolas-disco-duo.jpg": 1.499,
  "/images/bolas-disco-equipo.jpg": 1.197,
  "/images/diverti-artistas.png": 0.737,
  "/images/espumania-foam.png": 0.753,
  "/images/fiestas-infantiles-mario.jpg": 1.171,
  "/images/frozen-olaf-elsa.jpg": 0.75,
  "/images/mickey-minnie-graduacion.jpg": 0.933,
  "/images/mickey-racer.jpg": 1.193,
  "/images/minnie.jpg": 0.563,
  "/images/pelotas-boom-piscina.png": 0.736,
  "/images/pelotas-boom-rooftop.png": 0.861,
  "/images/princesa-rapunzel.jpg": 0.667,
  "/images/show-led-hoop.jpg": 0.75,
  "/images/show-tematico-catrina.jpg": 0.889,
  "/images/show-tematico-kpop.jpg": 0.703,
  "/images/superheroes.jpg": 1.206,
};

export function getImageAspect(src: string, fallback = 1): number {
  return IMAGE_ASPECT[src] ?? fallback;
}
