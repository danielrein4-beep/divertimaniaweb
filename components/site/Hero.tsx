"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import IntroMontage, { posterDeReel } from "@/components/site/IntroMontage";
import MaskedHeading from "@/components/site/MaskedHeading";
import { useMiFiesta } from "@/context/MiFiestaContext";
import { INSTAGRAM_URL, PERFIL_IG } from "@/lib/site";

// Clips cortos (6 s, sin audio) generados por scripts/comprimir-videos.mjs.
const REELS_INTRO = Array.from({ length: 12 }, (_, i) => `/reels/intro/reel-${i + 1}.mp4`);
// Fondo vivo del hero: 6 clips variados (espuma, Mickey, neón, LED, baby shower, piscina).
const REELS_FONDO = [10, 5, 8, 11, 6, 9].map((n) => `/reels/intro/reel-${n}.mp4`);

const INTRO_KEY = "divertimania_intro_vista";
const noSuscribir = () => () => {};

/** La intro de reels se ve una vez por sesión; en el servidor se asume vista para no tapar el contenido. */
function useIntroVista() {
  return useSyncExternalStore(
    noSuscribir,
    () => {
      try {
        return sessionStorage.getItem(INTRO_KEY) === "1";
      } catch {
        return true;
      }
    },
    () => true
  );
}

export type NovedadHero = { id: string; titulo: string; badge: string; ctaUrl: string | null };

export default function Hero({ novedad, categorias }: { novedad: NovedadHero | null; categorias: string[] }) {
  const introVista = useIntroVista();
  const [introTerminada, setIntroTerminada] = useState(false);
  const mostrarIntro = !introVista && !introTerminada;
  const { items, openPanel } = useMiFiesta();

  const terminarIntro = () => {
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // sin almacenamiento: la intro simplemente se vuelve a ver la próxima vez
    }
    setIntroTerminada(true);
  };

  return (
    <section className="relative isolate overflow-hidden">
      {mostrarIntro && <IntroMontage videos={REELS_INTRO} maxRows={3} durationMs={3000} fadeMs={900} onComplete={terminarIntro} />}

      {/* El mosaico de la intro se queda vivo de fondo, atenuado */}
      <div aria-hidden className="absolute inset-0 -z-10 grid grid-cols-3 grid-rows-2 sm:grid-cols-6 sm:grid-rows-1">
        {REELS_FONDO.map((src) => (
          <video
            key={src}
            src={src}
            poster={posterDeReel(src)}
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover opacity-30"
          />
        ))}
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(11,11,11,0.55)_0%,rgba(11,11,11,0.92)_70%)]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="mx-auto flex min-h-[86svh] max-w-6xl flex-col items-center justify-center gap-6 px-4 py-14 text-center sm:px-6">
        {novedad && (
          <Link
            href={novedad.ctaUrl || "/catalogo"}
            className="group inline-flex items-center gap-2 rounded-full border border-neon-green/40 bg-black/50 py-1.5 pl-1.5 pr-4 text-sm backdrop-blur-sm transition-colors hover:border-neon-green"
          >
            <span className="rounded-full bg-neon-green px-2.5 py-0.5 text-xs font-bold text-background">
              {novedad.badge}
            </span>
            <span className="font-semibold">{novedad.titulo}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        )}

        <MaskedHeading
          key={mostrarIntro ? "espera" : "listo"}
          text="DIVIERTE TUS FIESTAS"
          tag="h1"
          mediaType="video"
          src="/hero.mp4"
          poster="/hero-poster.jpg"
          fillScale={1.25}
          parallax={26}
          reveal="rise"
          trigger="load"
          drift={18}
          brightness={1.05}
          saturation={1.1}
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

        <p className="max-w-xl text-lg text-foreground/85">
          Animación, shows, personajes y hora loca para cumpleaños, baby showers, 15 años, bodas y empresas en todo el
          Táchira.
        </p>

        <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/catalogo"
            className="touch-target group w-full gap-2 rounded-full bg-neon-green px-8 text-base font-bold text-background shadow-[0_0_30px_rgba(168,255,48,0.35)] transition-transform hover:scale-[1.03] sm:w-auto"
          >
            Ver catálogo
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
          <button
            type="button"
            onClick={() => openPanel(items.length > 0 ? 1 : 2)}
            className="touch-target w-full rounded-full border border-white/25 bg-black/40 px-8 text-base font-semibold backdrop-blur-sm transition-colors hover:border-neon-green hover:text-neon-green sm:w-auto"
          >
            Pedir cotización
          </button>
        </div>

        {/* Accesos directos a cada sección del catálogo */}
        <nav aria-label="Ir directo al catálogo" className="w-full max-w-3xl">
          <ul className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
            {categorias.map((c) => (
              <li key={c} className="shrink-0">
                <Link
                  href={`/catalogo?categoria=${encodeURIComponent(c)}`}
                  className="inline-flex h-10 items-center rounded-full border border-white/15 bg-white/[0.06] px-4 text-sm font-medium text-foreground/90 backdrop-blur-sm transition-colors hover:border-neon-green/70 hover:text-neon-green"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
        >
          <Sparkles className="h-4 w-4 text-neon-green" aria-hidden />
          {PERFIL_IG.seguidores} personas nos siguen en Instagram
        </a>
      </div>
    </section>
  );
}
