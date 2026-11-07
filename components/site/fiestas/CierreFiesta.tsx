import Image from "next/image";
import Link from "next/link";
import type { Pregunta } from "@/lib/negocio";
import { PASOS_RESERVA } from "@/lib/negocio";
import { FIESTAS } from "@/lib/fiestas";
import { getOcasion } from "@/lib/ocasiones";

/** Cómo reservar en tres pasos. */
export function PasosReserva() {
  return (
    <section className="border-y border-white/10 bg-white/[0.02]">
      <ol className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
        {PASOS_RESERVA.map((paso, i) => (
          <li key={paso.titulo} className="flex gap-4">
            <span className="font-display text-4xl font-extrabold leading-none text-neon-green">{i + 1}</span>
            <div>
              <h3 className="font-display text-lg font-bold">{paso.titulo}</h3>
              <p className="mt-1 text-sm text-muted">{paso.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Preguntas de la ocasión, desplegables. */
export function PreguntasFiesta({ preguntas }: { preguntas: Pregunta[] }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="type-h1 font-display font-extrabold">Preguntas frecuentes</h2>
      <div className="mt-8 flex flex-col gap-3">
        {preguntas.map((p) => (
          <details key={p.pregunta} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 open:border-neon-green/40">
            <summary className="cursor-pointer list-none font-display text-lg font-bold">
              <span className="flex items-start justify-between gap-4">
                {p.pregunta}
                <span className="text-neon-green transition-transform group-open:rotate-45" aria-hidden>
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-foreground/85">{p.respuesta}</p>
          </details>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted">
        Formas de pago, anticipo y viajes fuera del Táchira:{" "}
        <Link href="/preguntas" className="font-semibold text-neon-green hover:underline">
          todas las preguntas
        </Link>
      </p>
    </section>
  );
}

/** Enlaces a las demás ocasiones, con su foto. */
export function OtrasCelebraciones({ actual }: { actual: string }) {
  const otras = FIESTAS.filter((f) => f.ruta !== actual);
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <h2 className="font-display text-2xl font-extrabold">Otras celebraciones</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {otras.map((f) => {
          const o = getOcasion(f.ocasion);
          if (!o) return null;
          return (
            <Link key={f.ruta} href={`/fiestas/${f.ruta}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image src={o.foto} alt="" fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <span className="absolute bottom-3 left-3 font-display text-lg font-bold">{o.nombre}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
