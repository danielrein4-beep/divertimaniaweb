"use client";

import { MessageCircle } from "lucide-react";
import { useConexionLigera } from "@/lib/useConexionLigera";
import { fotoOptimizada } from "@/lib/fotoOptimizada";

/** Portada de una ocasión: video a pantalla ancha (foto con conexión lenta), título y llamado a cotizar. */
export default function PortadaFiesta({
  nombre,
  h1,
  bajada,
  foto,
  video,
  whatsapp,
}: {
  nombre: string;
  h1: string;
  bajada: string;
  foto: string;
  video: string | null;
  whatsapp: string;
}) {
  const ligera = useConexionLigera();
  const poster = fotoOptimizada(foto, 1200);

  return (
    <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden">
      {video && !ligera ? (
        <video src={video} poster={poster} muted autoPlay loop playsInline preload="metadata" className="absolute inset-0 -z-20 h-full w-full object-cover" aria-hidden />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- ya pasa por el optimizador (fotoOptimizada)
        <img src={poster} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" fetchPriority="high" />
      )}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/70 to-background/10" />

      <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-32 sm:px-6 sm:pb-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-green">{nombre}</p>
        <h1 className="type-display mt-3 max-w-3xl font-display font-extrabold">{h1}</h1>
        <p className="mt-4 max-w-xl text-lg text-foreground/85">{bajada}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-origen="fiesta"
            data-detalle={nombre}
            className="touch-target gap-2 rounded-full bg-neon-green px-7 text-base font-bold text-background transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="h-5 w-5" aria-hidden /> Cotizar por WhatsApp
          </a>
          <a href="#paquetes" className="touch-target rounded-full border border-white/25 px-7 text-base font-semibold backdrop-blur-sm hover:border-neon-green hover:text-neon-green">
            Ver paquetes
          </a>
        </div>
      </div>
    </section>
  );
}
