"use client";

import React, { useId } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Send,
  MessageCircle,
} from "lucide-react";
import { useMiFiesta } from "@/context/MiFiestaContext";
import Sheet from "@/components/ui/Sheet";
import Chip from "@/components/ui/Chip";
import { getAsesoriaWhatsAppLink } from "@/lib/whatsapp";

const EVENTO_TIPOS = [
  "Cumpleaños",
  "Baby Shower",
  "Revelación de género",
  "15 años",
  "Boda",
  "Corporativo",
  "Graduación",
  "Navidad",
  "Otro",
];

const LUGARES = ["Casa", "Salón de fiestas", "Piscina o club", "Al aire libre", "Otro"];

const INVITADOS = ["Hasta 15", "15-30", "30-50", "Más de 50"];

const MUNICIPIOS_SUGERENCIAS = [
  "San Cristóbal",
  "Cárdenas",
  "Torbes",
  "Guásimos",
  "Andrés Bello",
  "Junín",
  "Libertad",
  "Independencia",
  "Fernández Feo",
  "Otro",
];

export default function MiFiestaSheet() {
  const {
    items,
    removeItem,
    clearFiesta,
    isPanelOpen,
    closePanel,
    step,
    setStep,
    formData,
    updateFormData,
    sendWhatsAppCotizacion,
    isEnviado,
  } = useMiFiesta();

  const dataListId = useId();

  // Validación de formulario
  const isNombreValid = Boolean(formData.nombre.trim());
  const isFechaValid = Boolean(formData.fecha);
  const isZonaValid = Boolean(formData.zona.trim());
  const isFormComplete = isNombreValid && isFechaValid && isZonaValid && items.length > 0;

  const getMissingFieldText = () => {
    if (items.length === 0) return "Agrega al menos 1 servicio";
    if (!isNombreValid) return "Escribe tu nombre";
    if (!isFechaValid) return "Selecciona la fecha del evento";
    if (!isZonaValid) return "Indica el municipio o zona";
    return "Enviar cotización por WhatsApp";
  };

  return (
    <Sheet
      isOpen={isPanelOpen}
      onClose={closePanel}
      title={
        isEnviado ? (
          "¡Cotización lista!"
        ) : (
          <div className="flex items-center gap-2">
            <span>Arma tu cotización</span>
            <span className="rounded-full bg-neon-green/15 text-neon-green text-xs font-semibold px-2 py-0.5">
              Paso {step} de 2
            </span>
          </div>
        )
      }
      description={
        isEnviado
          ? "Te responderemos a la brevedad con la propuesta ideal."
          : step === 1
          ? "Revisa los shows y dinámicas que has agregado."
          : "Cuéntanos sobre tu evento para personalizar tu presupuesto."
      }
    >
      {/* PANTALLA DE ÉXITO */}
      {isEnviado ? (
        <div className="flex flex-col items-center justify-center text-center py-8 gap-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-neon-green/20 border border-neon-green text-neon-green flex items-center justify-center shadow-[0_0_24px_rgba(157,255,60,0.3)]">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="flex flex-col gap-2 max-w-sm">
            <h3 className="type-h3 text-foreground font-bold">
              ¡Listo! Te respondemos con tu cotización por WhatsApp 🎉
            </h3>
            <p className="text-sm text-muted">
              Se abrió WhatsApp con todos los detalles de tu fiesta listos para enviar.
              Si no se abrió automáticamente, puedes reenviarlo con el botón de abajo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mt-3">
            <button
              type="button"
              onClick={sendWhatsAppCotizacion}
              className="touch-target w-full rounded-full bg-neon-green py-3 px-5 text-sm font-bold text-[#0a0a0f] hover:bg-neon-green-dark transition-all cursor-pointer"
            >
              Reenviar a WhatsApp
            </button>
            <button
              type="button"
              onClick={clearFiesta}
              className="touch-target w-full rounded-full border border-white/15 bg-white/5 py-3 px-5 text-sm font-semibold text-foreground hover:bg-white/10 transition-all cursor-pointer"
            >
              Vaciar mi fiesta
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Barra de progreso */}
          <div className="flex items-center gap-2">
            <div
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                step >= 1 ? "bg-neon-green" : "bg-white/10"
              }`}
            />
            <div
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                step >= 2 ? "bg-neon-green" : "bg-white/10"
              }`}
            />
          </div>

          {/* PASO 1: TUS SERVICIOS */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10 gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted">
                    <Sparkles className="w-7 h-7 text-neon-green/70" />
                  </div>
                  <div>
                    <h3 className="type-h3 text-foreground font-semibold">Tu fiesta aún está vacía</h3>
                    <p className="text-xs sm:text-sm text-muted mt-1 max-w-xs">
                      Explora nuestro catálogo y presiona el botón &quot;+&quot; en los personajes o shows que más te gusten.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2.5 mt-2 w-full max-w-xs">
                    <Link
                      href="/catalogo"
                      onClick={closePanel}
                      className="touch-target rounded-full bg-neon-green px-5 py-2.5 text-xs sm:text-sm font-bold text-[#0a0a0f] text-center hover:bg-neon-green-dark transition-colors"
                    >
                      Explorar catálogo
                    </Link>
                    <a
                      href={getAsesoriaWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="touch-target inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground text-center hover:bg-white/10 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-neon-green" />
                      <span>Quiero asesoría</span>
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#181826] border border-white/10 hover:border-white/15 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-black/40 shrink-0">
                            {item.fotoUrl ? (
                              <Image
                                src={item.fotoUrl}
                                alt={item.nombre}
                                fill
                                className="object-cover"
                                sizes="56px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-neon-green/10 text-neon-green">
                                <Sparkles className="w-5 h-5" />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col min-w-0">
                            <span className="text-[11px] font-medium text-muted uppercase">
                              {item.categoria}
                            </span>
                            <span className="text-sm font-bold text-foreground truncate">
                              {item.nombre}
                            </span>
                            {item.variante && (
                              <span className="text-xs text-neon-green font-medium truncate">
                                Variante: {item.variante}
                              </span>
                            )}
                            {item.dinamicas && item.dinamicas.length > 0 && (
                              <span className="text-[11px] text-muted line-clamp-1">
                                {item.dinamicas.length} dinámicas seleccionadas
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Quitar ${item.nombre}`}
                          className="touch-target p-2 rounded-full text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="touch-target w-full flex items-center justify-center gap-2 rounded-full bg-neon-green py-3 px-6 text-sm font-bold text-[#0a0a0f] hover:bg-neon-green-dark hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer shadow-lg"
                    >
                      <span>Continuar con los datos del evento</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* PASO 2: TU EVENTO */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              {/* Microcopy de confianza */}
              <div className="p-3.5 rounded-2xl bg-neon-green/5 border border-neon-green/20 text-xs text-foreground/90">
                Cada fiesta es única: te enviamos tu cotización personalizada por WhatsApp
                según fecha, zona y servicios.
              </div>

              {/* Formulario */}
              <div className="flex flex-col gap-4">
                {/* Nombre */}
                <label className="flex flex-col gap-1.5 text-xs sm:text-sm font-medium">
                  Tu nombre completo <span className="text-neon-green">*</span>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => updateFormData({ nombre: e.target.value })}
                    placeholder="Ej. Daniela Pérez"
                    className="rounded-xl border border-white/10 bg-[#161622] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-neon-green"
                  />
                </label>

                {/* Tipo de evento */}
                <div className="flex flex-col gap-1.5 text-xs sm:text-sm font-medium">
                  <span>Tipo de evento <span className="text-neon-green">*</span></span>
                  <div className="flex flex-wrap gap-1.5">
                    {EVENTO_TIPOS.map((tipo) => (
                      <Chip
                        key={tipo}
                        selected={formData.tipoEvento === tipo}
                        onClick={() => updateFormData({ tipoEvento: tipo })}
                      >
                        {tipo}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Cumpleañero (condicional) */}
                {formData.tipoEvento === "Cumpleaños" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                    <label className="flex flex-col gap-1 text-xs font-medium">
                      Nombre del cumpleañero/a
                      <input
                        type="text"
                        value={formData.cumpleaneroNombre || ""}
                        onChange={(e) => updateFormData({ cumpleaneroNombre: e.target.value })}
                        placeholder="Ej. Sofía"
                        className="rounded-lg border border-white/10 bg-[#161622] px-3 py-2 text-xs sm:text-sm text-foreground outline-none focus:border-neon-green"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-medium">
                      Edad que cumple
                      <input
                        type="text"
                        value={formData.cumpleaneroEdad || ""}
                        onChange={(e) => updateFormData({ cumpleaneroEdad: e.target.value })}
                        placeholder="Ej. 5"
                        className="rounded-lg border border-white/10 bg-[#161622] px-3 py-2 text-xs sm:text-sm text-foreground outline-none focus:border-neon-green"
                      />
                    </label>
                  </div>
                )}

                {/* Fecha y Hora */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5 text-xs sm:text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neon-green" />
                      Fecha de la fiesta <span className="text-neon-green">*</span>
                    </span>
                    <input
                      type="date"
                      required
                      value={formData.fecha}
                      onChange={(e) => updateFormData({ fecha: e.target.value })}
                      className="rounded-xl border border-white/10 bg-[#161622] px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-neon-green"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-xs sm:text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-muted" />
                      Hora de inicio (opcional)
                    </span>
                    <input
                      type="text"
                      value={formData.horaInicio || ""}
                      onChange={(e) => updateFormData({ horaInicio: e.target.value })}
                      placeholder="Ej. 3:00 PM"
                      className="rounded-xl border border-white/10 bg-[#161622] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-neon-green"
                    />
                  </label>
                </div>

                {/* Zona o Municipio */}
                <label className="flex flex-col gap-1.5 text-xs sm:text-sm font-medium">
                  Municipio o zona <span className="text-neon-green">*</span>
                  <input
                    type="text"
                    required
                    list={dataListId}
                    value={formData.zona}
                    onChange={(e) => updateFormData({ zona: e.target.value })}
                    placeholder="Ej. San Cristóbal, Cárdenas, Barrio Obrero..."
                    className="rounded-xl border border-white/10 bg-[#161622] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-neon-green"
                  />
                  <datalist id={dataListId}>
                    {MUNICIPIOS_SUGERENCIAS.map((m) => (
                      <option key={m} value={m} />
                    ))}
                  </datalist>
                </label>

                {/* Lugar */}
                <div className="flex flex-col gap-1.5 text-xs sm:text-sm font-medium">
                  <span>Lugar del evento <span className="text-neon-green">*</span></span>
                  <div className="flex flex-wrap gap-1.5">
                    {LUGARES.map((lugar) => (
                      <Chip
                        key={lugar}
                        selected={formData.lugar === lugar}
                        onClick={() => updateFormData({ lugar })}
                      >
                        {lugar}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Invitados aproximados */}
                <div className="flex flex-col gap-1.5 text-xs sm:text-sm font-medium">
                  <span>Cantidad aproximada de invitados <span className="text-neon-green">*</span></span>
                  <div className="flex flex-wrap gap-1.5">
                    {INVITADOS.map((inv) => (
                      <Chip
                        key={inv}
                        selected={formData.invitados === inv}
                        onClick={() => updateFormData({ invitados: inv })}
                      >
                        {inv}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Comentarios */}
                <label className="flex flex-col gap-1.5 text-xs sm:text-sm font-medium">
                  Detalles o requerimientos adicionales (opcional)
                  <textarea
                    rows={2}
                    value={formData.comentarios || ""}
                    onChange={(e) => updateFormData({ comentarios: e.target.value })}
                    placeholder="Cuéntanos si tienes temáticas especiales o dudas..."
                    className="rounded-xl border border-white/10 bg-[#161622] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-neon-green"
                  />
                </label>
              </div>

              {/* Botón de envío síncrono */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="touch-target rounded-full p-2.5 border border-white/10 bg-white/5 text-muted hover:text-foreground hover:bg-white/10 transition-colors"
                  aria-label="Volver al paso 1"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  disabled={!isFormComplete}
                  onClick={sendWhatsAppCotizacion}
                  className="touch-target flex-1 flex items-center justify-center gap-2 rounded-full bg-neon-green py-3.5 px-6 text-sm font-bold text-[#0a0a0f] hover:bg-neon-green-dark hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>{getMissingFieldText()}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Sheet>
  );
}
