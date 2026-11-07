"use client";

import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";
import { pedir } from "@/lib/servidor";
import { Aviso, Campo, Tarjeta, inputClase } from "@/components/admin/ui";
import { botonPrimario } from "@/components/admin/Encabezado";

/** Ajustes de reservas: las cuentas para el anticipo y el tope de fiestas por día. */
export default function AjustesReservas({ datosPagoInicial, eventosPorDiaInicial }: { datosPagoInicial: string; eventosPorDiaInicial: number }) {
  const [datosPago, setDatosPago] = useState(datosPagoInicial);
  const [eventosPorDia, setEventosPorDia] = useState(eventosPorDiaInicial);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  async function guardar(e: FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setAviso(null);
    try {
      await pedir("/api/ajustes", "PUT", { datosPago: datosPago.trim() || null, eventosPorDia });
      setAviso({ tipo: "ok", texto: "Guardado. Los clientes ya ven estos datos en su reserva." });
    } catch (err) {
      setAviso({ tipo: "error", texto: err instanceof Error ? err.message : "No se pudo guardar." });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Tarjeta titulo="Reservas y anticipo" ayuda="Lo que ve el cliente cuando le pides el anticipo, y cuántas fiestas se aceptan por día.">
      <form onSubmit={guardar} className="flex flex-col gap-4">
        <Campo etiqueta="Dónde pagar el anticipo" ayuda="Pago móvil, transferencia, Zelle, Binance… Se muestra tal cual en la página de la reserva.">
          <textarea
            rows={5}
            value={datosPago}
            onChange={(e) => setDatosPago(e.target.value)}
            placeholder={"Pago móvil: Banco ___ · 0414-___ · C.I. V-___\nZelle: ___@___.com (a nombre de ___)"}
            className={`${inputClase} font-mono text-sm`}
          />
        </Campo>
        <Campo etiqueta="Fiestas por día" ayuda="Con este número la web dice si una fecha está libre, con un solo cupo o completa.">
          <input
            type="number"
            min={1}
            max={30}
            value={eventosPorDia}
            onChange={(e) => setEventosPorDia(Number(e.target.value))}
            className={`${inputClase} w-28 font-mono`}
          />
        </Campo>
        {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}
        <button type="submit" disabled={guardando} className={`${botonPrimario} self-start`}>
          {guardando && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Guardar
        </button>
      </form>
    </Tarjeta>
  );
}
