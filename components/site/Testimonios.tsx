import { Quote } from "lucide-react";
import { TESTIMONIOS } from "@/lib/negocio";

/** Opiniones reales de clientes. Si todavía no hay ninguna cargada, no se muestra nada. */
export default function Testimonios() {
  if (TESTIMONIOS.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="type-h1 mb-10 text-center font-display font-extrabold">
        Lo que dicen <span className="text-neon-green">nuestros clientes</span>
      </h2>
      <div className="grid gap-5 md:grid-cols-3">
        {TESTIMONIOS.map((t) => (
          <figure key={t.nombre + t.evento} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <Quote className="h-6 w-6 text-neon-green" aria-hidden />
            <blockquote className="flex-1 text-foreground/90">{t.texto}</blockquote>
            <figcaption className="text-sm">
              <span className="font-bold">{t.nombre}</span>
              <span className="text-muted"> · {t.evento} · {t.ciudad}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
