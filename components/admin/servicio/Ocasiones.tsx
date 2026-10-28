"use client";

import { Check } from "lucide-react";
import { OCASIONES } from "@/lib/ocasiones";
import { Tarjeta } from "@/components/admin/ui";
import { alternarEnLista, leerLista } from "./lista";

/** Ocasiones para las que sirve el servicio (filtro del catálogo por ocasión). */
export default function Ocasiones({ valor, onCambio }: { valor: string | null; onCambio: (valor: string | null) => void }) {
  const ocasiones = leerLista(valor);
  const toggleOcasion = (slug: string) => onCambio(alternarEnLista(valor, slug));
  return (
    <Tarjeta titulo="¿Para qué ocasiones sirve?" ayuda="Aparece cuando el cliente filtra el catálogo por ocasión.">
      <div className="flex flex-wrap gap-2">
        {OCASIONES.map((o) => {
          const on = ocasiones.includes(o.slug);
          return (
            <button
              key={o.slug}
              type="button"
              aria-pressed={on}
              onClick={() => toggleOcasion(o.slug)}
              className={`inline-flex h-10 items-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-colors ${
                on ? "border-neon-green bg-neon-green/15 text-neon-green" : "border-white/15 text-foreground/80 hover:border-white/35"
              }`}
            >
              {on && <Check className="h-4 w-4" aria-hidden />}
              {o.nombre}
            </button>
          );
        })}
      </div>
    </Tarjeta>
  );
}
