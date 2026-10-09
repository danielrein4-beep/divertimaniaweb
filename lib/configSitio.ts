import { cache } from "react";
import { prisma } from "@/lib/db";
import { WHATSAPP_POR_DEFECTO } from "@/lib/telefono";

export type ConfigSitio = { whatsapp: string };

/** Ajustes del sitio (una lectura por request). Si la tabla está vacía usa los valores por defecto. */
export const getConfigSitio = cache(async (): Promise<ConfigSitio> => {
  const fila = await prisma.configuracionSitio.findUnique({ where: { id: "principal" } }).catch(() => null);
  return { whatsapp: fila?.whatsapp || WHATSAPP_POR_DEFECTO };
});
