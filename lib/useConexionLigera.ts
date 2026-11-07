"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

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
  return Boolean(c.saveData) || ["slow-2g", "2g", "3g"].includes(c.effectiveType ?? "");
}

/**
 * true cuando conviene ahorrar datos: «ahorro de datos» activado, conexión 3G o peor, o la
 * persona pidió menos animación. En el servidor se asume true, así el HTML llega con fotos
 * livianas y los videos solo se piden en el navegador cuando la conexión los aguanta.
 */
export function useConexionLigera(): boolean {
  return useSyncExternalStore(suscribir, esLigera, () => true);
}

/**
 * false hasta que la página terminó de cargar y el navegador quedó libre: los videos decorativos
 * se piden recién ahí, para no competir con el texto y las fotos que la persona ve primero.
 */
export function useTrasCarga(): boolean {
  const [listo, setListo] = useState(false);
  useEffect(() => {
    const marcar = () => {
      const enReposo = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 1200));
      enReposo(() => setListo(true));
    };
    if (document.readyState === "complete") marcar();
    else window.addEventListener("load", marcar, { once: true });
    return () => window.removeEventListener("load", marcar);
  }, []);
  return listo;
}

const ANCHA = "(min-width: 768px)";
function suscribirAncho(avisar: () => void) {
  const m = window.matchMedia(ANCHA);
  m.addEventListener("change", avisar);
  return () => m.removeEventListener("change", avisar);
}

/** true en pantallas de tablet o computadora; en el servidor se asume teléfono (lo más liviano). */
export function usePantallaAncha(): boolean {
  return useSyncExternalStore(suscribirAncho, () => window.matchMedia(ANCHA).matches, () => false);
}
