"use client";

import Link from "next/link";

/** Si una página del sitio falla al cargar, se muestra esto en vez de una pantalla en blanco. */
export default function ErrorDelSitio({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-5 px-4 text-center">
      <h1 className="font-display text-2xl font-bold">Algo no cargó bien</h1>
      <p className="text-muted">Puede ser la conexión. Intenta de nuevo; si sigue igual, escríbenos por WhatsApp con el botón verde.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="touch-target rounded-full bg-neon-green px-6 text-sm font-bold text-background">
          Intentar de nuevo
        </button>
        <Link href="/" className="touch-target rounded-full border border-white/20 px-6 text-sm font-semibold hover:border-neon-green hover:text-neon-green">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
