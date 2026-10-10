"use client";

import { useId } from "react";
import { Calendar, Clock, Send } from "lucide-react";
import { useMiFiesta } from "@/context/MiFiestaContext";
import { primerCampoFaltante } from "@/lib/miFiesta";
import { todayStr } from "@/lib/date";
import Chip from "@/components/ui/Chip";

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
const MUNICIPIOS = [
  "San Cristóbal",
  "Cárdenas",
  "Torbes",
  "Guásimos",
  "Andrés Bello",
  "Junín",
  "Libertad",
  "Independencia",
  "Fernández Feo",
];

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-3 text-base text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-neon-green";

function Requerido() {
  return <span className="text-neon-green"> *</span>;
}

/** Campos del evento, conectados a Mi fiesta. Se usan en el panel y en la página de contacto. */
export default function EventoFormFields() {
  const { formData, updateFormData } = useMiFiesta();
  const ids = useId();

  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        <span>
          Tu nombre
          <Requerido />
        </span>
        <input
          type="text"
          autoComplete="name"
          value={formData.nombre}
          onChange={(e) => updateFormData({ nombre: e.target.value })}
          placeholder="Ej. Daniela Pérez"
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        <span>
          Tu teléfono <span className="font-normal text-muted">(opcional, por si no nos llega tu mensaje)</span>
        </span>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={formData.telefono}
          onChange={(e) => updateFormData({ telefono: e.target.value })}
          placeholder="Ej. 0414 123 4567"
          className={inputClass}
        />
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">
          ¿Qué celebras?
          <Requerido />
        </legend>
        <div className="flex flex-wrap gap-2">
          {EVENTO_TIPOS.map((tipo) => (
            <Chip
              key={tipo}
              selected={formData.tipoEvento === tipo}
              aria-pressed={formData.tipoEvento === tipo}
              onClick={() => updateFormData({ tipoEvento: tipo })}
            >
              {tipo}
            </Chip>
          ))}
        </div>
      </fieldset>

      {formData.tipoEvento === "Cumpleaños" && (
        <div className="grid grid-cols-[1fr_6rem] gap-3 rounded-2xl border border-border bg-background-card p-3.5">
          <label className="flex flex-col gap-1 text-xs font-medium">
            Nombre del cumpleañero
            <input
              type="text"
              value={formData.cumpleaneroNombre}
              onChange={(e) => updateFormData({ cumpleaneroNombre: e.target.value })}
              placeholder="Ej. Sofía"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium">
            Edad
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={120}
              value={formData.cumpleaneroEdad}
              onChange={(e) => updateFormData({ cumpleaneroEdad: e.target.value })}
              placeholder="5"
              className={inputClass}
            />
          </label>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-neon-green" aria-hidden />
            Fecha
            <Requerido />
          </span>
          <input
            type="date"
            min={todayStr()}
            value={formData.fecha}
            onChange={(e) => updateFormData({ fecha: e.target.value })}
            className={`${inputClass} [color-scheme:dark]`}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-muted" aria-hidden />
            Hora de inicio <span className="font-normal text-muted">(opcional)</span>
          </span>
          <input
            type="time"
            value={formData.horaInicio}
            onChange={(e) => updateFormData({ horaInicio: e.target.value })}
            className={`${inputClass} [color-scheme:dark]`}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        <span>
          Municipio o zona
          <Requerido />
        </span>
        <input
          type="text"
          list={`${ids}-municipios`}
          value={formData.zona}
          onChange={(e) => updateFormData({ zona: e.target.value })}
          placeholder="Ej. San Cristóbal, Barrio Obrero"
          className={inputClass}
        />
        <datalist id={`${ids}-municipios`}>
          {MUNICIPIOS.map((m) => (
            <option key={m} value={m} />
          ))}
        </datalist>
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">
          ¿Dónde será?
          <Requerido />
        </legend>
        <div className="flex flex-wrap gap-2">
          {LUGARES.map((lugar) => (
            <Chip
              key={lugar}
              selected={formData.lugar === lugar}
              aria-pressed={formData.lugar === lugar}
              onClick={() => updateFormData({ lugar })}
            >
              {lugar}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">
          ¿Cuántos invitados, más o menos?
          <Requerido />
        </legend>
        <div className="flex flex-wrap gap-2">
          {INVITADOS.map((inv) => (
            <Chip
              key={inv}
              selected={formData.invitados === inv}
              aria-pressed={formData.invitados === inv}
              onClick={() => updateFormData({ invitados: inv })}
            >
              {inv}
            </Chip>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        <span>
          Algo más que debamos saber <span className="font-normal text-muted">(opcional)</span>
        </span>
        <textarea
          rows={3}
          value={formData.comentarios}
          onChange={(e) => updateFormData({ comentarios: e.target.value })}
          placeholder="Temática, horario de la torta, dudas…"
          className={inputClass}
        />
      </label>
    </div>
  );
}

/** Botón final: dice qué falta hasta que el formulario está completo. */
export function EnviarCotizacionButton({ className = "" }: { className?: string }) {
  const { formData, sendWhatsAppCotizacion } = useMiFiesta();
  const falta = primerCampoFaltante(formData, todayStr());

  return (
    <button
      type="button"
      disabled={Boolean(falta)}
      onClick={sendWhatsAppCotizacion}
      className={`touch-target flex w-full items-center justify-center gap-2 rounded-full bg-neon-green px-6 py-3.5 text-sm font-bold text-background transition-all hover:bg-neon-green-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-muted ${className}`}
    >
      <Send className="h-4 w-4" aria-hidden />
      <span>{falta ?? "Enviar por WhatsApp"}</span>
    </button>
  );
}
