import React from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import ServicioCard from "@/components/ui/ServicioCard";

export interface ShowEstrellaData {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  fotoUrl: string | null;
  videoUrl?: string | null;
  posterUrl?: string | null;
  edadIdeal?: string | null;
  duracion?: string | null;
  masPedido: boolean;
  destacado: boolean;
  soloAdultos: boolean;
}

export default function ShowsEstrella({ shows }: { shows: ShowEstrellaData[] }) {
  // Regla estricta: NUNCA mostrar aquí servicios sin foto
  const showsConFoto = shows.filter((s) => Boolean(s.fotoUrl));

  if (showsConFoto.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <SectionHeader
        title="Shows estrella que encienden tu fiesta"
        underlineWord="estrella"
        subtitle="Las experiencias más pedidas y espectaculares de Divertimania en todo el Táchira."
        tilt="left"
        className="mb-8"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {showsConFoto.map((show, idx) => (
          <ServicioCard
            key={show.id}
            id={show.id}
            nombre={show.nombre}
            categoria={show.categoria}
            descripcion={show.descripcion}
            fotoUrl={show.fotoUrl}
            videoUrl={show.videoUrl}
            posterUrl={show.posterUrl}
            edadIdeal={show.edadIdeal}
            duracion={show.duracion}
            masPedido={show.masPedido}
            destacado={show.destacado}
            soloAdultos={show.soloAdultos}
            priority={idx < 2}
          />
        ))}
      </div>
    </section>
  );
}
