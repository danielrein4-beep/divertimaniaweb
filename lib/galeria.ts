// Fotos del muro de la galería (DriftWall). Se usan en /galeria y en el Inicio.
export const FOTOS = [
  { label: "Animación Infantil", src: "/images/animacion-infantil-conejos.png" },
  { label: "Día de Piscina Infantil", src: "/images/dia-piscina-espuma.png" },
  { label: "Súper Mario", src: "/images/fiestas-infantiles-mario.jpg" },
  { label: "Frozen", src: "/images/frozen-olaf-elsa.jpg" },
  { label: "Casa de Mickey Mouse", src: "/images/mickey-racer.jpg" },
  { label: "Superhéroes", src: "/images/superheroes.jpg" },
  { label: "Bolas Disco", src: "/images/bolas-disco-duo.jpg" },
  { label: "Bolas Disco", src: "/images/bolas-disco-equipo.jpg" },
  { label: "Princesas - Rapunzel", src: "/images/princesa-rapunzel.jpg" },
  { label: "Rapunzel y Amigos", src: "/images/rapunzel-cumpleanos.png" },
  { label: "La Bella y la Bestia", src: "/images/bella-y-bestia.png" },
  { label: "Show de Plim Plim", src: "/images/plim-plim-animacion.png" },
  { label: "Pascua y Conejos", src: "/images/pascua-conejos-recreacion.png" },
  { label: "Navidad con Mickey", src: "/images/mickey-navidad-show.png" },
  { label: "Casa de Mickey Mouse", src: "/images/minnie.jpg" },
  { label: "Casa de Mickey Mouse", src: "/images/mickey-minnie-graduacion.jpg" },
  { label: "Show según temática", src: "/images/show-tematico-catrina.jpg" },
  { label: "Show según temática", src: "/images/show-tematico-kpop.jpg" },
  { label: "Show según temática", src: "/images/show-led-hoop.jpg" },
  { label: "Espumanía", src: "/images/espumania-foam.png" },
  { label: "Baby Shower", src: "/images/baby-shower.png" },
  { label: "Estación Creativa", src: "/images/diverti-artistas.png" },
  { label: "Atracciones", src: "/images/pelotas-boom-rooftop.png" },
  { label: "Atracciones", src: "/images/pelotas-boom-piscina.png" },
];

export const ITEMS_GALERIA = FOTOS.map((foto) => ({ image: foto.src, title: foto.label }));
