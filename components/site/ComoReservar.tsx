import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { CIUDADES, COBERTURA, PASOS_RESERVA, PAGOS } from "@/lib/negocio";

/** Inicio: a dónde llegamos y cómo se aparta una fecha, para que el cliente no tenga que preguntarlo. */
export default function ComoReservar() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col gap-5">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neon-green">
            <MapPin className="h-4 w-4" aria-hidden />
            Cobertura
          </span>
          <h2 className="type-h1 font-display font-extrabold">{COBERTURA.titulo}</h2>
          <p className="type-body text-muted">{COBERTURA.texto}</p>
          <ul className="flex flex-wrap gap-2" aria-label="Ciudades donde hemos trabajado">
            {CIUDADES.map((c) => (
              <li key={c} className="rounded-full border border-white/15 px-3 py-1 text-sm text-foreground/90">
                {c}
              </li>
            ))}
          </ul>
          <p className="text-sm font-semibold text-neon-green">{COBERTURA.anticipacion}</p>
        </div>

        <div className="flex flex-col gap-5">
          <h2 className="type-h1 font-display font-extrabold">
            Reservar es <span className="text-neon-green">así de fácil</span>
          </h2>
          <ol className="flex flex-col gap-4">
            {PASOS_RESERVA.map((paso, i) => (
              <li key={paso.titulo} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neon-green font-display text-lg font-extrabold text-background">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold">{paso.titulo}</h3>
                  <p className="text-sm text-muted">{paso.texto}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-sm text-muted">
            <span className="font-semibold text-foreground">Pagos:</span> {PAGOS.metodos.join(" · ")}
          </p>
          <Link
            href="/preguntas"
            className="group inline-flex w-fit items-center gap-2 text-sm font-bold text-neon-green hover:underline"
          >
            Preguntas frecuentes
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
