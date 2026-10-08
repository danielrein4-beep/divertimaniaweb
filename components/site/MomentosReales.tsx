"use client";

import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

const TIRA_FOTOS = [
  { src: "/images/mickey-minnie-graduacion.jpg", alt: "Mickey y Minnie en graduación escolar", label: "Graduación divertida" },
  { src: "/images/frozen-olaf-elsa.jpg", alt: "Elsa y Olaf show en vivo", label: "Aventura congelada" },
  { src: "/images/bolas-disco-duo.jpg", alt: "Bolas Disco en 15 años", label: "Hora loca de impacto" },
  { src: "/images/show-led-hoop.jpg", alt: "Show LED interactivo", label: "Luces y energía" },
  { src: "/images/dia-piscina-espuma.png", alt: "Espumanía en fiesta de piscina", label: "Fiesta de piscina" },
];

export default function MomentosReales() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          badge="Recuerdos inolvidables"
          title="Momentos reales en todo el Táchira"
          underlineWord="Táchira"
          subtitle="Sin montajes de catálogo ficticio. Cada sonrisa, abrazo y aplauso ocurrió en una fiesta real atendida por nuestro equipo."
          align="center"
          tilt="right"
        />

        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Foto polaroid destacada */}
          <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <div className="relative rotate-[-1.5deg] rounded-3xl border-2 border-border/80 bg-surface/90 p-3 shadow-2xl backdrop-blur-sm transition-transform duration-300 hover:rotate-0 hover:scale-[1.02]">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-surface-raised">
                <Image
                  src="/images/rapunzel-cumpleanos.png"
                  alt="Cumpleañera emocionada con Rapunzel en San Cristóbal"
                  fill
                  sizes="(max-width: 768px) 90vw, 400px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <p className="font-display text-lg font-bold text-white">
                    “El abrazo que tanto soñó”
                  </p>
                  <p className="text-xs text-white/80">San Cristóbal, Estado Táchira</p>
                </div>
              </div>
              <p className="mt-3 text-center font-display text-xs tracking-wider text-muted uppercase">
                Fotos 100% de nuestras fiestas
              </p>
            </div>
          </div>

          {/* Columna de historia y tira fotográfica */}
          <div className="flex flex-col gap-6 text-left lg:col-span-7">
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-neon-green/30 bg-neon-green/10 px-3.5 py-1 text-xs font-semibold text-neon-green">
              <span>+15.000 seguidores en Instagram</span>
            </div>

            <h3 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Cuidamos cada detalle para que tú solo disfrutes
            </h3>

            <p className="text-sm leading-relaxed text-muted sm:text-base">
              Llegamos puntuales, con vestuarios impecables y actores dedicados a hacer soñar a los niños y animar a los adultos. Desde San Cristóbal hasta Rubio, Táriba, Palmira y más allá.
            </p>

            {/* Tira horizontal deslizable de fotos */}
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 pt-1 no-scrollbar sm:mx-0 sm:px-0">
              {TIRA_FOTOS.map((foto, idx) => (
                <div
                  key={idx}
                  className="group relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-surface-raised transition-transform duration-200 hover:-translate-y-1 sm:h-32 sm:w-32"
                >
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    fill
                    sizes="128px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent" />
                  <span className="absolute bottom-1 left-1.5 right-1.5 truncate text-[10px] font-medium text-white/90 drop-shadow">
                    {foto.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Botones de acción */}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Link href="/galeria">
                <Button variant="secondary" size="md">
                  Ver galería completa
                </Button>
              </Link>
              <a
                href="https://www.instagram.com/divertimaniashow"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="md" className="gap-2 border border-border/60">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>@divertimaniashow</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
