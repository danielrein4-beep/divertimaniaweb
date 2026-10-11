"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, Sparkles, Trash2 } from "lucide-react";
import { useMiFiesta } from "@/context/MiFiestaContext";
import Sheet from "@/components/ui/Sheet";
import EventoFormFields, { EnviarCotizacionButton } from "@/components/mifiesta/EventoFormFields";

export default function MiFiestaSheet() {
  const { items, removeItem, clearFiesta, isPanelOpen, closePanel, step, setStep, reabrirWhatsApp, isEnviado } =
    useMiFiesta();

  const titulo = isEnviado ? "¡Listo!" : step === 1 ? "Tu fiesta" : "Tu evento";
  const descripcion = isEnviado
    ? "Te respondemos por WhatsApp con tu cotización."
    : step === 1
      ? "Revisa lo que elegiste. Puedes quitar o agregar más."
      : "Con estos datos te cotizamos sin vueltas.";

  const footer = isEnviado ? null : step === 1 ? (
    <button
      type="button"
      onClick={() => setStep(2)}
      className="touch-target flex w-full items-center justify-center gap-2 rounded-full bg-neon-green px-6 py-3.5 text-sm font-bold text-background transition-all hover:bg-neon-green-dark active:scale-[0.98]"
    >
      {items.length > 0 ? "Seguir: datos del evento" : "Pedir asesoría sin elegir servicios"}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </button>
  ) : (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setStep(1)}
        aria-label="Volver a tu fiesta"
        className="touch-target shrink-0 rounded-full border border-border p-3 text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <EnviarCotizacionButton />
    </div>
  );

  return (
    <Sheet
      isOpen={isPanelOpen}
      onClose={closePanel}
      title={titulo}
      description={descripcion}
      footer={footer}
      progress={isEnviado ? undefined : step / 2}
    >
      {isEnviado ? (
        <div className="flex flex-col items-center gap-5 py-8 text-center">
          <CheckCircle2 className="h-14 w-14 text-neon-green" aria-hidden />
          <div className="flex max-w-sm flex-col gap-2">
            <h3 className="type-h3 font-bold">Se abrió WhatsApp con todo listo</h3>
            <p className="text-sm text-muted">
              Solo dale a enviar. Si no se abrió, tócalo de nuevo aquí abajo.
            </p>
          </div>
          <div className="flex w-full max-w-xs flex-col gap-3">
            <button
              type="button"
              onClick={reabrirWhatsApp}
              className="touch-target w-full rounded-full bg-neon-green px-5 py-3 text-sm font-bold text-background transition-colors hover:bg-neon-green-dark"
            >
              Abrir WhatsApp otra vez
            </button>
            <button
              type="button"
              onClick={clearFiesta}
              className="touch-target w-full rounded-full border border-border px-5 py-3 text-sm font-semibold transition-colors hover:border-white/30"
            >
              Ya lo envié, vaciar mi fiesta
            </button>
          </div>
        </div>
      ) : step === 1 ? (
        items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <Sparkles className="h-10 w-10 text-neon-green/70" aria-hidden />
            <div>
              <h3 className="type-h3 font-semibold">Tu fiesta está vacía</h3>
              <p className="mt-1 max-w-xs text-sm text-muted">
                Toca el <strong className="text-foreground">+</strong> en los shows y personajes que te gusten y
                aparecerán aquí.
              </p>
            </div>
            <Link
              href="/catalogo"
              onClick={closePanel}
              className="touch-target rounded-full border border-neon-green/60 px-5 py-2.5 text-sm font-bold text-neon-green transition-colors hover:bg-neon-green/10"
            >
              Ver el catálogo
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background-card p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-background-elevated">
                    {item.fotoUrl ? (
                      <Image src={item.fotoUrl} alt="" fill className="object-cover" sizes="56px" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-neon-green">
                        <Sparkles className="h-5 w-5" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-bold">{item.nombre}</span>
                    {item.variante && <span className="truncate text-xs text-neon-green">{item.variante}</span>}
                    {item.dinamicas && item.dinamicas.length > 0 && (
                      <span className="line-clamp-2 text-xs text-muted">{item.dinamicas.join(", ")}</span>
                    )}
                    {!item.variante && !item.dinamicas?.length && (
                      <span className="truncate text-xs text-muted">{item.categoria}</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Quitar ${item.nombre}${item.variante ? ` (${item.variante})` : ""}`}
                  className="touch-target shrink-0 rounded-full p-2 text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
            <li>
              <Link
                href="/catalogo"
                onClick={closePanel}
                className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border p-3 text-sm font-medium text-muted transition-colors hover:border-neon-green/60 hover:text-neon-green"
              >
                + Agregar algo más
              </Link>
            </li>
          </ul>
        )
      ) : (
        <div className="flex flex-col gap-5">
          {items.length === 0 && (
            <p className="flex items-start gap-2 rounded-2xl border border-border bg-background-card p-3.5 text-sm text-muted">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-neon-green" aria-hidden />
              No elegiste servicios: te recomendamos lo ideal según tu evento.
            </p>
          )}
          <EventoFormFields />
          <p className="text-xs text-muted">
            No publicamos precios porque cada fiesta es distinta: te cotizamos según fecha, zona y servicios.
          </p>
        </div>
      )}
    </Sheet>
  );
}
