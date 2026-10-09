"use client";

import Image from "next/image";
import Link from "next/link";
import { useMiFiesta } from "@/context/MiFiestaContext";
import { OCASIONES } from "@/lib/ocasiones";

/** Ocasiones como historias destacadas de Instagram: un toque y ves lo que funciona para esa fiesta. */
export default function QueCelebras() {
  const { updateFormData } = useMiFiesta();

  return (
    <nav aria-label="¿Qué celebras?" className="-mx-4 sm:mx-0">
      <ul className="scrollbar-none flex gap-4 overflow-x-auto px-4 pb-1 sm:px-0">
        {OCASIONES.map((ocasion) => (
          <li key={ocasion.slug} className="shrink-0">
            <Link
              href={`/catalogo?ocasion=${ocasion.slug}`}
              onClick={() => updateFormData({ tipoEvento: ocasion.tipoEvento })}
              className="group flex w-[72px] flex-col items-center gap-1.5 text-center"
            >
              <span className="rounded-full bg-neon-green p-[2.5px] transition-transform group-hover:scale-105 group-active:scale-95">
                <span className="block rounded-full bg-background p-[2.5px]">
                  <span className="relative block h-[62px] w-[62px] overflow-hidden rounded-full">
                    <Image src={ocasion.foto} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                </span>
              </span>
              <span className="w-full truncate text-xs font-medium text-foreground/90">{ocasion.nombre}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
