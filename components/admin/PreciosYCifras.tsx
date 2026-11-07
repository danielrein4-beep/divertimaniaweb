"use client";

import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";
import { pedir } from "@/lib/servidor";
import { Aviso, Campo, Tarjeta, inputClase } from "@/components/admin/ui";
import { botonPrimario } from "@/components/admin/Encabezado";
import type { Cifras, Precios } from "@/lib/confianza";

type FiestaPrecios = { ruta: string; nombre: string; paquetes: string[] };

const aNumero = (v: string) => (v.trim() === "" ? null : Math.max(0, Number(v.replace(",", "."))) || null);
const aTexto = (n: number | null | undefined) => (n == null ? "" : String(n));

/** Las cifras de confianza del Inicio y el precio «desde» de cada paquete, en un solo lugar. */
export default function PreciosYCifras({ fiestas, cifrasIniciales, preciosIniciales }: { fiestas: FiestaPrecios[]; cifrasIniciales: Cifras; preciosIniciales: Precios }) {
  const [cifras, setCifras] = useState({ fiestas: aTexto(cifrasIniciales.fiestas), anios: aTexto(cifrasIniciales.anios), ciudades: aTexto(cifrasIniciales.ciudades) });
  const [precios, setPrecios] = useState<Record<string, string>>(Object.fromEntries(Object.entries(preciosIniciales).map(([k, v]) => [k, aTexto(v)])));
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  async function guardar(e: FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setAviso(null);
    try {
      await pedir("/api/ajustes", "PUT", {
        cifras: { fiestas: aNumero(cifras.fiestas), anios: aNumero(cifras.anios), ciudades: aNumero(cifras.ciudades) },
        preciosPaquetes: Object.fromEntries(Object.entries(precios).map(([k, v]) => [k, aNumero(v)])),
      });
      setAviso({ tipo: "ok", texto: "Guardado. Ya se ve en el sitio." });
    } catch (err) {
      setAviso({ tipo: "error", texto: err instanceof Error ? err.message : "No se pudo guardar." });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={guardar} className="flex flex-col gap-6">
      <Tarjeta titulo="Cifras del Inicio" ayuda="Aparecen debajo de la portada. Solo números reales; lo que dejes vacío no se muestra.">
        <div className="grid gap-4 sm:grid-cols-3">
          <Campo etiqueta="Fiestas realizadas" ayuda="Se muestra como «+800».">
            <input inputMode="numeric" value={cifras.fiestas} onChange={(e) => setCifras({ ...cifras, fiestas: e.target.value })} placeholder="800" className={`${inputClase} font-mono`} />
          </Campo>
          <Campo etiqueta="Años animando">
            <input inputMode="numeric" value={cifras.anios} onChange={(e) => setCifras({ ...cifras, anios: e.target.value })} placeholder="8" className={`${inputClase} font-mono`} />
          </Campo>
          <Campo etiqueta="Ciudades donde trabajaron">
            <input inputMode="numeric" value={cifras.ciudades} onChange={(e) => setCifras({ ...cifras, ciudades: e.target.value })} placeholder="12" className={`${inputClase} font-mono`} />
          </Campo>
        </div>
      </Tarjeta>

      <Tarjeta titulo="Precio «desde» de cada paquete" ayuda="En dólares. Vacío = la tarjeta dice «Cotización a tu medida».">
        <div className="flex flex-col divide-y divide-white/[0.07]">
          {fiestas.map((f) => (
            <div key={f.ruta} className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[160px_1fr]">
              <p className="pt-2 font-semibold">{f.nombre}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {f.paquetes.map((p) => {
                  const clave = `${f.ruta}/${p}`;
                  return (
                    <Campo key={clave} etiqueta={p}>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">US$</span>
                        <input
                          inputMode="decimal"
                          value={precios[clave] ?? ""}
                          onChange={(e) => setPrecios({ ...precios, [clave]: e.target.value })}
                          placeholder="—"
                          aria-label={`Precio desde de ${p} para ${f.nombre}`}
                          className={`${inputClase} pl-11 font-mono`}
                        />
                      </div>
                    </Campo>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Tarjeta>

      {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}
      <button type="submit" disabled={guardando} className={`${botonPrimario} self-start`}>
        {guardando && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Guardar
      </button>
    </form>
  );
}
