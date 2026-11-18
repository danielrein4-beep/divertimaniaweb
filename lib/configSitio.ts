import { cache } from "react";
import { prisma } from "@/lib/db";
import { WHATSAPP_POR_DEFECTO, WHATSAPP2_POR_DEFECTO } from "@/lib/telefono";

/** `whatsapp` es el principal; `whatsapp2` es el segundo número (null si no hay). */
export type ConfigSitio = { whatsapp: string; whatsapp2: string | null };

/** Todos los números de WhatsApp del sitio, en orden (sin repetir ni vacíos). */
export function numerosWhatsApp(c: ConfigSitio): string[] {
  return [...new Set([c.whatsapp, c.whatsapp2].filter((n): n is string => Boolean(n)))];
}

/** Ajustes del sitio (una lectura por request). Si la tabla está vacía usa los valores por defecto. */
export const getConfigSitio = cache(async (): Promise<ConfigSitio> => {
  const fila = await prisma.configuracionSitio.findUnique({ where: { id: "principal" } }).catch(() => null);
  return {
    whatsapp: fila?.whatsapp || WHATSAPP_POR_DEFECTO,
    whatsapp2: fila ? fila.whatsapp2 || null : WHATSAPP2_POR_DEFECTO,
  };
});
