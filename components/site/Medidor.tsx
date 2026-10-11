"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { registrarMetrica } from "@/lib/metricas";

/**
 * Cuenta una visita por página vista y cada toque a un enlace de WhatsApp o Instagram.
 * Los enlaces indican de dónde vienen con data-origen (y data-detalle con el servicio).
 */
export default function Medidor() {
  const pathname = usePathname();

  useEffect(() => {
    registrarMetrica("VISITA");
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const enlace = (e.target as Element | null)?.closest?.("a[href]");
      if (!(enlace instanceof HTMLAnchorElement)) return;
      const tipo = enlace.href.includes("wa.me/")
        ? "WHATSAPP"
        : enlace.href.includes("instagram.com")
          ? "INSTAGRAM"
          : null;
      if (!tipo) return;
      const conOrigen = enlace.closest<HTMLElement>("[data-origen]");
      registrarMetrica(tipo, {
        origen: conOrigen?.dataset.origen,
        detalle: conOrigen?.dataset.detalle,
      });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
