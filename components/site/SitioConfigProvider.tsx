"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { buildWhatsAppLink, formatTelefono, WHATSAPP_POR_DEFECTO, WHATSAPP2_POR_DEFECTO } from "@/lib/telefono";
import { numerosWhatsApp, type ConfigSitio } from "@/lib/configSitio";

const SitioConfigContext = createContext<ConfigSitio>({ whatsapp: WHATSAPP_POR_DEFECTO, whatsapp2: WHATSAPP2_POR_DEFECTO });

export function SitioConfigProvider({ config, children }: { config: ConfigSitio; children: ReactNode }) {
  return <SitioConfigContext.Provider value={config}>{children}</SitioConfigContext.Provider>;
}

/** Números de WhatsApp configurados en el admin y helper para armar enlaces con mensaje. */
export function useWhatsApp() {
  const config = useContext(SitioConfigContext);
  return useMemo(
    () => ({
      numero: config.whatsapp,
      /** Todos los números (si hay más de uno, el cliente elige a cuál escribir). */
      numeros: numerosWhatsApp(config),
      display: formatTelefono(config.whatsapp),
      link: (mensaje: string) => buildWhatsAppLink(config.whatsapp, mensaje),
    }),
    [config]
  );
}
