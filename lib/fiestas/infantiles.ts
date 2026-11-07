// Fiestas con niños y en familia. Paquetes armados con servicios del catálogo; los «desde» quedan
// en null (POR CONFIRMAR con Divertimania) y la página muestra «Cotización a tu medida».
import type { Fiesta } from "./tipos";

export const CUMPLEANOS: Fiesta = {
  ocasion: "cumpleanos",
  ruta: "cumpleanos",
  h1: "Fiestas de cumpleaños que se recuerdan",
  bajada: "Animadores, personajes, espuma y hora loca para que el cumpleañero sea el protagonista de principio a fin.",
  porque: [
    { titulo: "El cumpleañero, primero", texto: "Juegos y dinámicas pensadas para su edad, con su personaje favorito llegando en el mejor momento." },
    { titulo: "Ustedes solo disfrutan", texto: "Llevamos sonido, animadores y todo el montaje. Ustedes reciben a los invitados y toman las fotos." },
    { titulo: "Para todas las edades", texto: "Del primer añito a los 12: adaptamos la animación a la edad y a la cantidad de niños." },
  ],
  paquetes: [
    { nombre: "Esencial", para: "Fiestas en casa o salón pequeño", incluye: ["Animación infantil con sonido", "Juegos y dinámicas por edades", "Pintacaritas"], desde: null },
    { nombre: "Completo", para: "La fiesta que más nos piden", incluye: ["Todo lo del Esencial", "Visita de un personaje", "Espumanía o hora loca", "Momento especial de la torta"], desde: null, destacado: true },
    { nombre: "Premium", para: "Para no olvidar nada", incluye: ["Todo lo del Completo", "Castillo inflable o pelotas boom", "Estación creativa para los niños", "Más tiempo de animación"], desde: null },
  ],
  preguntas: [
    { pregunta: "¿Desde qué edad se puede hacer la animación?", respuesta: "Desde el primer añito. Para los más pequeños usamos dinámicas suaves y personajes amigables; a partir de los 4 años, juegos y concursos." },
    { pregunta: "¿Cuánto dura la animación?", respuesta: "Entre 2 y 3 horas según el paquete. Si la fiesta es más larga, se agrega tiempo." },
    { pregunta: "¿Pueden ir a un parque o a una piscina?", respuesta: "Sí. Tenemos animación para día de piscina y para espacios abiertos; solo necesitamos un punto de electricidad cerca." },
  ],
  seo: {
    titulo: "Animación de cumpleaños infantiles y personajes | Divertimania",
    descripcion: "Fiestas de cumpleaños con animadores, personajes, espuma y hora loca. San Cristóbal y toda Venezuela. Cotiza por WhatsApp.",
  },
};

export const BABY_SHOWER: Fiesta = {
  ocasion: "baby-shower",
  ruta: "baby-shower",
  h1: "Baby showers llenos de emoción",
  bajada: "Juegos, dinámicas y animación para celebrar la llegada del bebé con toda la familia.",
  porque: [
    { titulo: "Juegos que todos disfrutan", texto: "Dinámicas para los futuros papás, los abuelos y los invitados, sin momentos incómodos." },
    { titulo: "Un ritmo bien llevado", texto: "Un animador conduce la tarde para que nadie se aburra y la mamá pueda disfrutar." },
    { titulo: "Detalles que se notan", texto: "Estación creativa, personaje sorpresa y música elegida para el momento." },
  ],
  paquetes: [
    { nombre: "Esencial", para: "Reuniones íntimas", incluye: ["Animador con sonido", "Juegos de baby shower", "Música ambiental"], desde: null },
    { nombre: "Completo", para: "El más elegido", incluye: ["Todo lo del Esencial", "Personaje sorpresa", "Dinámicas para los futuros papás", "Más tiempo de animación"], desde: null, destacado: true },
    { nombre: "Premium", para: "Una tarde completa", incluye: ["Todo lo del Completo", "Estación creativa", "Momento especial para la revelación o el brindis"], desde: null },
  ],
  preguntas: [
    { pregunta: "¿Qué tipo de juegos hacen?", respuesta: "Juegos clásicos de baby shower adaptados a sus invitados, más dinámicas para los futuros papás. Los elegimos juntos antes de la fecha." },
    { pregunta: "¿Pueden combinarlo con la revelación del sexo?", respuesta: "Sí, lo armamos como un solo evento con un momento especial para la revelación." },
  ],
  seo: {
    titulo: "Animación para baby shower | Divertimania",
    descripcion: "Baby showers con animador, juegos, personaje sorpresa y estación creativa. San Cristóbal y toda Venezuela.",
  },
};

