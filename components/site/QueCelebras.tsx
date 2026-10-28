"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMiFiesta } from "@/context/MiFiestaContext";
import SectionHeader from "@/components/ui/SectionHeader";
import { OCASIONES } from "@/lib/ocasiones";

/** Escritorio: se reproduce al pasar el mouse. Celulares (sin hover): en bucle mientras la tarjeta se ve. */
function VideoOcasion({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    const card = video?.parentElement;
    if (!video || !card) return;
    const play = () => void video.play().catch(() => {});
    const stop = () => {
      video.pause();
      video.currentTime = 0;
    };

    if (window.matchMedia("(hover: none)").matches) {
      const mostrar = () => video.classList.replace("opacity-0", "opacity-100");
      video.addEventListener("playing", mostrar, { once: true });
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : video.pause()), { threshold: 0.6 });
      io.observe(card);
      return () => io.disconnect();
    }

    card.addEventListener("pointerenter", play);
    card.addEventListener("pointerleave", stop);
    card.addEventListener("focus", play);
    card.addEventListener("blur", stop);
    return () => {
      card.removeEventListener("pointerenter", play);
      card.removeEventListener("pointerleave", stop);
      card.removeEventListener("focus", play);
      card.removeEventListener("blur", stop);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
    />
  );
}

export default function QueCelebras() {
  const { updateFormData } = useMiFiesta();
  const fila = useRef<HTMLDivElement>(null);

  // Mouse: arrastrar la fila para moverla. Celulares: el dedo ya desliza de forma nativa.
  useEffect(() => {
    const el = fila.current;
    if (!el) return;
    let abajo = false;
    let movido = false;
    let inicioX = 0;
    let inicioScroll = 0;

    const bajar = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      abajo = true;
      movido = false;
      inicioX = e.clientX;
      inicioScroll = el.scrollLeft;
    };
    const mover = (e: PointerEvent) => {
      if (!abajo) return;
      const dx = e.clientX - inicioX;
      if (Math.abs(dx) > 5) movido = true;
      if (movido) el.scrollLeft = inicioScroll - dx;
    };
    const soltar = () => {
      abajo = false;
    };
    const frenarClic = (e: MouseEvent) => {
      if (!movido) return;
      e.preventDefault();
      e.stopPropagation();
      movido = false;
    };
    const frenarArrastreNativo = (e: Event) => e.preventDefault();

    el.addEventListener("pointerdown", bajar);
    window.addEventListener("pointermove", mover);
    window.addEventListener("pointerup", soltar);
    el.addEventListener("click", frenarClic, true);
    el.addEventListener("dragstart", frenarArrastreNativo);
    return () => {
      el.removeEventListener("pointerdown", bajar);
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", soltar);
      el.removeEventListener("click", frenarClic, true);
      el.removeEventListener("dragstart", frenarArrastreNativo);
    };
  }, []);

  const desplazar = (sentido: 1 | -1) => {
    const el = fila.current;
    if (el) el.scrollBy({ left: sentido * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-6xl py-14 sm:py-20">
      <SectionHeader
        title="¿Qué celebras?"
        underlineWord="celebras"
        subtitle="Elige la ocasión y te mostramos lo que mejor funciona para ese tipo de fiesta."
        tilt="left"
        className="mb-8 px-4 sm:px-6"
      />

      <div className="relative">
        <div
          ref={fila}
          className="scrollbar-none flex cursor-grab gap-3 overflow-x-auto px-4 py-3 sm:gap-4 sm:px-6 pointer-coarse:snap-x pointer-coarse:snap-mandatory"
        >
          {OCASIONES.map((ocasion, i) => (
            <Link
              key={ocasion.slug}
              href={`/catalogo?ocasion=${ocasion.slug}`}
              onClick={() => updateFormData({ tipoEvento: ocasion.tipoEvento })}
              className={`group relative aspect-[3/4] w-[42vw] max-w-[180px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-background-card sm:w-[200px] sm:max-w-none lg:w-[220px] ${
                i % 2 === 0 ? "sm:-rotate-1" : "sm:rotate-1"
              } transition-transform duration-300 hover:rotate-0 hover:scale-[1.03]`}
            >
              <Image
                src={ocasion.foto}
                alt=""
                fill
                draggable={false}
                sizes="(max-width: 640px) 42vw, 220px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {"video" in ocasion && <VideoOcasion src={ocasion.video} />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <span className="ig-caption absolute inset-x-3 bottom-3 text-lg leading-tight">
                {ocasion.nombre}
              </span>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => desplazar(-1)}
          aria-label="Ver ocasiones anteriores"
          className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/70 backdrop-blur-sm transition-colors hover:border-neon-green hover:text-neon-green sm:flex pointer-coarse:hidden"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => desplazar(1)}
          aria-label="Ver más ocasiones"
          className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/70 backdrop-blur-sm transition-colors hover:border-neon-green hover:text-neon-green sm:flex pointer-coarse:hidden"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </section>
  );
}
