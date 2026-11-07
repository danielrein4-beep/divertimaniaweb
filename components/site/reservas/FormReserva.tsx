"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarCheck, Loader2, Plus } from "lucide-react";
import { useMiFiesta } from "@/context/MiFiestaContext";
import EventoFormFields from "@/components/mifiesta/EventoFormFields";
import { primerCampoFaltante } from "@/lib/miFiesta";
import { todayStr } from "@/lib/date";
import { pedir } from "@/lib/servidor";

type EstadoFecha = "libre" | "pocas" | "completa" | "pasada" | null;

const AVISO_FECHA: Record<Exclude<EstadoFecha, null>, { texto: string; clase: string }> = {
  libre: { texto: "Fecha disponible", clase: "text-neon-green" },
  pocas: { texto: "Queda un solo cupo ese día: apártala pronto", clase: "text-gold" },
  completa: { texto: "Esa fecha está completa. Elige otra o escríbenos por WhatsApp.", clase: "text-red-300" },
  pasada: { texto: "Esa fecha ya pasó.", clase: "text-red-300" },
};

/** Apartar fecha: los datos del evento de «Mi fiesta», el correo, y la fecha validada contra el calendario. */
export default function FormReserva() {
  const router = useRouter();
  const { items, formData } = useMiFiesta();
  const [email, setEmail] = useState("");
  const [estadoFecha, setEstadoFecha] = useState<EstadoFecha>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  // Cada vez que cambia la fecha, se consulta si quedan cupos ese día.
  useEffect(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.fecha)) return;
    const control = new AbortController();
    pedir<{ estado: EstadoFecha }>(`/api/reservas/disponibilidad?fecha=${formData.fecha}`, "GET", undefined, { signal: control.signal })
      .then((r) => setEstadoFecha(r.estado))
      .catch(() => {});
    return () => control.abort();
  }, [formData.fecha]);

  const falta = primerCampoFaltante(formData, todayStr()) ?? (formData.telefono.replace(/\D/g, "").length < 7 ? "Escribe tu teléfono" : null);
  const fechaOk = estadoFecha !== "completa" && estadoFecha !== "pasada";
  const aviso = formData.fecha && estadoFecha ? AVISO_FECHA[estadoFecha] : null;

  async function apartar() {
    setEnviando(true);
    setError("");
    try {
      const { token } = await pedir<{ token: string }>("/api/reservas", "POST", {
        fecha: formData.fecha,
        horaInicio: formData.horaInicio,
        tipoEvento: formData.tipoEvento,
        zona: formData.zona,
        lugar: formData.lugar,
        invitados: formData.invitados,
        nombre: formData.nombre,
        telefono: formData.telefono,
        email,
        comentarios: [
          formData.cumpleaneroNombre && `Cumpleañero: ${formData.cumpleaneroNombre}${formData.cumpleaneroEdad ? `, ${formData.cumpleaneroEdad} años` : ""}`,
          formData.comentarios,
        ]
          .filter(Boolean)
          .join(". "),
        servicios: items.map((i) => ({ servicioId: i.servicioId, nombre: i.nombre, variante: i.variante ?? null })),
      });
      router.push(`/reserva/${token}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo apartar la fecha.");
      setEnviando(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
        <EventoFormFields telefonoObligatorio />
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold">Correo (opcional)</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Para enviarte la confirmación"
            className="rounded-xl border border-white/15 bg-background px-4 py-3 text-base outline-none focus:border-neon-green"
          />
        </label>
        {aviso && <p className={`text-sm font-semibold ${aviso.clase}`}>{aviso.texto}</p>}
        {error && (
          <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={apartar}
          disabled={Boolean(falta) || !fechaOk || enviando}
          className="touch-target w-full gap-2 rounded-full bg-neon-green px-6 py-3.5 text-base font-bold text-background transition-colors hover:bg-neon-green-dark disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-muted"
        >
          {enviando ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <CalendarCheck className="h-5 w-5" aria-hidden />}
          {falta ?? "Apartar mi fecha"}
        </button>
        <p className="text-center text-xs text-muted">Apartar no cobra nada todavía: te enviamos la cotización y el monto del anticipo.</p>
      </div>

      <aside className="flex h-fit flex-col gap-4 rounded-2xl border border-white/10 p-5">
        <h2 className="font-display text-lg font-bold">Tu fiesta</h2>
        {items.length === 0 ? (
          <p className="text-sm text-muted">Todavía no elegiste servicios. Puedes apartar la fecha igual y te asesoramos.</p>
        ) : (
          <ul className="flex flex-col gap-2 text-sm">
            {items.map((i) => (
              <li key={i.id} className="border-b border-white/[0.07] pb-2 last:border-0">
                <span className="font-semibold">{i.nombre}</span>
                {i.variante && <span className="block text-xs text-muted">{i.variante}</span>}
              </li>
            ))}
          </ul>
        )}
        <Link href="/catalogo" className="inline-flex items-center gap-1.5 text-sm font-semibold text-neon-green hover:underline">
          <Plus className="h-4 w-4" aria-hidden /> Agregar servicios
        </Link>
      </aside>
    </div>
  );
}
