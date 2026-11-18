"use client";

import { FormEvent, useState } from "react";
import { pedir } from "@/lib/servidor";
import { buildWhatsAppLink, esTelefonoValido, formatTelefono, normalizarTelefono } from "@/lib/telefono";

const CLASE_INPUT = "rounded-lg border border-border bg-background px-3 py-2.5 text-base outline-none focus:border-neon-green";

function Vista({ digitos, valido }: { digitos: string; valido: boolean }) {
  return (
    <p className={`text-sm ${valido ? "text-muted" : "text-red-300"}`}>
      {valido ? (
        <>
          Se guardará como <strong className="text-foreground">{formatTelefono(digitos)}</strong> ·{" "}
          <a
            href={buildWhatsAppLink(digitos, "Prueba desde el panel de Divertimania")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-green hover:underline"
          >
            Probar en WhatsApp
          </a>
        </>
      ) : (
        "Falta el número completo con código de país."
      )}
    </p>
  );
}

export default function AjustesForm({ whatsappInicial, whatsapp2Inicial }: { whatsappInicial: string; whatsapp2Inicial: string }) {
  const [guardado, setGuardado] = useState(whatsappInicial);
  const [guardado2, setGuardado2] = useState(whatsapp2Inicial);
  const [valor, setValor] = useState(formatTelefono(whatsappInicial));
  const [valor2, setValor2] = useState(whatsapp2Inicial ? formatTelefono(whatsapp2Inicial) : "");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  const digitos = normalizarTelefono(valor);
  const valido = esTelefonoValido(digitos);
  const digitos2 = valor2.trim() ? normalizarTelefono(valor2) : "";
  const valido2 = digitos2 === "" || esTelefonoValido(digitos2);
  const sinCambios = digitos === guardado && digitos2 === guardado2;

  async function guardar(e: FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);
    try {
      const { config } = await pedir<{ config: { whatsapp: string; whatsapp2: string | null } }>("/api/ajustes", "PUT", {
        whatsapp: valor,
        whatsapp2: valor2,
      });
      setGuardado(config.whatsapp);
      setGuardado2(config.whatsapp2 ?? "");
      setValor(formatTelefono(config.whatsapp));
      setValor2(config.whatsapp2 ? formatTelefono(config.whatsapp2) : "");
      setMensaje({ tipo: "ok", texto: "Números guardados. Ya se usan en todo el sitio." });
    } catch (err) {
      setMensaje({ tipo: "error", texto: err instanceof Error ? err.message : "No se pudo guardar." });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={guardar} className="border border-white/10 bg-background-card flex flex-col gap-4 rounded-xl p-6">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Número de WhatsApp para cotizaciones
        <input
          type="tel"
          inputMode="tel"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="+58 414-728-6881"
          className={CLASE_INPUT}
        />
        <span className="text-xs font-normal text-muted">
          Puedes escribirlo como 0414 728 6881 o +58 414 728 6881. Si hay dos números, quien visita el sitio elige a
          cuál escribir.
        </span>
      </label>
      {valor.trim() && <Vista digitos={digitos} valido={valido} />}

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Segundo número de WhatsApp (opcional)
        <input
          type="tel"
          inputMode="tel"
          value={valor2}
          onChange={(e) => setValor2(e.target.value)}
          placeholder="+58 424-743-5744"
          className={CLASE_INPUT}
        />
        <span className="text-xs font-normal text-muted">
          Se ofrece junto al primero en todos los botones de WhatsApp, en el contacto y en el pie de página. Déjalo
          vacío para usar solo uno.
        </span>
      </label>
      {valor2.trim() && <Vista digitos={digitos2} valido={valido2} />}

      {mensaje && (
        <p
          role="status"
          className={`rounded-lg px-3 py-2 text-sm ${
            mensaje.tipo === "ok" ? "bg-neon-green/10 text-neon-green" : "bg-red-500/10 text-red-300"
          }`}
        >
          {mensaje.texto}
        </p>
      )}

      <button
        type="submit"
        disabled={guardando || !valido || !valido2 || sinCambios}
        className="self-start rounded-full bg-neon-green px-5 py-2.5 text-sm font-bold text-background transition-colors hover:bg-neon-green-dark disabled:bg-white/10 disabled:text-muted"
      >
        {guardando ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}
