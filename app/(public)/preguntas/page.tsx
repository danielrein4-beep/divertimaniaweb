import type { Metadata } from "next";
import { PAGOS, PREGUNTAS } from "@/lib/negocio";
import CotizarButtons from "@/components/site/CotizarButtons";

export const metadata: Metadata = {
  title: "Preguntas frecuentes | Divertimania",
  description: "Cómo reservar, formas de pago, anticipo, cambios de fecha y eventos en toda Venezuela.",
};

// Datos estructurados de preguntas frecuentes para que Google pueda mostrarlas en los resultados.
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PREGUNTAS.map((p) => ({
    "@type": "Question",
    name: p.pregunta,
    acceptedAnswer: { "@type": "Answer", text: p.respuesta },
  })),
};

export default function PreguntasPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <h1 className="type-h1 font-display font-extrabold">Preguntas frecuentes</h1>
      <p className="mt-3 text-muted">Lo que casi todos nos preguntan antes de reservar.</p>

      <div className="mt-8 flex flex-col gap-3">
        {PREGUNTAS.map((p) => (
          <details key={p.pregunta} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 open:border-neon-green/40">
            <summary className="cursor-pointer list-none font-display text-lg font-bold marker:hidden">
              <span className="flex items-start justify-between gap-4">
                {p.pregunta}
                <span className="text-neon-green transition-transform group-open:rotate-45" aria-hidden>+</span>
              </span>
            </summary>
            <p className="mt-3 text-foreground/85">{p.respuesta}</p>
          </details>
        ))}
      </div>

      <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-display text-xl font-bold">Formas de pago</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {PAGOS.metodos.map((m) => (
            <li key={m} className="rounded-full border border-white/15 px-3 py-1 text-sm">{m}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">{PAGOS.anticipo}</p>
      </section>

      <div className="mt-12 flex flex-col items-center gap-4 text-center">
        <p className="text-muted">¿Te quedó otra duda? Escríbenos.</p>
        <CotizarButtons />
      </div>
    </div>
  );
}
