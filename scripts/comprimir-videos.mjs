// Comprime los videos de public/ para que el sitio cargue rápido en celular.
// Uso: node scripts/comprimir-videos.mjs
//
// - public/reels/reel-N.mp4        → 540p, H.264, audio mono 64k (se ven en las fichas, con sonido opcional)
// - public/reels/intro/reel-N.mp4  → primeros 6 s, 360p, sin audio (mosaico de la intro del Inicio)
// - public/hero.mp4                → 540p, sin audio (relleno de las letras del Hero) + public/hero-poster.jpg
//
// Si un video ya está comprimido (bitrate bajo) no se vuelve a procesar, para no perder calidad.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, renameSync, statSync } from "node:fs";
import path from "node:path";
import ffmpeg from "ffmpeg-static";

const PUBLIC = path.resolve("public");
const REELS = path.join(PUBLIC, "reels");
const INTRO = path.join(REELS, "intro");

function run(args) {
  execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
}

function bitrateKbps(file) {
  try {
    execFileSync(ffmpeg, ["-hide_banner", "-i", file], { stdio: "pipe" });
  } catch (e) {
    const m = String(e.stderr).match(/bitrate: (\d+) kb\/s/);
    return m ? Number(m[1]) : Infinity;
  }
  return Infinity;
}

const mb = (file) => (statSync(file).size / 1048576).toFixed(1);

function comprimir(file, args, maxKbps) {
  if (bitrateKbps(file) <= maxKbps) {
    console.log(`= ${path.relative(PUBLIC, file)} ya está comprimido (${mb(file)} MB)`);
    return;
  }
  const antes = mb(file);
  const tmp = `${file}.tmp.mp4`;
  run(["-i", file, ...args, "-movflags", "+faststart", tmp]);
  renameSync(tmp, file);
  console.log(`✓ ${path.relative(PUBLIC, file)}: ${antes} MB → ${mb(file)} MB`);
}

mkdirSync(INTRO, { recursive: true });
const reels = readdirSync(REELS).filter((f) => /^reel-\d+\.mp4$/.test(f));

for (const nombre of reels) {
  const origen = path.join(REELS, nombre);
  const intro = path.join(INTRO, nombre);

  // La versión corta sale del original, antes de comprimirlo.
  if (!existsSync(intro)) {
    run(["-ss", "0", "-t", "6", "-i", origen, "-an", "-vf", "scale=360:-2", "-c:v", "libx264", "-preset", "slow", "-crf", "30", "-pix_fmt", "yuv420p", "-movflags", "+faststart", intro]);
    console.log(`✓ reels/intro/${nombre}: ${mb(intro)} MB`);
  }

  comprimir(origen, ["-vf", "scale=540:-2", "-c:v", "libx264", "-preset", "slow", "-crf", "32", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "64k", "-ac", "1"], 1200);
}

const hero = path.join(PUBLIC, "hero.mp4");
const poster = path.join(PUBLIC, "hero-poster.jpg");
if (!existsSync(poster)) {
  run(["-ss", "1", "-i", hero, "-frames:v", "1", "-vf", "scale=540:-2", "-q:v", "4", poster]);
  console.log("✓ hero-poster.jpg");
}
comprimir(hero, ["-an", "-vf", "scale=540:-2", "-c:v", "libx264", "-preset", "slow", "-crf", "30", "-pix_fmt", "yuv420p"], 1200);
