"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import MaskedHeading from "@/components/site/MaskedHeading";
import { useMiFiesta } from "@/context/MiFiestaContext";
import { INSTAGRAM_URL, PERFIL_IG } from "@/lib/site";
import { useConexionLigera } from "@/lib/useConexionLigera";
import type { NovedadHero } from "@/lib/novedades";

// Dentro de las letras: mezcla de 8 s con los tramos más vivos (neón, aros LED, Minnie, Candy y escenario) teñidos con los colores de la marca,
// 743 KB, sin audio. Con conexión lenta o ahorro de datos queda su primer cuadro como imagen fija.
const VIDEO_TITULO = "/videos/titulo-portada-neon.mp4";
const POSTER_TITULO = "/videos/titulo-portada-neon.jpg";

// Divertimanía se ve 3 segundos; después entra la novedad de la temporada (si hay una vigente) con sus fotos pasando con fundido.
const SEGUNDOS_DIVERTIMANIA = 3;
const SEGUNDOS_NOVEDAD = 10;
const SEGUNDOS_POR_FOTO = 2.8;

/** Novedad de temporada: fotos a pantalla completa que se funden una con otra, título grande y botón. */
function SlideNovedad({ novedad, visible }: { novedad: NovedadHero; visible: boolean }) {
  const fotos = novedad.fotos;
  const [foto, setFoto] = useState(0);

  useEffect(() => {
    if (!visible) return;
    setFoto(0);
    if (fotos.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setFoto((f) => (f + 1) % fotos.length), SEGUNDOS_POR_FOTO * 1000);
    return () => window.clearInterval(id);
  }, [visible, fotos.length]);

  const palabras = novedad.titulo.split(" ");
  const ultima = palabras.pop();

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`absolute inset-0 z-10 transition-opacity duration-1000 motion-reduce:transition-none ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      {fotos.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-[1400ms] motion-reduce:transition-none ${i === foto ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/15 lg:bg-gradient-to-r lg:from-background lg:via-background/70 lg:to-background/10" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-24 pt-24 sm:px-6 lg:justify-center lg:pb-16">
        <div className="flex max-w-4xl flex-col items-start gap-4">
          <span className="rounded-full bg-neon-green px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-background">
            {novedad.badge}
          </span>
          <h2 className="font-display text-[clamp(2.4rem,9.5vw,6.6rem)] font-extrabold uppercase leading-[0.92] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
            {palabras.join(" ")} <span className="text-neon-green">{ultima}</span>
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-foreground/90 sm:text-lg">{novedad.descripcion}</p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href={novedad.ctaUrl || "/catalogo"}
              className="touch-target group w-full gap-2 rounded-full bg-neon-green px-8 text-base font-bold text-background shadow-[0_0_30px_rgba(168,255,48,0.4)] transition-transform hover:scale-[1.03] sm:w-auto"
            >
              {novedad.ctaTexto}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            {(novedad.ctaUrl || "/catalogo") !== "/catalogo" && (
              <Link
                href="/catalogo"
                className="touch-target w-full rounded-full border border-white/30 bg-black/40 px-8 text-base font-semibold backdrop-blur-sm transition-colors hover:border-neon-green hover:text-neon-green sm:w-auto"
              >
                Ver catálogo
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero({ novedades, categorias }: { novedades: NovedadHero[]; categorias: string[] }) {
  const { items, openPanel } = useMiFiesta();
  const ligera = useConexionLigera();
  // Diapositiva 0 = Divertimanía; las siguientes son las novedades de temporada (o «lo más buscado»), una tras otra.
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const total = novedades.length + 1;

  // /?diapositiva=1 abre directo esa novedad y la deja fija (para revisarla o compartir el enlace).
  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get("diapositiva"));
    if (Number.isInteger(n) && n > 0 && n < total) {
      setActual(n);
      setPausado(true);
    }
  }, [total]);

  useEffect(() => {
    if (total < 2 || pausado) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const segundos = actual === 0 ? SEGUNDOS_DIVERTIMANIA : SEGUNDOS_NOVEDAD;
    const id = window.setTimeout(() => setActual((a) => (a + 1) % total), segundos * 1000);
    return () => window.clearTimeout(id);
  }, [actual, pausado, total]);

  return (
    <section className="relative isolate overflow-hidden">
      {/* Fondo limpio: negro de la marca con resplandores lima y magenta, para que el título sea lo que brille */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_18%_8%,rgba(168,255,48,0.16),transparent_70%),radial-gradient(ellipse_55%_50%_at_85%_14%,rgba(255,79,216,0.16),transparent_70%),radial-gradient(ellipse_70%_45%_at_50%_72%,rgba(0,229,255,0.07),transparent_70%)]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6" onFocusCapture={() => setPausado(true)} onBlurCapture={() => setPausado(false)}>
        <div>
          {/* Diapositiva 0: Divertimanía */}
          <div
            aria-hidden={actual !== 0}
            inert={actual !== 0}
            className={`flex min-h-[80svh] flex-col items-center justify-center gap-6 py-10 text-center transition-opacity duration-1000 motion-reduce:transition-none ${actual === 0 ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
        <MaskedHeading
          text="DIVIERTE TUS FIESTAS"
          tag="h1"
          mediaType={ligera ? "image" : "video"}
          src={ligera ? POSTER_TITULO : VIDEO_TITULO}
          poster={POSTER_TITULO}
          fillScale={1.25}
          parallax={26}
          reveal="rise"
          trigger="load"
          drift={18}
          brightness={1.12}
          saturation={1.3}
          grayscale={false}
          duration={1.1}
          stagger={0.09}
          align="center"
          weight={800}
          tracking={-0.045}
          lineHeight={1.02}
          textScale={0.185}
          className="font-display max-w-6xl drop-shadow-[0_0_26px_rgba(168,255,48,0.3)]"
        />

        <p className="max-w-xl text-lg text-foreground/85">
          Animación, shows, personajes y hora loca para cumpleaños, baby showers, 15 años, bodas y empresas en toda
          Venezuela.
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

        </div>

        {total > 1 && (
          <nav aria-label="Novedades de la portada" className="absolute inset-x-0 bottom-6 z-20 mx-auto flex max-w-6xl gap-3 px-4 sm:px-6">
            {["Divertimanía", ...novedades.map((n) => n.badge)].map((etiqueta, i) => (
              <button
                key={etiqueta + i}
                type="button"
                aria-current={actual === i}
                onClick={() => setActual(i)}
                className={`group flex-1 text-left text-[11px] font-extrabold uppercase tracking-[0.14em] transition-colors sm:text-xs ${
                  actual === i ? "text-neon-green" : "text-white/55 hover:text-white"
                }`}
              >
                <span className="mb-2 block h-[5px] overflow-hidden rounded-full bg-white/25">
                  {actual === i && (
                    <span
                      key={`${actual}-${pausado}`}
                      className="block h-full origin-left rounded-full bg-neon-green"
                      style={pausado ? { transform: "scaleX(1)" } : { animation: `barra-hero ${actual === 0 ? SEGUNDOS_DIVERTIMANIA : SEGUNDOS_NOVEDAD}s linear forwards` }}
                    />
                  )}
                </span>
                {etiqueta}
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Novedades de temporada: cubren toda la portada */}
      {novedades.map((n, i) => (
        <SlideNovedad key={n.id} novedad={n} visible={actual === i + 1} />
      ))}
    </section>
  );
}
