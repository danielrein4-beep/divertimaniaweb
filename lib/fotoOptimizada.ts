// Para fotos que se pintan con <img> común (muros animados, tarjetas con efectos), donde no cabe
// <Image> de Next: pasa la foto por el mismo optimizador, que la entrega en WebP/AVIF al ancho
// pedido y la guarda en caché. Un PNG de 550 KB queda en ~40-60 KB.

// Anchos que Next acepta por defecto (deviceSizes) y su única calidad permitida.
type Ancho = 640 | 750 | 828 | 1080 | 1200;
const CALIDAD = 75;

export function fotoOptimizada(src: string, ancho: Ancho = 640): string {
  // Solo fotos propias del sitio (/images, /media, /reels…); lo externo o ya optimizado queda igual.
  if (!src.startsWith("/") || src.startsWith("/_next/")) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${ancho}&q=${CALIDAD}`;
}
