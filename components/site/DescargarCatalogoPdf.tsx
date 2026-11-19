import Link from "next/link";
import { BookOpen, FileText } from "lucide-react";

/** Catálogo completo para ver (solo ver: no se puede descargar). */
export default function DescargarCatalogoPdf() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <div className="flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <FileText className="mt-1 h-8 w-8 shrink-0 text-neon-green" aria-hidden />
          <div>
            <h2 className="font-display text-xl font-bold">¿Lo prefieres en formato catálogo?</h2>
            <p className="text-sm text-muted">Todos los personajes y servicios, una ficha por una y con su foto, para verlos con calma.</p>
          </div>
        </div>
        <Link
          href="/catalogo/ver"
          className="touch-target gap-2 rounded-full bg-neon-green px-5 text-sm font-bold text-background transition-colors hover:bg-neon-green-dark"
        >
          <BookOpen className="h-4 w-4" aria-hidden />
          Ver catálogo completo
        </Link>
      </div>
    </section>
  );
}
