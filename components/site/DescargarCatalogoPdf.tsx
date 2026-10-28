import { Download, FileText } from "lucide-react";

/** Catálogo: ver o descargar el PDF que se arma solo con lo que hay en el panel. */
export default function DescargarCatalogoPdf() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <div className="flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <FileText className="mt-1 h-8 w-8 shrink-0 text-neon-green" aria-hidden />
          <div>
            <h2 className="font-display text-xl font-bold">¿Lo prefieres en PDF?</h2>
            <p className="text-sm text-muted">El catálogo completo para verlo con calma o reenviarlo por WhatsApp.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="/catalogo/pdf"
            target="_blank"
            rel="noopener"
            className="touch-target rounded-full border border-white/20 px-5 text-sm font-semibold transition-colors hover:border-neon-green hover:text-neon-green"
          >
            Ver PDF
          </a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- es un archivo PDF, no una página */}
          <a
            href="/catalogo/pdf?descargar"
            className="touch-target gap-2 rounded-full bg-neon-green px-5 text-sm font-bold text-background transition-colors hover:bg-neon-green-dark"
          >
            <Download className="h-4 w-4" aria-hidden />
            Descargar
          </a>
        </div>
      </div>
    </section>
  );
}
