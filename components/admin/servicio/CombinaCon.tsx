"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Tarjeta, inputClase } from "@/components/admin/ui";
import { alternarEnLista, leerLista } from "./lista";

type Otro = { id: string; nombre: string; categoria: string };

/** Servicios que se sugieren junto a este en la ficha («Agrégale también»). */
export default function CombinaCon({
  valor,
  otros,
  onCambio,
}: {
  valor: string | null;
  otros: Otro[];
  onCambio: (valor: string | null) => void;
}) {
  const [buscaCombo, setBuscaCombo] = useState("");
  const combina = leerLista(valor);
  const toggleCombo = (id: string) => onCambio(alternarEnLista(valor, id));
  const t = buscaCombo.trim().toLowerCase();
  const otrosFiltrados = otros.filter((o) => !combina.includes(o.id) && (!t || o.nombre.toLowerCase().includes(t))).slice(0, 12);

  return (
    <Tarjeta titulo="Se combina con" ayuda="Se sugieren en la ficha como “Agrégale también”.">
      {combina.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {combina.map((id) => {
            const o = otros.find((x) => x.id === id);
            if (!o) return null;
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleCombo(id)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-neon-green/15 px-3 text-sm font-semibold text-neon-green hover:bg-red-500/15 hover:text-red-300"
                title="Quitar"
              >
                {o.nombre} <span aria-hidden>×</span>
              </button>
            );
          })}
        </div>
      )}
      <label className="relative block">
        <span className="sr-only">Buscar servicio para combinar</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
        <input
          value={buscaCombo}
          onChange={(e) => setBuscaCombo(e.target.value)}
          placeholder="Buscar servicio para agregar…"
          className={`${inputClase} pl-9`}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        {otrosFiltrados.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => toggleCombo(o.id)}
            className="inline-flex h-9 items-center rounded-lg border border-white/15 px-3 text-sm text-foreground/85 hover:border-neon-green hover:text-neon-green"
          >
            + {o.nombre}
          </button>
        ))}
      </div>
    </Tarjeta>
  );
}
