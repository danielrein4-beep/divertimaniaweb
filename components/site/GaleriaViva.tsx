import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DriftWall from "@/components/site/DriftWall";
import { ITEMS_GALERIA } from "@/lib/galeria";

/** Muro de fotos en movimiento de la Galería, en versión corta para el Inicio. */
export default function GaleriaViva() {
  return (
    <section className="relative overflow-hidden border-y border-border">
      <div className="relative h-[560px] w-full sm:h-[620px]">
        <DriftWall
          items={ITEMS_GALERIA}
          columns={5}
          tileWidth={230}
          tileHeight={160}
          gap={20}
          tilt={14}
          turn={-12}
          perspective={1200}
          depth={100}
          speed={30}
          direction="up"
          variance={0.4}
          parallax={0.6}
          lift={60}
          fade={0.2}
          dim={0.45}
          overlayColor="#0b0b0b"
          radius={16}
          roll={0}
          pauseOnHover={false}
          grayscale={false}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,11,11,0.75)_0%,rgba(11,11,11,0.2)_65%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5 px-4 text-center">
        <h2 className="ig-caption max-w-2xl text-4xl leading-[1.05] sm:text-6xl">
          Así se viven nuestras fiestas
        </h2>
        <p className="max-w-md text-base text-white/85 drop-shadow">
          Fotos reales de cumpleaños, baby showers, 15 años y eventos en todo el Táchira.
        </p>
        <div className="pointer-events-auto flex flex-wrap justify-center gap-3">
          <Link
            href="/catalogo"
            className="touch-target group gap-2 rounded-full bg-neon-green px-7 text-base font-bold text-background transition-transform hover:scale-[1.03]"
          >
            Ver catálogo
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
          <Link
            href="/galeria"
            className="touch-target rounded-full border border-white/25 bg-black/50 px-7 text-base font-semibold backdrop-blur-sm transition-colors hover:border-neon-green hover:text-neon-green"
          >
            Ver galería
          </Link>
        </div>
      </div>
    </section>
  );
}
