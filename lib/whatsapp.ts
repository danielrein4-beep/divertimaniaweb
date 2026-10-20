// Mensajes ya escritos para cada botón de WhatsApp del sitio. El número sale de los
// ajustes del admin: en componentes de cliente se usa useWhatsApp(), en el servidor getConfigSitio().

export const MENSAJES_WHATSAPP = {
  general: () =>
    "Hola Divertimania 👋 Vengo de la página web y quiero más información sobre sus servicios para mi evento.",
  servicio: (nombre: string) =>
    `Hola Divertimania 👋 Vengo de la página web y quiero cotizar el servicio: ${nombre}.`,
  asesoria: () => "Hola Divertimania 👋 Vengo de la página web. Quiero asesoría para armar la fiesta perfecta.",
  fecha: (fecha: string) =>
    `Hola Divertimania 👋 Vengo de la página web y me gustaría consultar disponibilidad para la fecha: ${fecha}.`,
  noEncontrado: (busqueda: string) =>
    `Hola Divertimania 👋 Vengo de la página web. Estaba buscando "${busqueda}" y me gustaría saber si lo tienen disponible para mi evento.`,
  novedad: (titulo: string) => `Hola Divertimania 👋 Vengo de la página web y quiero consultar la novedad: ${titulo}.`,
  equipo: () => "Hola Divertimania 👋 Vengo de la página web y quiero información sobre sus recreadores para mi evento.",
};
