"use client";

import { useState } from "react";
import { ArrowUpRight, FileText, Globe } from "lucide-react";

type Seccion = { id: string; nombre: string; color: string; servicios: number };

/**
 * Vista previa al lado de las secciones: cómo quedan en el catálogo del sitio y el PDF real.
 * El PDF se vuelve a pedir cada vez que cambia `version` (después de guardar un cambio).
 */
export default function VistaPreviaSecciones({ secciones, version }: { secciones: Seccion[]; version: number }) {
  const [vista, setVista] = useState<"sitio" | "pdf">("sitio");
  const visibles = secciones.filter((s) => s.servicios > 0);

  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-background-card xl:sticky xl:top-6">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-2.5">
        <h2 className="text-[15px] font-bold">Vista previa</h2>
        <div role="tablist" aria-label="Qué ver" className="flex rounded-lg border border-white/10 p-0.5">
          <Pestana activa={vista === "sitio"} onClick={() => setVista("sitio")} icono={<Globe className="h-3.5 w-3.5" aria-hidden />}>
            En el sitio
          </Pestana>
          <Pestana activa={vista === "pdf"} onClick={() => setVista("pdf")} icono={<FileText className="h-3.5 w-3.5" aria-hidden />}>
            En el PDF
          </Pestana>
        </div>
      </div>

      {vista === "sitio" ? (
        <div className="flex flex-col gap-6 bg-background p-5" role="tabpanel">
          <p className="text-xs text-muted">Así aparecen en el catálogo, de arriba hacia abajo. Las secciones sin servicios no se muestran.</p>
          {visibles.length === 0 && <p className="text-sm text-muted">Todavía no hay secciones con servicios.</p>}
          {visibles.map((s) => (
            <div key={s.id} className="border-b border-white/10 pb-3">
              <span className="mb-2 block h-1 w-10 rounded-full" style={{ background: s.color }} aria-hidden />
              <div className="flex items-end justify-between gap-3">
                <p className="font-display text-xl font-extrabold leading-tight">{s.nombre}</p>
                <p className="font-mono text-xs tabular-nums text-muted">{s.servicios}</p>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-2 border-t border-white/[0.07] pt-4">
            {visibles.map((s) => (
              <span key={s.id} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} aria-hidden />
                {s.nombre}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div role="tabpanel" className="flex flex-col">
          {/* En el teléfono el navegador no muestra PDF dentro de la página: se abre aparte. */}
          <iframe
            key={version}
            src="/catalogo/pdf#toolbar=0&navpanes=0&view=FitH"
            title="Vista previa del catálogo PDF"
            className="hidden h-[640px] w-full bg-white md:block"
          />
          <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] px-4 py-3">
            <p className="text-xs text-muted">Se actualiza solo con cada cambio que guardas.</p>
            <a
              href="/catalogo/pdf"
              target="_blank"
              rel="noopener"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-neon-green hover:underline"
            >
              Abrir el PDF <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

function Pestana({ activa, onClick, icono, children }: { activa: boolean; onClick: () => void; icono: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={activa}
      onClick={onClick}
      className={`inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-colors ${
        activa ? "bg-neon-green/15 text-neon-green" : "text-foreground/60 hover:text-foreground"
      }`}
    >
      {icono}
      {children}
    </button>
  );
}
