"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import ServicioCard from "@/components/ui/ServicioCard";
import { CATEGORIAS } from "@/lib/site";
import { getNoEncontradoWhatsAppLink, getAsesoriaWhatsAppLink } from "@/lib/whatsapp";
import { OCASIONES, getOcasion } from "@/lib/ocasiones";

export type ServicioCatalogo = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  fotoUrl: string | null;
  videoUrl: string | null;
  posterUrl: string | null;
  edadIdeal: string | null;
  duracion: string | null;
  masPedido: boolean;
  soloAdultos: boolean;
  ocasiones: string[];
  tieneOpciones: boolean;
};

const MAX_POR_CATEGORIA = 4;
const CATEGORIA_ADULTOS = "Show para Adultos";

function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function syncUrl(params: { categoria: string | null; ocasion: string | null }) {
  const url = new URL(window.location.href);
  url.searchParams.delete("q");
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  window.history.replaceState(null, "", url);
}

export default function CatalogoExplorer({
  servicios,
  categoriaInicial,
  ocasionInicial,
  busquedaInicial,
}: {
  servicios: ServicioCatalogo[];
  categoriaInicial: string | null;
  ocasionInicial: string | null;
  busquedaInicial: string;
}) {
  const [categoria, setCategoria] = useState<string | null>(
    CATEGORIAS.includes(categoriaInicial as (typeof CATEGORIAS)[number]) ? categoriaInicial : null
  );
  const [ocasion, setOcasion] = useState<string | null>(getOcasion(ocasionInicial)?.slug ?? null);
  const [busqueda, setBusqueda] = useState(busquedaInicial);

  const elegirCategoria = (c: string | null) => {
    setCategoria(c);
    syncUrl({ categoria: c, ocasion });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const elegirOcasion = (o: string | null) => {
    setOcasion(o);
    syncUrl({ categoria, ocasion: o });
  };

  const termino = normalizar(busqueda.trim());
  const buscando = termino.length > 0;

  const filtrados = useMemo(
    () =>
      servicios.filter((s) => {
        // El contenido +18 solo aparece dentro de su categoría, nunca en "Todas" ni en la búsqueda.
        if (s.soloAdultos && (categoria !== CATEGORIA_ADULTOS || buscando)) return false;
        if (!buscando && categoria && s.categoria !== categoria) return false;
        if (ocasion && !s.ocasiones.includes(ocasion)) return false;
        if (buscando) return normalizar(`${s.nombre} ${s.descripcion} ${s.categoria}`).includes(termino);
        return true;
      }),
    [servicios, categoria, ocasion, buscando, termino]
  );

  const porCategoria = useMemo(
    () =>
      CATEGORIAS.map((c) => ({ categoria: c, items: filtrados.filter((s) => s.categoria === c) })).filter(
        (g) => g.items.length > 0
      ),
    [filtrados]
  );

  const ocasionActual = getOcasion(ocasion);
  const vistaAgrupada = !buscando && !categoria;

  return (
    <div className="pb-24">
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
        <h1 className="type-h1 font-display font-extrabold">
          {ocasionActual ? `Para ${ocasionActual.nombre.toLowerCase()}` : "Catálogo"}
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          Toca el <strong className="text-foreground">+</strong> en lo que te guste y arma tu fiesta. Al final te
          cotizamos todo junto por WhatsApp.
        </p>

        <label className="relative mt-6 block max-w-xl">
          <span className="sr-only">Buscar en el catálogo</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Busca un personaje o show: Mario, Frozen, espuma…"
            className="w-full rounded-full border border-border bg-background-card py-3.5 pl-12 pr-12 text-base outline-none transition-colors placeholder:text-muted/70 focus:border-neon-green"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda("")}
              aria-label="Borrar búsqueda"
              className="touch-target absolute right-1 top-1/2 -translate-y-1/2 rounded-full text-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </label>
      </div>

      {/* Pestañas de categoría: fijas bajo el menú, una sola línea con scroll horizontal */}
      <div className="sticky top-[60px] z-30 mt-6 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="scrollbar-none mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6" role="tablist" aria-label="Categorías">
          {[null, ...CATEGORIAS].map((c) => {
            const activa = !buscando && categoria === c;
            return (
              <button
                key={c ?? "todas"}
                type="button"
                role="tab"
                aria-selected={activa}
                onClick={() => {
                  setBusqueda("");
                  elegirCategoria(c);
                }}
                className={`touch-target shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${
                  activa
                    ? "border-neon-green bg-neon-green text-background"
                    : "border-border text-foreground/80 hover:border-white/25 hover:text-foreground"
                }`}
              >
                {c ?? "Todo"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Ocasión */}
        <div className="scrollbar-none -mx-4 mt-4 flex items-center gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted">Ocasión:</span>
          {OCASIONES.map((o) => {
            const activa = ocasion === o.slug;
            return (
              <button
                key={o.slug}
                type="button"
                aria-pressed={activa}
                onClick={() => elegirOcasion(activa ? null : o.slug)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  activa ? "border-neon-green text-neon-green" : "border-border text-muted hover:text-foreground"
                }`}
              >
                {o.nombre}
                {activa && <X className="ml-1 inline h-3 w-3" aria-hidden />}
              </button>
            );
          })}
        </div>

        {filtrados.length === 0 ? (
          <div className="mx-auto mt-16 flex max-w-md flex-col items-center gap-4 text-center">
            <h2 className="type-h3 font-bold">
              {buscando ? `No encontramos “${busqueda.trim()}”` : "Nada por aquí con ese filtro"}
            </h2>
            <p className="text-muted">
              Igual pregúntanos: muchas veces lo armamos a la medida aunque no esté en el catálogo.
            </p>
            <a
              href={buscando ? getNoEncontradoWhatsAppLink(busqueda.trim()) : getAsesoriaWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target rounded-full bg-neon-green px-6 text-sm font-bold text-background"
            >
              Preguntar por WhatsApp
            </a>
          </div>
        ) : vistaAgrupada ? (
          <div className="mt-8 flex flex-col gap-14">
            {porCategoria.map(({ categoria: c, items }, gi) => (
              <section key={c} aria-labelledby={`cat-${c}`}>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <h2 id={`cat-${c}`} className="type-h2 font-display font-extrabold">
                    {c}
                  </h2>
                  {items.length > MAX_POR_CATEGORIA && (
                    <button
                      type="button"
                      onClick={() => elegirCategoria(c)}
                      className="shrink-0 text-sm font-semibold text-neon-green hover:underline"
                    >
                      Ver los {items.length} →
                    </button>
                  )}
                </div>
                <Grid items={items.slice(0, MAX_POR_CATEGORIA)} priority={gi === 0} />
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <p className="mb-4 text-sm text-muted">
              {filtrados.length} {filtrados.length === 1 ? "opción" : "opciones"}
              {buscando ? ` para “${busqueda.trim()}”` : ""}
            </p>
            <Grid items={filtrados} priority />
          </div>
        )}

        <div className="mt-20 flex flex-col items-center gap-4 rounded-3xl border border-border bg-background-elevated px-6 py-10 text-center">
          <h2 className="type-h3 font-bold">¿No sabes qué elegir?</h2>
          <p className="max-w-md text-muted">Cuéntanos de tu evento y te recomendamos el combo ideal.</p>
          <a
            href={getAsesoriaWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-target rounded-full border border-neon-green/60 px-6 text-sm font-bold text-neon-green transition-colors hover:bg-neon-green/10"
          >
            Pedir recomendación por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function Grid({ items, priority = false }: { items: ServicioCatalogo[]; priority?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {items.map((s, i) => (
        <ServicioCard key={s.id} {...s} priority={priority && i < 2} />
      ))}
    </div>
  );
}
