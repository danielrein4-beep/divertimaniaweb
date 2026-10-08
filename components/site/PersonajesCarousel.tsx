import React from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import PlaceholderImage from "@/components/site/PlaceholderImage";

export interface PersonajeItem {
  id: string;
  nombre: string;
  fotoUrl: string | null;
}

export default function PersonajesCarousel({ personajes }: { personajes: PersonajeItem[] }) {
  if (!personajes || personajes.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <SectionHeader
          title="Los favoritos de los niños"
          underlineWord="favoritos"
          subtitle="Personajes oficiales con vestuarios impecables para fotos, bailes y abrazos inolvidables."
          tilt="right"
        />

        <Link
          href="/catalogo?categoria=Personajes"
          className="text-sm font-semibold text-neon-green hover:underline shrink-0"
        >
          Ver todos los personajes →
        </Link>
      </div>

      {/* Carrusel con scroll-snap táctil */}
      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none snap-x snap-mandatory">
        {personajes.map((personaje) => (
          <Link
            key={personaje.id}
            href={`/catalogo/${personaje.id}`}
            className="group flex flex-col items-center gap-3 shrink-0 snap-start select-none w-28 sm:w-36 text-center cursor-pointer transition-transform hover:-translate-y-1"
          >
            {/* Avatar redondo tipo sticker con borde blanco / neon */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-neon-green/60 via-white/20 to-magenta/60 shadow-xl group-hover:scale-105 transition-transform duration-300">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-black/50">
                {personaje.fotoUrl ? (
                  <Image
                    src={personaje.fotoUrl}
                    alt={personaje.nombre}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="128px"
                  />
                ) : (
                  <PlaceholderImage label={personaje.nombre} categoria="Personajes" className="h-full w-full" />
                )}
              </div>
            </div>

            <span className="type-h3 text-foreground font-bold text-xs sm:text-sm line-clamp-2 px-1 group-hover:text-neon-green transition-colors">
              {personaje.nombre}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
