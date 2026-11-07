// Fiestas de adultos y empresas. Paquetes armados con servicios del catálogo; los «desde» quedan
// en null (POR CONFIRMAR con Divertimania) y la página muestra «Cotización a tu medida».
import type { Fiesta } from "./tipos";

export const QUINCE: Fiesta = {
  ocasion: "quince",
  ruta: "15-anos",
  h1: "Quince años con show y hora loca",
  bajada: "La entrada, el vals y la hora loca, con shows que convierten la noche en la fiesta que ella soñó.",
  porque: [
    { titulo: "Momentos que se planifican", texto: "Coordinamos la entrada, el vals y los shows con el resto del evento para que todo fluya." },
    { titulo: "Shows con producción", texto: "Bailarinas, show LED, bolas disco y personajes según la temática de la fiesta." },
    { titulo: "La pista llena", texto: "Hora loca con animadores, accesorios y el cañón de espuma para cerrar en alto." },
  ],
  paquetes: [
    { nombre: "Hora loca", para: "Para encender la pista", incluye: ["Animadores de hora loca", "Accesorios y cotillón", "Música coordinada con el DJ"], desde: null },
    { nombre: "Show", para: "El más elegido", incluye: ["Todo lo de Hora loca", "Show según la temática", "Bolas disco o show LED"], desde: null, destacado: true },
    { nombre: "Noche completa", para: "Todos los momentos", incluye: ["Todo lo de Show", "Personajes para la entrada", "Espumanía para cerrar la noche"], desde: null },
  ],
  preguntas: [
    { pregunta: "¿Se coordinan con el DJ y el salón?", respuesta: "Sí. Antes de la fecha acordamos con el DJ y el salón los tiempos de cada show y de la hora loca." },
    { pregunta: "¿Pueden hacer un show con la temática de la fiesta?", respuesta: "Sí, el show se adapta a la temática: princesas, Encanto, K-pop, neón y muchas más." },
  ],
  seo: {
    titulo: "Shows y hora loca para 15 años | Divertimania",
    descripcion: "Fiestas de 15 años con shows temáticos, bolas disco, show LED, personajes y hora loca. San Cristóbal y toda Venezuela.",
  },
};

export const BODAS: Fiesta = {
  ocasion: "boda",
  ruta: "bodas",
  h1: "Bodas con una fiesta a la altura",
  bajada: "Shows y hora loca para que, después de la ceremonia, la celebración no tenga comparación.",
  porque: [
    { titulo: "Elegancia y energía", texto: "Shows de LED y bolas disco que acompañan la estética de la boda sin romperla." },
    { titulo: "En el momento justo", texto: "Coordinamos con el planner y el DJ para entrar cuando la fiesta lo pide." },
    { titulo: "Para todos los invitados", texto: "Hora loca que mueve desde los primos hasta los abuelos." },
  ],
  paquetes: [
    { nombre: "Hora loca", para: "Para encender la pista", incluye: ["Animadores de hora loca", "Accesorios y cotillón", "Coordinación con el DJ"], desde: null },
    { nombre: "Show", para: "El más elegido", incluye: ["Todo lo de Hora loca", "Show LED o bolas disco", "Show según la temática"], desde: null, destacado: true },
    { nombre: "Celebración completa", para: "Todos los momentos", incluye: ["Todo lo de Show", "Carritos de comida para la madrugada", "Más tiempo de hora loca"], desde: null },
  ],
  preguntas: [
    { pregunta: "¿Trabajan con wedding planners?", respuesta: "Sí. Nos coordinamos con el planner, el DJ y el salón para los tiempos y el montaje." },
    { pregunta: "¿Pueden ir a bodas fuera del Táchira?", respuesta: "Sí, viajamos a cualquier ciudad del país. El traslado y los viáticos se cotizan aparte." },
  ],
  seo: {
    titulo: "Shows y hora loca para bodas | Divertimania",
    descripcion: "Bodas con show LED, bolas disco, hora loca y carritos de comida. Nos coordinamos con planner y DJ. Toda Venezuela.",
  },
};

export const EMPRESAS: Fiesta = {
  ocasion: "corporativo",
  ruta: "empresas",
  h1: "Eventos de empresa que la gente comenta",
  bajada: "Fin de año, aniversarios, lanzamientos y activaciones de marca, con shows y animación profesional.",
  porque: [
    { titulo: "Pensado para equipos", texto: "Dinámicas de integración, shows y hora loca que funcionan con grupos grandes." },
    { titulo: "Tu marca al frente", texto: "Activaciones y shows adaptados a la identidad de la empresa o del producto." },
    { titulo: "Formalidad", texto: "Propuesta por escrito, coordinación con tu equipo de eventos y atención puntual." },
  ],
  paquetes: [
    { nombre: "Integración", para: "Equipos y celebraciones internas", incluye: ["Animador con sonido", "Dinámicas de integración", "Hora loca"], desde: null },
    { nombre: "Fin de año", para: "El más elegido", incluye: ["Todo lo de Integración", "Show según la temática", "Show LED o bolas disco"], desde: null, destacado: true },
    { nombre: "Activación de marca", para: "Lanzamientos y ferias", incluye: ["Show adaptado a la marca", "Estación creativa o carritos de comida", "Animación para el público"], desde: null },
  ],
  preguntas: [
    { pregunta: "¿Entregan propuesta formal?", respuesta: "Sí. Enviamos una propuesta por escrito con lo que incluye, horario y condiciones para que la apruebe tu empresa." },
    { pregunta: "¿Animan la fiesta de los hijos de los trabajadores?", respuesta: "Sí, es de lo que más hacemos en diciembre: personajes, animación y entrega de regalos." },
  ],
  seo: {
    titulo: "Animación y shows para eventos de empresa | Divertimania",
    descripcion: "Fin de año, aniversarios, lanzamientos y activaciones de marca con shows, animación y hora loca. Toda Venezuela.",
  },
};
