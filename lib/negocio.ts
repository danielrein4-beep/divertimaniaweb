// Datos del negocio que se muestran al cliente: cobertura, cómo reservar, pagos, preguntas y
// testimonios. Se actualizan a mano aquí. Lo marcado «POR CONFIRMAR» hay que validarlo con
// Divertimania antes de publicar.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Ciudades donde ya han hecho eventos. POR CONFIRMAR: lista real. */
export const CIUDADES = [
  "San Cristóbal",
  "Táriba",
  "Rubio",
  "La Grita",
  "Mérida",
  "Barinas",
  "Maracaibo",
  "Valencia",
  "Caracas",
];

export const COBERTURA = {
  titulo: "Desde el Táchira para toda Venezuela",
  texto:
    "Nuestra base está en San Cristóbal, pero llevamos el show a cualquier ciudad del país. Fuera del Táchira el traslado y los viáticos del equipo se cotizan aparte, según la distancia.",
  // POR CONFIRMAR: días de anticipación reales.
  anticipacion: "Fuera del estado, reserva con al menos 15 días de anticipación.",
};

export const PASOS_RESERVA = [
  {
    titulo: "Arma tu fiesta",
    texto: "Elige personajes, shows o animación en el catálogo y agrégalos a «Mi fiesta».",
  },
  {
    titulo: "Consulta la fecha",
    texto: "Nos escribes por WhatsApp con la fecha, el lugar y la cantidad de invitados. Te respondemos con la cotización.",
  },
  {
    titulo: "Aparta con el anticipo",
    texto: "Con el anticipo la fecha queda bloqueada solo para ti. El resto se paga el día del evento.",
  },
];

/** POR CONFIRMAR: métodos que de verdad aceptan y porcentaje del anticipo. */
export const PAGOS = {
  metodos: ["Pago móvil", "Transferencia en bolívares", "Zelle", "Binance (USDT)", "Efectivo en dólares"],
  anticipo: "50 % para apartar la fecha y el resto el día del evento.",
  cambios: "Si necesitas mover la fecha, avísanos con 7 días de anticipación y la pasamos sin costo según disponibilidad.",
};

export type Pregunta = { pregunta: string; respuesta: string };

/** POR CONFIRMAR: respuestas con el equipo. */
export const PREGUNTAS: Pregunta[] = [
  {
    pregunta: "¿Van a otras ciudades fuera del Táchira?",
    respuesta: `Sí. ${COBERTURA.texto} ${COBERTURA.anticipacion}`,
  },
  {
    pregunta: "¿Cómo aparto la fecha?",
    respuesta: `Con el anticipo: ${PAGOS.anticipo} Hasta que no llega el anticipo la fecha sigue libre para otros clientes.`,
  },
  {
    pregunta: "¿Qué formas de pago aceptan?",
    respuesta: `${PAGOS.metodos.join(", ")}.`,
  },
  {
    pregunta: "¿Y si tengo que cambiar la fecha?",
    respuesta: PAGOS.cambios,
  },
  {
    pregunta: "¿Llevan sonido?",
    respuesta: "Sí, la animación y la hora loca van con su propio equipo de sonido. Solo necesitamos un toma corriente cerca.",
  },
  {
    pregunta: "¿Cuánto espacio necesitan?",
    respuesta: "Para animación y personajes basta un espacio libre de unos 4 x 4 metros. Para shows grandes te decimos al cotizar.",
  },
  {
    pregunta: "¿Hacen eventos para empresas?",
    respuesta: "Sí: fin de año, aniversarios, lanzamientos y activaciones de marca. Escríbenos y te armamos una propuesta.",
  },
];

export type Testimonio = { nombre: string; evento: string; ciudad: string; texto: string };

/**
 * Testimonios reales de clientes (con su permiso). Mientras esté vacío, la sección no aparece:
 * nunca inventar testimonios.
 */
export const TESTIMONIOS: Testimonio[] = [];
