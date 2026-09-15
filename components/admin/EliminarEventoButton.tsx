"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EliminarEventoButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("¿Eliminar este evento? Esta acción no se puede deshacer.")) return;
    setLoading(true);
    await fetch(`/api/eventos/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:border-red-400 hover:text-red-400"
    >
      Eliminar
    </button>
  );
}
