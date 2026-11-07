"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { METODOS, type CuentaPago } from "@/lib/cuentasPago";

/** Cuentas para pagar el anticipo, una tarjeta por método, con un toque para copiar cada dato. */
export default function CuentasCliente({ cuentas, textoLibre }: { cuentas: CuentaPago[]; textoLibre: string | null }) {
  if (!cuentas.length && !textoLibre) return null;
  return (
    <div>
      <h2 className="font-display text-lg font-bold">Dónde pagar</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {cuentas.map((c) => (
          <div key={c.tipo} className="rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="font-display font-bold text-neon-green">{METODOS[c.tipo].nombre}</p>
            <dl className="mt-2 flex flex-col gap-1.5">
              {METODOS[c.tipo].campos
                .filter((f) => c.datos[f.clave]?.trim())
                .map((f) => (
                  <Dato key={f.clave} etiqueta={f.etiqueta} valor={c.datos[f.clave]!} copiable={c.tipo !== "EFECTIVO"} />
                ))}
            </dl>
          </div>
        ))}
      </div>
      {textoLibre && <p className="mt-3 whitespace-pre-line rounded-xl bg-black/30 p-4 font-mono text-sm leading-relaxed">{textoLibre}</p>}
    </div>
  );
}

function Dato({ etiqueta, valor, copiable }: { etiqueta: string; valor: string; copiable: boolean }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = () =>
    navigator.clipboard
      ?.writeText(valor)
      .then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 1500);
      })
      .catch(() => {});
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <div className="min-w-0">
        <dt className="text-xs text-muted">{etiqueta}</dt>
        <dd className="break-words font-mono font-semibold">{valor}</dd>
      </div>
      {copiable && (
        <button
          type="button"
          onClick={copiar}
          aria-label={`Copiar ${etiqueta.toLowerCase()}`}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-white/15 px-2.5 text-xs font-semibold hover:border-neon-green hover:text-neon-green"
        >
          {copiado ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
          {copiado ? "Copiado" : "Copiar"}
        </button>
      )}
    </div>
  );
}
