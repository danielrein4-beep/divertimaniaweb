/** Un video corto para la tarjeta del catálogo, con su fotograma. */
export type ClipTarjeta = { url: string; poster: string | null };

/**
 * Los reels completos (30-90 s, hasta 9 MB) se quedan en la ficha; las tarjetas usan un clip corto
 * de 7 s ya comprimido (public/reels/card). Los demás videos ya son cortos y se usan tal cual.
 */
export function clipDeTarjeta(url: string, poster?: string | null): ClipTarjeta {
  const m = url.match(/^\/reels\/reel-(\d+)\.mp4$/);
  if (m) return { url: `/reels/card/reel-${m[1]}.mp4`, poster: `/reels/card/reel-${m[1]}.jpg` };
  return { url, poster: poster ?? null };
}
