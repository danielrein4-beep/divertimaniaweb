// Prepara las fotos del catálogo PDF: para cada ficha con video escoge el MEJOR fotograma (el más nítido y bien
// expuesto, de 18 muestras repartidas por todo el video) y lo mejora (reescalado Lanczos, nitidez, contraste y color).
// Las fichas con foto la reciben con la misma mejora. Resultado: lib/catalogoPdf/fotos/<clave>.jpg + index.json.
// Se corre a mano cuando cambian los videos:  node scripts/fotos-pdf.mjs
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");
const ffmpeg = require("ffmpeg-static");
const sharp = require("sharp");

const RAIZ = process.cwd();
const SALIDA = path.join(RAIZ, "lib", "catalogoPdf", "fotos");
mkdirSync(SALIDA, { recursive: true });
const prisma = new PrismaClient();

export const clave = (t) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const ruta = (url) => path.join(RAIZ, "public", url.replace(/^\/+/, ""));

function duracion(archivo) {
  try {
    execFileSync(ffmpeg, ["-i", archivo], { stdio: "pipe" });
  } catch (e) {
    const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(String(e.stderr));
    if (m) return +m[1] * 3600 + +m[2] * 60 + +m[3];
  }
  return 3;
}

async function puntaje(png) {
  const base = sharp(png).resize(256, null).greyscale();
  const { data, info } = await base.clone().raw().toBuffer({ resolveWithObject: true });
  const lap = await base.clone().convolve({ width: 3, height: 3, kernel: [0, 1, 0, 1, -4, 1, 0, 1, 0], scale: 1, offset: 128 }).raw().toBuffer();
  let sum = 0;
  for (const v of data) sum += v;
  const media = sum / data.length;
  let acc = 0;
  for (const v of lap) acc += (v - 128) * (v - 128);
  const nitidez = acc / lap.length;
  let f = 1;
  if (media < 55) f = 0.4 + media / 100;
  else if (media > 200) f = 0.4 + (255 - media) / 100;
  return { puntaje: nitidez * f, media, nitidez, ancho: info.width };
}

async function mejorFotograma(archivo) {
  const dur = duracion(archivo);
  let mejor = null;
  const N = 18;
  for (let i = 0; i < N; i++) {
    const t = Math.max(0.05, Math.min(dur - 0.1, (dur * (i + 0.5)) / N));
    let png;
    try {
      png = execFileSync(ffmpeg, ["-v", "error", "-ss", t.toFixed(2), "-i", archivo, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], { maxBuffer: 1e8 });
    } catch {
      continue;
    }
    if (!png.length) continue;
    const p = await puntaje(png);
    if (!mejor || p.puntaje > mejor.puntaje) mejor = { ...p, t, png };
  }
  return mejor;
}

async function mejorar(buf, ancho = 640, alto = 800) {
  return sharp(buf)
    .resize(ancho, alto, { fit: "cover", position: "attention", kernel: "lanczos3" })
    .modulate({ saturation: 1.12, brightness: 1.03 })
    .linear(1.06, -6)
    .sharpen({ sigma: 1.0, m1: 0.9, m2: 2.0 })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
}

// Fichas donde el mejor fotograma automático no es el mejor: se usa la foto curada a mano (o una foto real).
const FOTO_CURADA = new Set(["Princesas Disney · Show de Elsa", "Tequileras Biker", "Elvis y Marilyn Monroe", "Princesas Disney · Show de toda la película de Frozen", "Último Timbre", "Fogatadas", "Opciones para tu boda", "Encanto", "Blippi", "Bailarinas Árabes", "Garotas", "Robots Tamboreros", "Baby Shower", "Revelación de Género", "Princesas Disney · Show de Cenicienta", "Princesas Disney · Show de Rapunzel", "Espumanía", "Animación Infantil", "Minecraft", "Guerreras K-Pop", "Daft Punk", "Personajes de Pascua", "Zombies", "Bright Monsters"]);
const FOTO_FIJA = {
  "Princesas Disney": "/images/princesas-disney-grupo.jpg",
  "Princesas Disney · Show de Bella": "/images/bella-show-2.jpg",
  "Princesas Disney · Show de Bella y la Bestia": "/images/bella-bestia-show-2.jpg",
};
const indice = {};
async function procesar(nombre, video, foto) {
  const k = clave(nombre);
  let origen = null;
  let detalle = "";
  if (FOTO_FIJA[nombre]) {
    foto = FOTO_FIJA[nombre];
    video = null;
  }
  else if (FOTO_CURADA.has(nombre)) video = null;
  if (video && existsSync(ruta(video))) {
    const m = await mejorFotograma(ruta(video));
    if (m) {
      origen = m.png;
      detalle = `video t=${m.t.toFixed(1)}s nitidez=${m.nitidez.toFixed(0)} luz=${m.media.toFixed(0)}`;
    }
  }
  if (!origen && foto && existsSync(ruta(foto))) {
    origen = readFileSync(ruta(foto));
    detalle = "foto";
  }
  if (!origen) {
    console.log("SIN FOTO  ", nombre);
    return;
  }
  writeFileSync(path.join(SALIDA, `${k}.jpg`), await mejorar(origen));
  indice[nombre] = { archivo: `${k}.jpg`, detalle };
  console.log(nombre.padEnd(42), detalle);
}

const servicios = await prisma.servicio.findMany({
  where: { activo: true, enPdf: true },
  orderBy: { orden: "asc" },
  include: { media: { where: { tipo: "VIDEO" }, orderBy: { orden: "asc" } }, opciones: { where: { tipo: "VARIANTE" }, orderBy: { orden: "asc" } } },
});
for (const s of servicios) {
  await procesar(s.nombre, s.media[0]?.url, s.fotoUrl);
  for (const o of s.opciones) await procesar(`${s.nombre} · ${o.nombre}`, o.videoUrl, o.fotoUrl);
}
writeFileSync(path.join(SALIDA, "index.json"), JSON.stringify(indice, null, 1));
await prisma.$disconnect();
console.log(`\nListo: ${Object.keys(indice).length} fotos en lib/catalogoPdf/fotos`);