export const GENDER_REVEAL: Fiesta = {
  ocasion: "gender-reveal",
  ruta: "revelacion-de-genero",
  h1: "Revelación de género con un momento inolvidable",
  bajada: "Preparamos la tarde y el gran momento para que todos lo vivan con la emoción que merece.",
  porque: [
    { titulo: "El momento, bien armado", texto: "Música, cuenta regresiva y animación para que la revelación salga perfecta en fotos y video." },
    { titulo: "Antes y después", texto: "Juegos para que los invitados apuesten si es niño o niña y celebren juntos el resultado." },
    { titulo: "Sin preocupaciones", texto: "Llevamos el sonido y conducimos el evento de principio a fin." },
  ],
  paquetes: [
    { nombre: "Esencial", para: "El gran momento", incluye: ["Animador con sonido", "Juegos de apuestas: ¿niño o niña?", "Cuenta regresiva para la revelación"], desde: null },
    { nombre: "Completo", para: "El más elegido", incluye: ["Todo lo del Esencial", "Dinámicas para los futuros papás", "Personaje sorpresa"], desde: null, destacado: true },
    { nombre: "Premium", para: "Una tarde completa", incluye: ["Todo lo del Completo", "Estación creativa", "Más tiempo de animación"], desde: null },
  ],
  preguntas: [
    { pregunta: "¿Ustedes traen el elemento de la revelación?", respuesta: "Conducimos el momento y lo coordinamos con lo que ustedes elijan. Si necesitan el elemento (humo, globos, confeti), lo conversamos al cotizar." },
  ],
  seo: {
    titulo: "Animación para revelación de género | Divertimania",
    descripcion: "Gender reveal con animador, juegos de apuestas y un gran momento de revelación. San Cristóbal y toda Venezuela.",
  },
  tambienServicios: ["baby-shower"],
};

export const GRADUACION: Fiesta = {
  ocasion: "graduacion",
  ruta: "graduaciones",
  h1: "Graduaciones con fiesta de verdad",
  bajada: "Del preescolar a la universidad: animación, shows y hora loca para celebrar el logro.",
  porque: [
    { titulo: "Para cada etapa", texto: "Personajes y juegos para los más pequeños; shows y hora loca para bachilleres y universitarios." },
    { titulo: "Grupos grandes", texto: "Sabemos animar promociones completas y mantener la energía de todos." },
    { titulo: "Coordinamos con el colegio", texto: "Nos adaptamos al horario y al espacio del acto o de la fiesta." },
  ],
  paquetes: [
    { nombre: "Esencial", para: "Preescolar y primaria", incluye: ["Animación con sonido", "Personaje invitado", "Juegos para el grupo"], desde: null },
    { nombre: "Completo", para: "El más elegido", incluye: ["Todo lo del Esencial", "Espumanía o hora loca", "Más tiempo de animación"], desde: null, destacado: true },
    { nombre: "Fiesta de promoción", para: "Bachilleres y universitarios", incluye: ["Show según temática", "Bolas disco o show LED", "Hora loca"], desde: null },
  ],
  preguntas: [
    { pregunta: "¿Trabajan con colegios?", respuesta: "Sí. Coordinamos con la directiva o la comisión de padres el horario, el espacio y lo que se puede hacer en el lugar." },
  ],
  seo: {
    titulo: "Animación para graduaciones | Divertimania",
    descripcion: "Graduaciones de preescolar, primaria, bachillerato y universidad con animación, shows y hora loca. Toda Venezuela.",
  },
};

export const NAVIDAD: Fiesta = {
  ocasion: "navidad",
  ruta: "navidad",
  h1: "Navidad con magia para los niños",
  bajada: "Personajes navideños, animación y shows para fiestas de familia, colegios y empresas.",
  porque: [
    { titulo: "Personajes de temporada", texto: "Mickey, Minnie y amigos con vestuario navideño para fotos y entrega de regalos." },
    { titulo: "Para empresas y colegios", texto: "Animamos la fiesta de los hijos de los trabajadores o el cierre del año escolar." },
    { titulo: "Fechas que vuelan", texto: "Diciembre se llena rápido: apartar con tiempo asegura tu fecha." },
  ],
  paquetes: [
    { nombre: "Esencial", para: "Fiestas en familia", incluye: ["Animación navideña con sonido", "Juegos y villancicos"], desde: null },
    { nombre: "Completo", para: "El más elegido", incluye: ["Todo lo del Esencial", "Visita de personajes navideños", "Momento de entrega de regalos"], desde: null, destacado: true },
    { nombre: "Empresas", para: "Fiesta de los hijos de los trabajadores", incluye: ["Animación para grupos grandes", "Personajes navideños", "Show según temática"], desde: null },
  ],
  preguntas: [
    { pregunta: "¿Con cuánto tiempo hay que reservar en diciembre?", respuesta: "Lo antes posible: en diciembre las fechas se llenan semanas antes. Aparta con el anticipo para asegurar la tuya." },
  ],
  seo: {
    titulo: "Animación y personajes navideños | Divertimania",
    descripcion: "Fiestas de Navidad con personajes, animación y entrega de regalos para familias, colegios y empresas. Toda Venezuela.",
  },
};
