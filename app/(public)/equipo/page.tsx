import { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { WHATSAPP_LINK } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import PlaceholderImage from "@/components/site/PlaceholderImage";
import { Sparkles, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Nuestro Equipo | Divertimania Táchira",
  description:
    "Conoce a los recreadores, actores y animadores profesionales que le ponen la energía y magia a cada fiesta de Divertimania en el Estado Táchira.",
};

export const dynamic = "force-dynamic";

export default async function EquipoPage() {
  const recreadores = await prisma.recreador.findMany({
    where: { activo: true },
    orderBy: { orden: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-14 flex flex-col gap-12">
      <SectionHeader
        badge="El talento detrás de la magia"
        title="Los artistas que encienden tu fiesta"
        underlineWord="artistas"
        subtitle="Actores, recreadores y animadores formados para conectar con niños y adultos. Puntuales, alegres y con vestuarios impecables en todo el Táchira."
        align="center"
        tilt="right"
      />

      {/* Grid de recreadores con estética polaroid / sticker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {recreadores.map((r, idx) => {
          const tiltClass = idx % 2 === 0 ? "hover:rotate-0 rotate-[-1deg]" : "hover:rotate-0 rotate-[1deg]";

          return (
            <div
              key={r.id}
              className={`group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface p-4 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/25 ${tiltClass}`}
            >
              {/* Foto tipo polaroid */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-black/40">
                {r.fotoUrl ? (
                  <Image
                    src={r.fotoUrl}
                    alt={r.nombre}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <PlaceholderImage label={r.nombre} categoria="Personajes" className="h-full w-full" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neon-green">
                    {r.cargo}
                  </span>
                  <h3 className="font-display font-extrabold text-xl text-white">
                    {r.nombre}
                  </h3>
                </div>
              </div>

              {/* Descripción */}
              <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  {r.descripcion || "Comprometido con brindar momentos de alegría inolvidables en cada evento."}
                </p>

                <div className="pt-2 flex items-center gap-1.5 text-xs text-muted/70">
                  <Sparkles className="w-3.5 h-3.5 text-neon-green" />
                  <span>Equipo Oficial Divertimania</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Llamado a la acción final */}
      <div className="rounded-3xl border border-neon-green/30 bg-gradient-to-br from-neon-green/10 via-surface to-surface p-8 sm:p-12 text-center max-w-3xl mx-auto flex flex-col items-center gap-4 shadow-2xl">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
          ¿Quieres a este equipo en tu próxima celebración?
        </h2>
        <p className="text-sm text-muted max-w-lg leading-relaxed">
          Cuéntanos la fecha, el lugar y la ocasión. Te armamos el equipo de animación ideal para que no te preocupes por nada.
        </p>
        <div className="pt-2">
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="lg" leftIcon={<MessageCircle className="w-4 h-4" />}>
              Preguntar por el equipo en WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
