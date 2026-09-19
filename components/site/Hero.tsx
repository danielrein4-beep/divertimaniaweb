"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import IntroMontage from "@/components/site/IntroMontage";
import MaskedHeading from "@/components/site/MaskedHeading";
import { WHATSAPP_LINK } from "@/lib/site";

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

export default function Hero() {
  const [phase, setPhase] = useState<"intro" | "reveal">(REEL_VIDEOS.length > 0 ? "intro" : "reveal");

  useEffect(() => {
    if (phase !== "reveal") return;
    const timer = setTimeout(() => setPhase("intro"), REVEAL_DURATION_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <section className="relative mx-auto flex min-h-[90vh] max-w-6xl flex-col items-center justify-start gap-6 overflow-hidden px-4 pt-10 pb-8 text-center sm:px-6 sm:pt-14">
      {phase === "intro" && (
        <IntroMontage videos={REEL_VIDEOS} maxRows={3} durationMs={4000} fadeMs={900} onComplete={() => setPhase("reveal")} />
      )}

      <div
        className={`flex flex-col items-center gap-6 transition-opacity duration-700 ${
          phase === "reveal" ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="rounded-full border border-neon-green/40 bg-neon-green/10 px-4 py-1 text-sm font-medium text-neon-green">
          +15 mil personas nos siguen en Instagram
        </span>

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

        <p className="max-w-xl text-lg text-muted">
          Animación, shows y personajes para bodas, 15 años, corporativos y fiestas infantiles
          en el Estado Táchira.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/catalogo"
            className="rounded-full bg-neon-green px-6 py-3 font-semibold text-background transition-transform hover:scale-105"
          >
            Ver catálogo
          </Link>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border px-6 py-3 font-semibold text-foreground transition-colors hover:border-neon-green hover:text-neon-green"
          >
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
