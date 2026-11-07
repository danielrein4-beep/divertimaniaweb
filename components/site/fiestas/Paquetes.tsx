import Link from "next/link";
import { Check } from "lucide-react";
import type { Paquete } from "@/lib/fiestas";
import { buildWhatsAppLink } from "@/lib/telefono";

/** Tres paquetes armados para la ocasión; el del medio, destacado. Cada uno cotiza por WhatsApp. */
export default function Paquetes({
  paquetes,
  nombre,
  whatsapp,
  ocasionSlug,
}: {
  paquetes: Paquete[];
  nombre: string;
  whatsapp: string;
  ocasionSlug: string;
}) {
  return (
    <section id="paquetes" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
      <div className="max-w-2xl">
        <h2 className="type-h1 font-display font-extrabold">
          Paquetes para <span className="text-neon-green">{nombre.toLowerCase()}</span>
        </h2>
        <p className="mt-3 text-muted">Un punto de partida: cada paquete se ajusta a tu fecha, al lugar y a la cantidad de invitados.</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {paquetes.map((p) => {
          const mensaje = `Hola Divertimania, vi el paquete ${p.nombre} para ${nombre.toLowerCase()} en la página y quiero cotizarlo.`;
          return (
            <article
              key={p.nombre}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                p.destacado ? "border-neon-green bg-neon-green/[0.06] md:-translate-y-3" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              {p.destacado && (
                <span className="absolute -top-3 left-6 rounded-full bg-neon-green px-3 py-1 text-xs font-bold uppercase tracking-wide text-background">
                  El más elegido
                </span>
              )}
              <h3 className="font-display text-2xl font-extrabold">{p.nombre}</h3>
              <p className="mt-1 text-sm text-muted">{p.para}</p>
              <p className="mt-5 font-display text-lg font-bold">
                {p.desde ? (
                  <>
                    <span className="text-sm font-semibold text-muted">desde </span>US$ {p.desde}
                  </>
                ) : (
                  <span className="text-foreground/90">Cotización a tu medida</span>
                )}
              </p>
              <ul className="mt-5 flex flex-1 flex-col gap-2.5 text-sm">
                {p.incluye.map((linea) => (
                  <li key={linea} className="flex gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon-green" aria-hidden />
                    <span>{linea}</span>
                  </li>
                ))}
              </ul>
              <a
                href={buildWhatsAppLink(whatsapp, mensaje)}
                target="_blank"
                rel="noopener noreferrer"
                data-origen="fiesta"
                data-detalle={`${nombre}: paquete ${p.nombre}`}
                className={`touch-target mt-7 w-full rounded-full text-sm font-bold transition-colors ${
                  p.destacado ? "bg-neon-green text-background hover:bg-neon-green-dark" : "border border-white/20 hover:border-neon-green hover:text-neon-green"
                }`}
              >
                Quiero este paquete
              </a>
            </article>
          );
        })}
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        ¿Prefieres elegir cada cosa?{" "}
        <Link href={`/catalogo?ocasion=${ocasionSlug}`} className="font-semibold text-neon-green hover:underline">
          Arma tu fiesta desde el catálogo
        </Link>
      </p>
    </section>
  );
}
