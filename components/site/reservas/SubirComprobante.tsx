"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";

/** El cliente indica cómo pagó, la referencia y sube la captura del pago. */
export default function SubirComprobante({ token, metodos, yaReportado }: { token: string; metodos: readonly string[]; yaReportado: boolean }) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [nombreArchivo, setNombreArchivo] = useState("");

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    setError("");
    try {
      const res = await fetch(`/api/reservas/cliente/${token}/pago`, { method: "POST", body: new FormData(e.currentTarget) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "No se pudo enviar.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sin conexión. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  const campo = "rounded-xl border border-white/15 bg-background px-4 py-3 text-base outline-none focus:border-neon-green";
  return (
    <form onSubmit={enviar} className="flex flex-col gap-4">
      <h3 className="font-display text-lg font-bold">{yaReportado ? "¿Te equivocaste? Envía el comprobante de nuevo" : "Reporta tu pago"}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold">Cómo pagaste</span>
          <select name="metodoPago" required defaultValue="" className={campo}>
            <option value="" disabled>
              Elige
            </option>
            {metodos.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold">Referencia</span>
          <input name="referenciaPago" required minLength={3} maxLength={80} placeholder="Número de referencia" className={campo} />
        </label>
      </div>
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-white/20 p-6 text-center text-sm hover:border-neon-green">
        <Upload className="h-6 w-6 text-neon-green" aria-hidden />
        <span className="font-semibold">{nombreArchivo || "Toca para subir la captura del pago"}</span>
        <span className="text-xs text-muted">JPG, PNG o WEBP, hasta 10 MB</span>
        <input
          type="file"
          name="comprobante"
          accept="image/*"
          required
          className="sr-only"
          onChange={(e) => setNombreArchivo(e.target.files?.[0]?.name ?? "")}
        />
      </label>
      {error && (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={enviando}
        className="touch-target gap-2 rounded-full bg-neon-green px-6 py-3.5 text-base font-bold text-background hover:bg-neon-green-dark disabled:opacity-60"
      >
        {enviando && <Loader2 className="h-5 w-5 animate-spin" aria-hidden />}
        Enviar comprobante
      </button>
    </form>
  );
}
