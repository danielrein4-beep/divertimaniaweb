// Comprobantes de pago: datos bancarios de clientes, así que NO van a /media (público).
// Se guardan en UPLOADS_DIR/comprobantes y solo se sirven al panel.
import path from "node:path";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { UPLOADS_DIR } from "@/lib/uploads";

const CARPETA = path.join(UPLOADS_DIR, "comprobantes");
const MAX_BYTES = 10 * 1024 * 1024;
export const NOMBRE_COMPROBANTE = /^[a-z0-9-]+\.jpg$/;

/** Guarda la captura del pago (achicada a JPG) y devuelve su nombre de archivo. */
export async function guardarComprobante(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Sube una foto o captura del pago (JPG, PNG o WEBP).");
  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > MAX_BYTES) throw new Error("La imagen pesa más de 10 MB.");
  const salida = await sharp(buffer)
    .rotate()
    .resize(1600, 2400, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer()
    .catch(() => {
      throw new Error("No se pudo leer la imagen. Prueba con una captura en JPG o PNG.");
    });
  await mkdir(CARPETA, { recursive: true });
  const nombre = `${Date.now().toString(36)}-${randomBytes(8).toString("hex")}.jpg`;
  await writeFile(path.join(CARPETA, nombre), salida);
  return nombre;
}

export async function leerComprobante(nombre: string): Promise<Buffer | null> {
  if (!NOMBRE_COMPROBANTE.test(nombre)) return null;
  return readFile(path.join(CARPETA, nombre)).catch(() => null);
}
