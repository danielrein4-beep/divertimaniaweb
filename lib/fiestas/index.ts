// Páginas por ocasión (/fiestas/<ruta>). El orden es el del menú y de «Otras celebraciones».
import { getOcasion } from "@/lib/ocasiones";
import { BABY_SHOWER, CUMPLEANOS, GENDER_REVEAL, GRADUACION, NAVIDAD } from "./infantiles";
import { BODAS, EMPRESAS, QUINCE } from "./adultos";
import type { Fiesta } from "./tipos";

export type { Fiesta, Paquete } from "./tipos";

export const FIESTAS: Fiesta[] = [CUMPLEANOS, QUINCE, BODAS, EMPRESAS, BABY_SHOWER, GENDER_REVEAL, GRADUACION, NAVIDAD];

export const fiestaPorRuta = (ruta: string) => FIESTAS.find((f) => f.ruta === ruta);
export const rutaDeOcasion = (slug: string) => FIESTAS.find((f) => f.ocasion === slug)?.ruta;

/** La fiesta con los datos visuales de su ocasión (nombre, foto y video de portada). */
export function fiestaCompleta(ruta: string) {
  const fiesta = fiestaPorRuta(ruta);
  const ocasion = fiesta && getOcasion(fiesta.ocasion);
  if (!fiesta || !ocasion) return null;
  return { ...fiesta, nombre: ocasion.nombre, tipoEvento: ocasion.tipoEvento, foto: ocasion.foto, video: "video" in ocasion ? ocasion.video : null };
}
