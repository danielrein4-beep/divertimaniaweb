"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "No se pudo enviar tu mensaje");
      }

      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Ocurrió un error");
    }
  }

  if (status === "ok") {
    return (
      <div className="card-glass rounded-2xl p-8 text-center">
        <p className="text-lg font-semibold text-neon-green">¡Mensaje enviado!</p>
        <p className="mt-2 text-muted">
          Te contactaremos pronto. Si prefieres una respuesta inmediata, escríbenos por WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-glass flex flex-col gap-4 rounded-2xl p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Nombre*
          <input
            name="nombre"
            required
            minLength={2}
            className="rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-neon-green"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Teléfono / WhatsApp*
          <input
            name="telefono"
            required
            minLength={6}
            className="rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-neon-green"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Email (opcional)
          <input
            name="email"
            type="email"
            className="rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-neon-green"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Fecha del evento (opcional)
          <input
            name="fechaDeseada"
            type="date"
            className="rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-neon-green"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Cuéntanos sobre tu evento*
        <textarea
          name="mensaje"
          required
          minLength={5}
          rows={4}
          className="resize-none rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-neon-green"
        />
      </label>

      {status === "error" && <p className="text-sm text-red-400">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-neon-green px-6 py-3 font-semibold text-background transition-transform hover:scale-105 disabled:opacity-60"
      >
        {status === "loading" ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
