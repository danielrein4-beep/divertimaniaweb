import Image from "next/image";
import { Quote } from "lucide-react";
import { testimoniosVisibles } from "@/lib/testimonios";

/** Opiniones reales de clientes, cargadas en el panel. Si todavía no hay ninguna, no se muestra nada. */
export default async function Testimonios() {
  const testimonios = await testimoniosVisibles(6);
  if (testimonios.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="type-h1 mb-10 text-center font-display font-extrabold">
        Lo que dicen <span className="text-neon-green">nuestros clientes</span>
      </h2>
      <div className="grid gap-5 md:grid-cols-3">
        {testimonios.map((t) => (
          <figure key={t.id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <Quote className="h-6 w-6 text-neon-green" aria-hidden />
            <blockquote className="flex-1 text-foreground/90">{t.texto}</blockquote>
            <figcaption className="flex items-center gap-3 text-sm">
              {t.fotoUrl && (
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <Image src={t.fotoUrl} alt="" fill sizes="40px" className="object-cover" />
                </span>
              )}
              <span>
                <span className="block font-bold">{t.nombre}</span>
                <span className="text-muted">
                  {t.evento}
                  {t.ciudad ? ` · ${t.ciudad}` : ""}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
