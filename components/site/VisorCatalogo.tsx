"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Documento = import("pdfjs-dist").PDFDocumentProxy;
type Pagina = import("pdfjs-dist").PDFPageProxy;

const RUTA_PDF = "/catalogo/pdf";
const RUTA_WORKER = "/pdfjs/pdf.worker.min.mjs";

type Enlace = { x: number; y: number; w: number; h: number; pagina: number };

/** Una página del catálogo dibujada en un lienzo (solo se pinta cuando se acerca a la pantalla). */
function PaginaLienzo({ doc, numero, onIr }: { doc: Documento; numero: number; onIr: (pagina: number) => void }) {
  const caja = useRef<HTMLDivElement>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);
  const [enlaces, setEnlaces] = useState<Enlace[]>([]);
  const [ratio, setRatio] = useState(842 / 595);
  const dibujada = useRef(false);

  useEffect(() => {
    let cancelado = false;
    const el = caja.current;
    if (!el) return;
    const dibujar = async () => {
      if (dibujada.current) return;
      dibujada.current = true;
      const pagina: Pagina = await doc.getPage(numero);
      const base = pagina.getViewport({ scale: 1 });
      const ancho = el.clientWidth;
      const escala = (ancho / base.width) * Math.min(window.devicePixelRatio || 1, 2);
      const vista = pagina.getViewport({ scale: escala });
      const c = lienzo.current;
      if (!c || cancelado) return;
      c.width = vista.width;
      c.height = vista.height;
      await pagina.render({ canvas: c, viewport: vista }).promise;
      // Los enlaces del directorio (a otra página del mismo catálogo) se vuelven zonas tocables sobre el lienzo.
      const anotaciones = await pagina.getAnnotations();
      const css = pagina.getViewport({ scale: ancho / base.width });
      const lista: Enlace[] = [];
      for (const a of anotaciones) {
        if (a.subtype !== "Link" || !a.dest) continue;
        try {
          const dest = typeof a.dest === "string" ? await doc.getDestination(a.dest) : a.dest;
          if (!dest) continue;
          const indice = await doc.getPageIndex(dest[0]);
          const [m0, m1, m2, m3, m4, m5] = css.transform;
          const aXY = (x: number, y: number): [number, number] => [m0 * x + m2 * y + m4, m1 * x + m3 * y + m5];
          const [x1, y1] = aXY(a.rect[0], a.rect[1]);
          const [x2, y2] = aXY(a.rect[2], a.rect[3]);
          lista.push({ x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), pagina: indice + 1 });
        } catch {
          /* enlace roto: se ignora */
        }
      }
      if (!cancelado) setEnlaces(lista);
    };
    const io = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          io.disconnect();
          void dibujar();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => {
      cancelado = true;
      io.disconnect();
    };
  }, [doc, numero]);

  useEffect(() => {
    let vivo = true;
    void doc.getPage(numero).then((p) => {
      const v = p.getViewport({ scale: 1 });
      if (vivo) setRatio(v.height / v.width);
    });
    return () => {
      vivo = false;
    };
  }, [doc, numero]);

  return (
    <div
      ref={caja}
      id={`pagina-${numero}`}
      data-pagina={numero}
      className="relative mx-auto w-full max-w-[860px] overflow-hidden rounded-lg bg-[#0b0b0b] shadow-xl"
      style={{ aspectRatio: `1 / ${ratio}` }}
    >
      <canvas ref={lienzo} className="block h-full w-full" aria-label={`Página ${numero} del catálogo`} role="img" />
      {enlaces.map((e, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Ir a la página ${e.pagina}`}
          onClick={() => onIr(e.pagina)}
          className="absolute cursor-pointer"
          style={{ left: e.x, top: e.y, width: e.w, height: e.h }}
        />
      ))}
    </div>
  );
}

/**
 * Visor del catálogo: se ve página por página, sin barra de herramientas, sin botón de descargar ni de imprimir y
 * sin selección ni menú de clic derecho. (Nada en un navegador es 100 % a prueba de quien quiera copiarlo, pero así
 * una visita normal solo puede mirarlo.)
 */
export default function VisorCatalogo() {
  const [doc, setDoc] = useState<Documento | null>(null);
  const [error, setError] = useState(false);
  const [actual, setActual] = useState(1);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = RUTA_WORKER;
        const d = await pdfjs.getDocument({ url: RUTA_PDF }).promise;
        if (!cancelado) setDoc(d);
      } catch {
        if (!cancelado) setError(true);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  // Página que se está viendo (para el contador).
  useEffect(() => {
    if (!doc) return;
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setActual(Number((e.target as HTMLElement).dataset.pagina));
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    document.querySelectorAll("[data-pagina]").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [doc]);

  const ir = (pagina: number) => document.getElementById(`pagina-${pagina}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div
      className="select-none px-3 pb-24 pt-4 sm:px-6 print:hidden"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <div className="sticky top-[60px] z-20 mx-auto mb-4 flex max-w-[860px] items-center justify-between gap-3 rounded-full border border-white/10 bg-background/90 px-4 py-2 backdrop-blur-md">
        <Link href="/catalogo" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-neon-green">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver al catálogo
        </Link>
        {doc && (
          <span className="text-sm tabular-nums text-muted">
            Página {actual} de {doc.numPages}
          </span>
        )}
      </div>

      {error && (
        <p className="mx-auto mt-16 max-w-md text-center text-muted">
          No pudimos abrir el catálogo en este momento. Recarga la página o escríbenos por WhatsApp y te lo mostramos.
        </p>
      )}
      {!doc && !error && <p className="mx-auto mt-16 text-center text-muted">Abriendo el catálogo…</p>}

      {doc && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: doc.numPages }, (_, i) => (
            <PaginaLienzo key={i} doc={doc} numero={i + 1} onIr={ir} />
          ))}
        </div>
      )}
    </div>
  );
}
