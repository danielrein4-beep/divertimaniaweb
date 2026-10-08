"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import IntroMontage from "@/components/site/IntroMontage";
import MaskedHeading from "@/components/site/MaskedHeading";
import NovedadesPanel, { type NovedadDTO } from "@/components/site/NovedadesPanel";
import Button from "@/components/ui/Button";
import { useMiFiesta } from "@/context/MiFiestaContext";

const REEL_VIDEOS: string[] = [
  "/reels/reel-1.mp4",
  "/reels/reel-2.mp4",
  "/reels/reel-3.mp4",
  "/reels/reel-4.mp4",
  "/reels/reel-5.mp4",
  "/reels/reel-6.mp4",
  "/reels/reel-7.mp4",
  "/reels/reel-8.mp4",
  "/reels/reel-9.mp4",
  "/reels/reel-10.mp4",
  "/reels/reel-11.mp4",
  "/reels/reel-12.mp4",
];

const REVEAL_DURATION_MS = 50000;

type Phase = "intro" | "novedades" | "reveal";

export default function Hero({ novedades = [] }: { novedades?: NovedadDTO[] }) {
  const [phase, setPhase] = useState<Phase>(REEL_VIDEOS.length > 0 ? "intro" : "reveal");
  const novedad = novedades[0];
  const { openSheet } = useMiFiesta();

  useEffect(() => {
    if (phase !== "reveal") return;
    const timer = setTimeout(() => setPhase("intro"), REVEAL_DURATION_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <section className="relative mx-auto flex min-h-[90vh] max-w-6xl flex-col items-center justify-between overflow-hidden px-4 pt-8 pb-10 text-center sm:px-6 sm:pt-12">
      {phase === "intro" && (
        <IntroMontage
          videos={REEL_VIDEOS}
          maxRows={3}
          durationMs={4000}
          fadeMs={900}
          onComplete={() => setPhase(novedad ? "novedades" : "reveal")}
        />
      )}

      {phase === "novedades" && novedad && (
        <NovedadesPanel novedad={novedad} durationMs={5500} fadeMs={700} onComplete={() => setPhase("reveal")} />
      )}

      <div
        className={`flex w-full flex-col items-center gap-6 transition-opacity duration-700 ${
          phase === "reveal" ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Franja de confianza */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-neon-green/30 bg-neon-green/10 px-4 py-1.5 text-xs font-semibold text-neon-green sm:text-sm">
          <span>+15 mil seguidores</span>
          <span className="opacity-40">·</span>
          <span>Todo el Estado Táchira</span>
          <span className="opacity-40">·</span>
          <span>Shows 100% en vivo</span>
        </div>

        {phase === "reveal" && (
          <MaskedHeading
            text="DIVIERTE TUS FIESTAS"
            tag="h1"
            mediaType="video"
            src="/hero.mp4"
            fillScale={1.25}
            parallax={26}
            reveal="rise"
            trigger="load"
            drift={18}
            brightness={1}
            saturation={1}
            grayscale={false}
            duration={1.1}
            stagger={0.09}
            align="center"
            weight={800}
            tracking={-0.045}
            lineHeight={1.02}
            textScale={0.185}
            className="font-display max-w-6xl"
          />
        )}

        <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Arma tu fiesta en 2 minutos: elige personajes, shows y dinámicas para bodas, 15 años, baby showers,
          cumpleaños infantiles y eventos corporativos en San Cristóbal y todo el Táchira.
        </p>

        {/* Botones de acción */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <a href="#que-celebras">
            <Button variant="primary" size="lg" className="shadow-lg shadow-neon-green/20">
              Arma tu fiesta
            </Button>
          </a>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => openSheet(1)}
            className="border-border hover:border-neon-green/60"
          >
            Pedir cotización
          </Button>
          <Link href="/catalogo">
            <Button variant="ghost" size="lg">
              Ver catálogo completo →
            </Button>
          </Link>
        </div>
      </div>

      {/* Indicador sutil de scroll hacia abajo */}
      <a
        href="#que-celebras"
        className={`mt-10 flex flex-col items-center gap-1.5 text-xs text-muted/60 transition-all duration-300 hover:text-neon-green ${
          phase === "reveal" ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Desplazarse hacia abajo"
      >
        <span>Explora opciones</span>
        <span className="animate-bounce text-sm">↓</span>
      </a>
    </section>
  );
}
