"use client";

import Image from "next/image";
import Link from "next/link";
import { useMiFiesta } from "@/context/MiFiestaContext";
import SectionHeader from "@/components/ui/SectionHeader";
import { OCASIONES } from "@/lib/ocasiones";

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
