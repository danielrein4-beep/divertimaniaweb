"use client";

import { Loader2 } from "lucide-react";
import { Aviso } from "@/components/admin/ui";

/** Barra fija abajo: avisa si hay cambios sin guardar y deja guardar o descartar. */
export default function BarraGuardado({
  aviso,
  cambios,
  guardando,
  onDescartar,
  onGuardar,
}: {
  aviso: { tipo: "error" | "ok"; texto: string } | null;
  cambios: boolean;
  guardando: boolean;
  onDescartar: () => void;
  onGuardar: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/95 backdrop-blur-md md:left-60">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-3 px-4 py-3 sm:px-8">
        <div className="mr-auto min-w-0 text-sm">
          {aviso ? (
            <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>
          ) : cambios ? (
            <span className="font-semibold text-gold">Tienes cambios sin guardar</span>
          ) : (
            <span className="text-muted">Todo guardado</span>
          )}
        </div>
        {cambios && (
          <button
            type="button"
            onClick={onDescartar}
            className="h-11 rounded-lg px-4 text-sm font-semibold text-foreground/80 hover:text-foreground"
          >
            Descartar
          </button>
        )}
        <button
          type="button"
          onClick={onGuardar}
          disabled={!cambios || guardando}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-neon-green px-6 text-sm font-bold text-background transition-opacity hover:bg-neon-green-dark disabled:opacity-40"
        >
          {guardando && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
