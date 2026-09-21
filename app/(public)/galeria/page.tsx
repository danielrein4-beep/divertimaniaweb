import DriftWall from "@/components/site/DriftWall";

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

const ITEMS = FOTOS.map((foto) => ({
  image: foto.src,
  title: foto.label,
}));

export default function GaleriaPage() {
  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full overflow-hidden">
      {/* Header sutil sobre el fondo de la galería */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col items-center justify-center bg-gradient-to-b from-background via-background/85 to-transparent px-4 pt-10 pb-16 text-center">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Galería</h1>
        <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
          Un vistazo al ambiente y la energía que creamos en cada evento.
        </p>
      </div>

      {/* Muro 3D DriftWall a pantalla completa */}
      <div className="relative h-[calc(100vh-73px)] min-h-[700px] w-full">
        <DriftWall
          items={ITEMS}
          columns={6}
          tileWidth={240}
          tileHeight={158}
          gap={20}
          tilt={14}
          turn={-12}
          perspective={1200}
          depth={100}
          speed={36}
          direction="up"
          variance={0.4}
          parallax={0.7}
          lift={70}
          fade={0.2}
          dim={0.3}
          overlayColor="#0a0a0f"
          radius={16}
          roll={0}
          pauseOnHover={false}
          grayscale={false}
        />
      </div>

      {/* Difuminado inferior sutil que conecta con el footer */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
