import path from "node:path";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

/** Carpeta donde se guardan las fotos y videos que sube el equipo (fuera de /public, se sirven por /media). */
export const UPLOADS_DIR = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "uploads");

export const MAX_FOTO_BYTES = 15 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 80 * 1024 * 1024;

const VIDEO_EXT: Record<string, string> = { "video/mp4": "mp4", "video/quicktime": "mov", "video/webm": "webm" };

/** Solo nombres generados por nosotros: evita que una ruta salga de la carpeta. */
export const NOMBRE_VALIDO = /^[a-z0-9-]+\.(jpg|mp4|mov|webm)$/;

function nombreNuevo(ext: string) {
  return `${Date.now().toString(36)}-${randomBytes(5).toString("hex")}.${ext}`;
}

export async function guardarArchivo(file: File): Promise<{ url: string; tipo: "FOTO" | "VIDEO" }> {
  await mkdir(UPLOADS_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type.startsWith("image/")) {
    if (buffer.length > MAX_FOTO_BYTES) throw new Error("La foto pesa más de 15 MB.");
    // Se gira según el teléfono, se achica a un tamaño web y se guarda como JPG.
    const salida = await sharp(buffer)
      .rotate()
      .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer()
      .catch(() => {
        throw new Error("No se pudo leer la imagen. Prueba con una foto JPG o PNG.");
      });
    const nombre = nombreNuevo("jpg");
    await writeFile(path.join(UPLOADS_DIR, nombre), salida);
    return { url: `/media/${nombre}`, tipo: "FOTO" };
  }

  const ext = VIDEO_EXT[file.type];
  if (ext) {
    if (buffer.length > MAX_VIDEO_BYTES) throw new Error("El video pesa más de 80 MB. Recórtalo o mándalo comprimido.");
    const nombre = nombreNuevo(ext);
    await writeFile(path.join(UPLOADS_DIR, nombre), buffer);
    return { url: `/media/${nombre}`, tipo: "VIDEO" };
  }

  throw new Error("Ese tipo de archivo no se puede subir. Usa fotos (JPG, PNG o WEBP) o videos MP4.");
}
