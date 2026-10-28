"use client";

import { FormEvent, useState } from "react";
import { pedir } from "@/lib/servidor";
import { buildWhatsAppLink, esTelefonoValido, formatTelefono, normalizarTelefono } from "@/lib/telefono";

export default function AjustesForm({ whatsappInicial }: { whatsappInicial: string }) {
  const [guardado, setGuardado] = useState(whatsappInicial);
  const [valor, setValor] = useState(formatTelefono(whatsappInicial));
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  const digitos = normalizarTelefono(valor);
  const valido = esTelefonoValido(digitos);
  const sinCambios = digitos === guardado;

  async function guardar(e: FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);
    try {
      const { config } = await pedir<{ config: { whatsapp: string } }>("/api/ajustes", "PUT", { whatsapp: valor });
      setGuardado(config.whatsapp);
      setValor(formatTelefono(config.whatsapp));
      setMensaje({ tipo: "ok", texto: "Número guardado. Ya se usa en todo el sitio." });
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
          className="rounded-lg border border-border bg-background px-3 py-2.5 text-base outline-none focus:border-neon-green"
        />
        <span className="text-xs font-normal text-muted">
          Puedes escribirlo como 0414 728 6881 o +58 414 728 6881. A este número llegan todos los mensajes del sitio:
          cotizaciones, botón flotante, contacto y fichas.
        </span>
      </label>

      {valor.trim() && (
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
      )}

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
        disabled={guardando || !valido || sinCambios}
        className="self-start rounded-full bg-neon-green px-5 py-2.5 text-sm font-bold text-background transition-colors hover:bg-neon-green-dark disabled:bg-white/10 disabled:text-muted"
      >
        {guardando ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}
