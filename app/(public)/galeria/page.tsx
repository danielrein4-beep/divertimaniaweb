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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Galería</h1>
        <p className="mt-2 text-muted">Un vistazo al ambiente y la energía que creamos en cada evento.</p>
      </div>

      <div className="relative h-[650px] w-full overflow-hidden rounded-3xl border border-border bg-background-elevated">
        <DriftWall
          items={ITEMS}
          columns={5}
          tileWidth={220}
          tileHeight={145}
          gap={18}
          tilt={16}
          turn={-14}
          perspective={1200}
          depth={120}
          speed={38}
          direction="up"
          variance={0.45}
          parallax={0.6}
          lift={64}
          fade={0.6}
          dim={0.4}
          overlayColor="#0a0a0f"
          radius={14}
          roll={0}
          pauseOnHover={false}
          grayscale={false}
        />
      </div>
    </div>
  );
}
