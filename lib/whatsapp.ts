import { buildWhatsAppLink } from "./site";

export function getGeneralWhatsAppLink(): string {
  return buildWhatsAppLink(
    "Hola Divertimania 👋 Vengo de la página web y quiero más información sobre sus servicios para mi evento."
  );
}

export function getServiceWhatsAppLink(serviceName: string): string {
  return buildWhatsAppLink(
    `Hola Divertimania 👋 Vengo de la página web y quiero cotizar el servicio: ${serviceName}.`
  );
}

export function getAsesoriaWhatsAppLink(): string {
  return buildWhatsAppLink(
    "Hola Divertimania 👋 Vengo de la página web. Quiero asesoría para armar la fiesta perfecta."
  );
}

export function getFechaWhatsAppLink(fecha: string): string {
  return buildWhatsAppLink(
    `Hola Divertimania 👋 Vengo de la página web y me gustaría consultar disponibilidad para la fecha: ${fecha}.`
  );
}

export function getNoEncontradoWhatsAppLink(busqueda: string): string {
  return buildWhatsAppLink(
    `Hola Divertimania 👋 Vengo de la página web. Estaba buscando "${busqueda}" y me gustaría saber si lo tienen disponible para mi evento.`
  );
}
