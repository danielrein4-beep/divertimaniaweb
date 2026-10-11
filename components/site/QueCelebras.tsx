"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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

  return (
    <section className="mx-auto max-w-6xl py-14 sm:py-20">
      <SectionHeader
        title="¿Qué celebras?"
        underlineWord="celebras"
        subtitle="Elige la ocasión y te mostramos lo que mejor funciona para ese tipo de fiesta."
        tilt="left"
        className="mb-8 px-4 sm:px-6"
      />

      <div className="scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-6 lg:grid-cols-7">
        {OCASIONES.map((ocasion, i) => (
          <Link
            key={ocasion.slug}
            href={`/catalogo?ocasion=${ocasion.slug}`}
            onClick={() => updateFormData({ tipoEvento: ocasion.tipoEvento })}
            className={`group relative aspect-[3/4] w-[42vw] max-w-[180px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-background-card sm:w-auto sm:max-w-none ${
              i % 2 === 0 ? "sm:-rotate-1" : "sm:rotate-1"
            } transition-transform duration-300 hover:rotate-0 hover:scale-[1.03]`}
          >
            <Image
              src={ocasion.foto}
              alt=""
              fill
              sizes="(max-width: 640px) 42vw, (max-width: 1024px) 25vw, 15vw"
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
    </section>
  );
}
