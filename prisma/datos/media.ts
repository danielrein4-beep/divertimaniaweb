// Fotos y videos extra de cada servicio (galería de la ficha), por nombre de servicio.

const galeria = (servicioNombre: string, fotos: string[], desde = 10) =>
  fotos.map((f, i) => ({ servicioNombre, url: `/images/${f}.jpg`, tipo: "FOTO" as const, orden: desde + i }));

export const mediaList: Array<{
  servicioNombre: string;
  url: string;
  tipo: "FOTO" | "VIDEO";
  poster?: string;
  orden: number;
}> = [
  // Galería Casa de Mickey Mouse
  { servicioNombre: "Casa de Mickey Mouse", url: "/images/minnie.jpg", tipo: "FOTO", orden: 0 },
  { servicioNombre: "Casa de Mickey Mouse", url: "/images/mickey-minnie-graduacion.jpg", tipo: "FOTO", orden: 1 },
  { servicioNombre: "Casa de Mickey Mouse", url: "/images/mickey-navidad-show.png", tipo: "FOTO", orden: 2 },
  // Video Reels Casa de Mickey Mouse
  { servicioNombre: "Casa de Mickey Mouse", url: "/reels/reel-2.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-2-poster.jpg", orden: 3 },
  { servicioNombre: "Casa de Mickey Mouse", url: "/reels/reel-4.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-4-poster.jpg", orden: 4 },
  { servicioNombre: "Casa de Mickey Mouse", url: "/reels/reel-5.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-5-poster.jpg", orden: 5 },

  // Galería Princesas Disney
  { servicioNombre: "Princesas Disney", url: "/images/bella-y-bestia.png", tipo: "FOTO", orden: 0 },
  { servicioNombre: "Princesas Disney", url: "/images/princesa-rapunzel.jpg", tipo: "FOTO", orden: 1 },
  { servicioNombre: "Princesas Disney", url: "/images/rapunzel-cumpleanos.png", tipo: "FOTO", orden: 2 },

  // Galería Pelotas Boom
  { servicioNombre: "Pelotas Boom", url: "/images/pelotas-boom-piscina.png", tipo: "FOTO", orden: 0 },

  // Galería Show según temática
  { servicioNombre: "Show según temática", url: "/images/show-tematico-catrina.jpg", tipo: "FOTO", orden: 0 },
  // Reels Show según temática
  { servicioNombre: "Show según temática", url: "/reels/reel-3.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-3-poster.jpg", orden: 1 },
  { servicioNombre: "Show según temática", url: "/reels/reel-7.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-7-poster.jpg", orden: 2 },

  // Galería Bolas Disco
  { servicioNombre: "Bolas Disco", url: "/images/bolas-disco-equipo.jpg", tipo: "FOTO", orden: 0 },

  // Video Reels Show LED
  { servicioNombre: "Show LED", url: "/reels/reel-8.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-8-poster.jpg", orden: 0 },
  { servicioNombre: "Show LED", url: "/reels/reel-11.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-11-poster.jpg", orden: 1 },

  // Video Reel El Chacal de la Trompeta
  { servicioNombre: "El Chacal de la Trompeta", url: "/reels/reel-1.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-1-poster.jpg", orden: 0 },

  // Video Reel Baby Shower
  { servicioNombre: "Baby Shower o Revelación de Género", url: "/reels/reel-6.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-6-poster.jpg", orden: 0 },

  // Video Reel Día de Piscina Infantil
  { servicioNombre: "Día de Piscina Infantil", url: "/reels/reel-9.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-9-poster.jpg", orden: 0 },

  // Video Reel Espumanía
  { servicioNombre: "Espumanía", url: "/reels/reel-10.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-10-poster.jpg", orden: 0 },

  // Video Reel Carritos de Comida / Diverti Candy
  { servicioNombre: "Carritos de Comida", url: "/reels/reel-12.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-12-poster.jpg", orden: 0 },

  // Fotos de eventos reales (WhatsApp, octubre 2026)
  ...galeria("Casa de Mickey Mouse", ["mickey-amigos", "mickey-minnie", "minnie-evento", "mickey-minnie-cumple", "pluto-evento"]),
  ...galeria("Princesas Disney", ["bella-bestia-evento", "sirenita-ursula-sebastian", "aladdin-genio-jazmin", "moana", "frozen-olaf-elsa-2", "rapunzel-salon", "villanos-disney"]),
  ...galeria("Superhéroes", ["superheroes-equipo", "spiderman", "mujer-maravilla", "capitan-america"]),
  ...galeria("Show de Paw Patrol", ["paw-patrol-equipo", "paw-patrol-marshall", "paw-patrol-rubble"]),
  ...galeria("Show Granja de Zenón", ["granja-zenon-leon"]),
  ...galeria("Súper Mario", ["princesa-peach"]),
  ...galeria("Plim Plim", ["plim-plim-evento"]),
  ...galeria("Show según temática", ["show-tematico-robots", "show-tematico-retro", "show-tematico-casa-papel", "show-tematico-terror", "show-tematico-neon"]),
  ...galeria("Show LED", ["show-led-astronautas", "show-led-bailarina"]),
  ...galeria("Casa de Mickey Mouse", ["mickey-hechicero"], 20),
  ...galeria("Princesas Disney", ["cenicienta", "rapunzel-cumpleanera", "rapunzel-flynn", "rapunzel-flynn-gothel"], 20),
  ...galeria("Show según temática", ["show-tematico-bailarinas", "show-tematico-piano", "show-tematico-retro-rojo", "show-tematico-magos"], 20),
  ...galeria("Show LED", ["show-led-pareja", "show-led-astronautas-2"], 20),
  { servicioNombre: "Show según temática", url: "/reels/reel-13.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-13-poster.jpg", orden: 30 },
  { servicioNombre: "Show LED", url: "/reels/reel-14.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-14-poster.jpg", orden: 30 },
  { servicioNombre: "Carritos de Comida", url: "/reels/reel-15.mp4", tipo: "VIDEO", poster: "/reels/posters/reel-15-poster.jpg", orden: 30 },
];
