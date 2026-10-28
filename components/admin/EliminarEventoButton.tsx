"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { pedir } from "@/lib/servidor";

/** Borra un evento después de confirmar; si falla, lo avisa. */
export default function EliminarEventoButton({ id }: { id: string }) {
  const router = useRouter();
  const [borrando, setBorrando] = useState(false);

  async function borrar() {
    if (!confirm("¿Eliminar este evento? Esta acción no se puede deshacer.")) return;
    setBorrando(true);
    try {
      await pedir(`/api/eventos/${id}`, "DELETE");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "No se pudo eliminar.");
      setBorrando(false);
    }
  }

  return (
    <button
      type="button"
      onClick={borrar}
      disabled={borrando}
      className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-muted hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
    >
      Eliminar
    </button>
  );
}
