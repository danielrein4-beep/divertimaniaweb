import { Loader2 } from "lucide-react";

/**
 * Se ve al instante al tocar otra sección del menú, mientras el servidor arma la nueva: el menú queda
 * quieto y el contenido muestra este esqueleto (antes no pasaba nada en pantalla hasta que llegaba todo).
 */
export default function CargandoSeccion() {
  return (
    <div role="status" aria-live="polite" className="animate-pulse">
      <span className="sr-only">Cargando…</span>
      <div className="mb-8 flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-neon-green" aria-hidden />
        <div className="h-7 w-48 rounded-md bg-white/[0.08]" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl border border-white/[0.06] bg-white/[0.04]" />
        ))}
      </div>
    </div>
  );
}
