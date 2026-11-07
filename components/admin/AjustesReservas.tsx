"use client";

import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";
import { pedir } from "@/lib/servidor";
import { METODOS, type CuentaPago } from "@/lib/cuentasPago";
import { Aviso, Campo, Interruptor, Tarjeta, inputClase } from "@/components/admin/ui";
import { botonPrimario } from "@/components/admin/Encabezado";

/**
 * Ajustes de reservas que llenan los propios dueños: sus cuentas por método de pago (cada una
 * se enciende o apaga) y el tope de fiestas por día.
 */
export default function AjustesReservas({
  cuentasIniciales,
  textoAnterior,
  eventosPorDiaInicial,
}: {
  cuentasIniciales: CuentaPago[];
  textoAnterior: string | null;
  eventosPorDiaInicial: number;
}) {
  const [cuentas, setCuentas] = useState(cuentasIniciales);
  const [eventosPorDia, setEventosPorDia] = useState(eventosPorDiaInicial);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  const cambiar = (tipo: CuentaPago["tipo"], cambio: Partial<CuentaPago>) =>
    setCuentas((prev) => prev.map((c) => (c.tipo === tipo ? { ...c, ...cambio } : c)));
  const cambiarDato = (c: CuentaPago, clave: string, valor: string) => cambiar(c.tipo, { datos: { ...c.datos, [clave]: valor } });

  async function guardar(e: FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setAviso(null);
    try {
      await pedir("/api/ajustes", "PUT", { cuentasPago: cuentas, eventosPorDia });
      setAviso({ tipo: "ok", texto: "Guardado. Los clientes ya ven estas cuentas cuando les pides el anticipo." });
    } catch (err) {
      setAviso({ tipo: "error", texto: err instanceof Error ? err.message : "No se pudo guardar." });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Tarjeta titulo="Cuentas para cobrar" ayuda="Enciende los métodos que aceptas y llena sus datos. El cliente los ve en su reserva, con un botón para copiar cada dato.">
      <form onSubmit={guardar} className="flex flex-col gap-4">
        {textoAnterior && (
          <Aviso tipo="error">
            Antes había estos datos escritos a mano; pásalos a los métodos de abajo y guarda: <span className="whitespace-pre-line">{textoAnterior}</span>
          </Aviso>
        )}

        {cuentas.map((c) => {
          const metodo = METODOS[c.tipo];
          return (
            <div key={c.tipo} className={`rounded-xl border ${c.activo ? "border-neon-green/35" : "border-white/10"}`}>
              <Interruptor titulo={metodo.nombre} ayuda={c.activo ? "Se muestra al cliente" : "Apagado"} activo={c.activo} onCambio={(v) => cambiar(c.tipo, { activo: v })} />
              {c.activo && (
                <div className="grid gap-3 border-t border-white/[0.07] p-4 sm:grid-cols-2">
                  {metodo.campos.map((f) => (
                    <Campo key={f.clave} etiqueta={f.etiqueta}>
                      <input value={c.datos[f.clave] ?? ""} onChange={(e) => cambiarDato(c, f.clave, e.target.value)} placeholder={f.ejemplo} maxLength={120} className={inputClase} />
                    </Campo>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <Campo etiqueta="Fiestas por día" ayuda="Con este número la web dice si una fecha está libre, con un solo cupo o completa.">
          <input type="number" min={1} max={30} value={eventosPorDia} onChange={(e) => setEventosPorDia(Number(e.target.value))} className={`${inputClase} w-28 font-mono`} />
        </Campo>
        {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}
        <button type="submit" disabled={guardando} className={`${botonPrimario} self-start`}>
          {guardando && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Guardar
        </button>
      </form>
    </Tarjeta>
  );
}
