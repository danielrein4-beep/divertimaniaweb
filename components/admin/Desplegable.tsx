"use client";

import { useState, type ReactNode } from "react";
import { Plus, X } from "lucide-react";
import { botonPrimario } from "@/components/admin/Encabezado";

/** Formulario de «agregar» plegado detrás de un botón: la lista queda primero y el formulario aparece al pedirlo. */
export default function Desplegable({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  const [abierto, setAbierto] = useState(false);

  if (!abierto) {
    return (
      <div className="flex justify-end">
        <button type="button" onClick={() => setAbierto(true)} className={botonPrimario}>
          <Plus className="h-4 w-4" aria-hidden /> {etiqueta}
        </button>
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-neon-green/30 bg-background-elevated">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3">
        <h2 className="text-sm font-bold">{etiqueta}</h2>
        <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar" className="rounded-md p-1.5 text-muted hover:bg-white/10 hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
