"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarCheck, Loader2, MessageCircle, RotateCcw, Send, X } from "lucide-react";
import { pedir } from "@/lib/servidor";
import { Aviso, Campo, Tarjeta, inputClase } from "@/components/admin/ui";
import { botonPrimario, botonSecundario } from "@/components/admin/Encabezado";

type Accion = "pedir-anticipo" | "confirmar" | "rechazar" | "reabrir" | "guardar";

type Props = {
  id: string;
  estado: string;
  montoAnticipo: number | null;
  montoTotal: number | null;
  notaInterna: string | null;
  eventoId: string | null;
  /** Enlace de WhatsApp con el monto y el enlace de pago, listo para mandarle al cliente. */
  whatsappCliente: string;
};

const numero = (v: string) => (v.trim() === "" ? null : Number(v.replace(",", ".")));

/** Panel de una reserva: cotizar el anticipo, mandarlo por WhatsApp, confirmar o descartar. */
export default function AccionesReserva(p: Props) {
  const router = useRouter();
  const [anticipo, setAnticipo] = useState(p.montoAnticipo?.toString() ?? "");
  const [total, setTotal] = useState(p.montoTotal?.toString() ?? "");
  const [nota, setNota] = useState(p.notaInterna ?? "");
  const [ocupado, setOcupado] = useState<Accion | null>(null);
  const [aviso, setAviso] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  async function hacer(accion: Accion, ok: string) {
    if (accion === "rechazar" && !confirm("¿Marcar esta reserva como no realizada? La fecha vuelve a quedar libre.")) return;
    setOcupado(accion);
    setAviso(null);
    try {
      await pedir(`/api/reservas/${p.id}`, "PUT", { accion, montoAnticipo: numero(anticipo), montoTotal: numero(total), notaInterna: nota || null });
      setAviso({ tipo: "ok", texto: ok });
      router.refresh();
    } catch (e) {
      setAviso({ tipo: "error", texto: e instanceof Error ? e.message : "No se pudo guardar." });
    } finally {
      setOcupado(null);
    }
  }

  const girando = (a: Accion) => ocupado === a && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />;
  const cerrada = p.estado === "CONFIRMADA" || p.estado === "RECHAZADA";

  return (
    <div className="flex flex-col gap-6">
      <Tarjeta titulo="Cotización" ayuda="El anticipo aparece en el enlace del cliente para que pague y suba el comprobante.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo etiqueta="Anticipo (US$)">
            <input inputMode="decimal" value={anticipo} onChange={(e) => setAnticipo(e.target.value)} disabled={cerrada} className={inputClase} />
          </Campo>
          <Campo etiqueta="Total cotizado (US$, opcional)">
            <input inputMode="decimal" value={total} onChange={(e) => setTotal(e.target.value)} disabled={cerrada} className={inputClase} />
          </Campo>
        </div>
        <Campo etiqueta="Nota interna" ayuda="Solo la ve el equipo.">
          <textarea rows={2} value={nota} onChange={(e) => setNota(e.target.value)} className={inputClase} />
        </Campo>
        {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}
        <div className="flex flex-wrap gap-2">
          {p.estado === "SOLICITADA" && (
            <button type="button" onClick={() => hacer("pedir-anticipo", "Listo: el cliente ya ve el monto. Avísale por WhatsApp.")} className={botonPrimario}>
              {girando("pedir-anticipo") || <Send className="h-4 w-4" aria-hidden />} Pedir anticipo
            </button>
          )}
          {(p.estado === "ESPERANDO_PAGO" || p.estado === "PAGO_REPORTADO") && (
            <a href={p.whatsappCliente} target="_blank" rel="noopener noreferrer" className={p.estado === "ESPERANDO_PAGO" ? botonPrimario : botonSecundario}>
              <MessageCircle className="h-4 w-4" aria-hidden /> Enviar monto por WhatsApp
            </a>
          )}
          {!cerrada && p.estado !== "SOLICITADA" && (
            <button type="button" onClick={() => hacer("confirmar", "Confirmada: el evento ya está en el calendario.")} className={p.estado === "PAGO_REPORTADO" ? botonPrimario : botonSecundario}>
              {girando("confirmar") || <CalendarCheck className="h-4 w-4" aria-hidden />}
              {p.estado === "PAGO_REPORTADO" ? "Pago correcto: confirmar" : "Confirmar sin comprobante"}
            </button>
          )}
          <button type="button" onClick={() => hacer("guardar", "Guardado.")} className={botonSecundario}>
            {girando("guardar")} Guardar
          </button>
          {!cerrada && (
            <button type="button" onClick={() => hacer("rechazar", "Marcada como no realizada.")} className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-muted hover:bg-red-500/10 hover:text-red-300">
              {girando("rechazar") || <X className="h-4 w-4" aria-hidden />} No se realizó
            </button>
          )}
          {p.estado === "RECHAZADA" && (
            <button type="button" onClick={() => hacer("reabrir", "Reabierta.")} className={botonSecundario}>
              {girando("reabrir") || <RotateCcw className="h-4 w-4" aria-hidden />} Reabrir
            </button>
          )}
          {p.estado === "CONFIRMADA" && p.eventoId && (
            <Link href={`/admin/eventos/${p.eventoId}`} className={botonPrimario}>
              <CalendarCheck className="h-4 w-4" aria-hidden /> Ver el evento
            </Link>
          )}
        </div>
      </Tarjeta>
    </div>
  );
}
