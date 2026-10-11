import path from "node:path";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { NOMBRE_VALIDO, UPLOADS_DIR } from "@/lib/uploads";

const TIPOS: Record<string, string> = {
  jpg: "image/jpeg",
  mp4: "video/mp4",
  mov: "video/quicktime",
  webm: "video/webm",
};

function cuerpo(ruta: string, start?: number, end?: number) {
  return Readable.toWeb(createReadStream(ruta, { start, end })) as ReadableStream;
}

/**
 * Sirve los archivos subidos desde el panel. Los nombres nunca cambian, así que van con caché larga.
 * Responde por partes (Range) porque Safari en iPhone no reproduce videos sin eso.
 */
export async function GET(request: Request, { params }: { params: Promise<{ nombre: string }> }) {
  const { nombre } = await params;
  if (!NOMBRE_VALIDO.test(nombre)) return new Response("No encontrado", { status: 404 });

  const ruta = path.join(UPLOADS_DIR, nombre);
  const info = await stat(ruta).catch(() => null);
  if (!info?.isFile()) return new Response("No encontrado", { status: 404 });

  const headers: Record<string, string> = {
    "Content-Type": TIPOS[nombre.split(".").pop()!],
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
  };

  const rango = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("range") ?? "");
  if (rango && (rango[1] || rango[2])) {
    const total = info.size;
    let start = rango[1] ? Number(rango[1]) : total - Number(rango[2]);
    let end = rango[1] && rango[2] ? Number(rango[2]) : total - 1;
    start = Math.max(0, start);
    end = Math.min(end, total - 1);
    if (start > end) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${total}` } });
    }
    return new Response(cuerpo(ruta, start, end), {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${total}`, "Content-Length": String(end - start + 1) },
    });
  }

  return new Response(cuerpo(ruta), { headers: { ...headers, "Content-Length": String(info.size) } });
}
