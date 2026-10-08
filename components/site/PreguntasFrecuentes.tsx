"use client";

import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { WHATSAPP_LINK } from "@/lib/site";
import Button from "@/components/ui/Button";

interface FAQItem {
  pregunta: string;
  respuesta: string;
}

const FAQS: FAQItem[] = [
  {
    pregunta: "¿Con cuánta anticipación debo reservar mi fecha?",
    respuesta:
      "Recomendamos reservar con al menos 2 a 4 semanas de anticipación, especialmente para fines de semana (viernes, sábado y domingo) o temporadas altas como diciembre. Para fechas de última hora, consúltanos de inmediato por WhatsApp para chequear disponibilidad.",
  },
  {
    pregunta: "¿Llegan a todo el Estado Táchira?",
    respuesta:
      "¡Sí! Atendemos en San Cristóbal, Táriba, Palmira, Cordero, Rubio, San Antonio, Capacho, Colón y zonas aledañas. Al momento de cotizar, solo indícanos el municipio y sector exacto para coordinar la logística.",
  },
  {
    pregunta: "¿Por qué no muestran precios fijos en la web?",
    respuesta:
      "Cada fiesta es única: la distancia del traslado, el número de invitados, la duración y la cantidad de personajes o shows influyen en el plan. Por eso personalizamos cada cotización al detalle, garantizándote el mejor show posible sin cobrarte de más.",
  },
  {
    pregunta: "¿Qué necesitan en el lugar para realizar el show?",
    respuesta:
      "Dependiendo del show: para personajes infantiles y animación, un espacio libre para juegos y acceso a toma de corriente si llevamos sonido. Para el Show LED o Bolas Disco, requerimos altura adecuada y control de luces. Te asesoramos previamente sobre todos los requerimientos.",
  },
  {
    pregunta: "¿Los personajes cantan, bailan y actúan en vivo?",
    respuesta:
      "Totalmente. No somos solo disfraces: nuestros artistas son actores y recreadores formados para actuar, bailar, interactuar con el cumpleañero y seguir la temática de principio a fin.",
  },
  {
    pregunta: "¿Qué sucede si llueve o cambia la hora del evento?",
    respuesta:
      "Entendemos que los eventos tienen imprevistos. Te pedimos avisarnos lo antes posible para reajustar el itinerario con el equipo de animación según la disponibilidad de la jornada.",
  },
];

export default function PreguntasFrecuentes() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeader
          badge="Resolvemos tus dudas"
          title="Preguntas frecuentes antes de reservar"
          underlineWord="frecuentes"
          subtitle="Queremos que estés completamente tranquilo con cada detalle de la animación de tu evento."
          align="center"
          tilt="left"
        />

        <div className="mt-12 space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-border/80 bg-surface transition-colors hover:border-border"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-display text-base font-semibold text-foreground transition-colors sm:text-lg"
                >
                  <span>{faq.pregunta}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface-raised text-muted transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-neon-green" : ""
                    }`}
                  >
                    ↓
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-border/40 px-5 pb-5 pt-3 text-sm leading-relaxed text-muted sm:text-base">
                    {faq.respuesta}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bloque de cierre */}
        <div className="mt-12 rounded-3xl border border-neon-green/30 bg-gradient-to-br from-neon-green/10 via-surface to-surface p-8 text-center sm:p-10">
          <h3 className="font-display text-xl font-bold text-foreground sm:text-2xl">
            ¿Tienes otra duda o una idea específica para tu fiesta?
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
            Escríbenos directamente y te asesoramos con la mejor opción para tu fecha y temática.
          </p>
          <div className="mt-6 flex justify-center">
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg">
                Hablar con un asesor por WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
