import Image from "next/image";
import PlaceholderImage from "@/components/site/PlaceholderImage";
import { getImageAspect } from "@/lib/imageAspect";

const FOTOS = [
  { label: "Animación Infantil", src: "/images/animacion-infantil-conejos.png" },
  { label: "Día de Piscina Infantil", src: "/images/dia-piscina-espuma.png" },
  { label: "Súper Mario", src: "/images/fiestas-infantiles-mario.jpg" },
  { label: "Frozen", src: "/images/frozen-olaf-elsa.jpg" },
  { label: "Casa de Mickey Mouse", src: "/images/mickey-racer.jpg" },
  { label: "Superhéroes", src: "/images/superheroes.jpg" },
  { label: "Bolas Disco", src: "/images/bolas-disco-duo.jpg" },
  { label: "Bolas Disco", src: "/images/bolas-disco-equipo.jpg" },
  { label: "Princesas", src: "/images/princesa-rapunzel.jpg" },
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

const PLACEHOLDERS = ["Toy Story", "Encanto", "Paw Patrol", "El Chacal de la Trompeta"];

export default function GaleriaPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Galería</h1>
        <p className="mt-2 text-muted">Un vistazo al ambiente que creamos en cada evento.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {FOTOS.map((foto) => (
          <div
            key={foto.src}
            className="relative w-full overflow-hidden rounded-2xl border border-border bg-background-elevated"
            style={{ aspectRatio: getImageAspect(foto.src) }}
          >
            <Image
              src={foto.src}
              alt={foto.label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-3 text-xs font-medium text-white">
              {foto.label}
            </span>
          </div>
        ))}
        {PLACEHOLDERS.map((label, i) => (
          <PlaceholderImage key={label + i} label={label} className="aspect-square w-full" />
        ))}
      </div>
    </div>
  );
}
