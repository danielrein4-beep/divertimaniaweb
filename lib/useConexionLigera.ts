"use client";

import { useSyncExternalStore } from "react";

// navigator.connection no existe en Safari ni en Firefox: ahí se asume buena conexión.
type InfoConexion = { saveData?: boolean; effectiveType?: string; addEventListener?: (e: string, f: () => void) => void; removeEventListener?: (e: string, f: () => void) => void };
const conexion = () => (typeof navigator === "undefined" ? undefined : (navigator as Navigator & { connection?: InfoConexion }).connection);

function suscribir(avisar: () => void) {
  const c = conexion();
  c?.addEventListener?.("change", avisar);
  return () => c?.removeEventListener?.("change", avisar);
}

function esLigera(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const c = conexion();
  if (!c) return false;
  return Boolean(c.saveData) || ["slow-2g", "2g"].includes(c.effectiveType ?? "");
}

/**
 * true cuando conviene ahorrar datos: «ahorro de datos» activado, conexión 2G, o la
 * persona pidió menos animación. En el servidor se asume true, así el HTML llega con fotos
 * livianas y los videos solo se piden en el navegador cuando la conexión los aguanta.
 */
export function useConexionLigera(): boolean {
  return useSyncExternalStore(suscribir, esLigera, () => true);
}
