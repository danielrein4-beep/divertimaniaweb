"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { buildWhatsAppLink, formatTelefono, WHATSAPP_POR_DEFECTO } from "@/lib/telefono";
import type { ConfigSitio } from "@/lib/configSitio";

const SitioConfigContext = createContext<ConfigSitio>({ whatsapp: WHATSAPP_POR_DEFECTO });

export function SitioConfigProvider({ config, children }: { config: ConfigSitio; children: ReactNode }) {
  return <SitioConfigContext.Provider value={config}>{children}</SitioConfigContext.Provider>;
}

/** Número de WhatsApp configurado en el admin y helper para armar enlaces con mensaje. */
export function useWhatsApp() {
  const { whatsapp } = useContext(SitioConfigContext);
  return useMemo(
    () => ({
      numero: whatsapp,
      display: formatTelefono(whatsapp),
      link: (mensaje: string) => buildWhatsAppLink(whatsapp, mensaje),
    }),
    [whatsapp]
  );
}
