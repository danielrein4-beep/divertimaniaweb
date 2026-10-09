"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import ServicioCard from "@/components/ui/ServicioCard";
import HandDrawnUnderline from "@/components/ui/HandDrawnUnderline";
import CatalogoPortada from "@/components/site/CatalogoPortada";
import { CATEGORIAS, PERFIL_IG } from "@/lib/site";
import { MENSAJES_WHATSAPP } from "@/lib/whatsapp";
import { useWhatsApp } from "@/components/site/SitioConfigProvider";
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
/** Alto del menú fijo de arriba (la barra de categorías se pega en top-[60px]). */
const ALTO_MENU = 60;

const COLOR_CATEGORIA: Record<string, string> = {
  "Fiestas Infantiles": "var(--cat-infantil)",
  "Baby Shower": "var(--cat-babyshower)",
  Personajes: "var(--cat-personajes)",
  "Show para Adultos": "var(--cat-adultos)",
  "Estación Creativa": "var(--cat-creativa)",
  Atracciones: "var(--cat-atracciones)",
};

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
  const whatsapp = useWhatsApp();

  // Marca dónde empieza la barra de categorías (la barra misma es sticky y no sirve de referencia).
  const inicioListado = useRef<HTMLDivElement>(null);

  const elegirCategoria = (c: string | null) => {
    setCategoria(c);
    syncUrl({ categoria: c, ocasion });
    // Si ya bajó más allá de la barra, se vuelve justo a ella (no hasta la cabecera);
    // si todavía está en la cabecera, no se mueve.
    const marca = inicioListado.current;
    if (!marca) return;
    const destino = marca.getBoundingClientRect().top + window.scrollY - ALTO_MENU;
    if (window.scrollY > destino) {
      const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: destino, behavior: suave ? "smooth" : "auto" });
    }
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

  // "Todo" no cuenta lo +18, igual que el listado.
  const totalVisible = servicios.filter((s) => !s.soloAdultos).length;
  const portada = useMemo(
    () =>
      servicios
        .filter((s) => s.fotoUrl && !s.soloAdultos)
        .sort((a, b) => Number(b.masPedido) - Number(a.masPedido))
        .slice(0, 3),
    [servicios]
  );

  const ocasionActual = getOcasion(ocasion);
  const vistaAgrupada = !buscando && !categoria;

  return (
    <div className="pb-24">
      <header className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.15fr_0.85fr] lg:pt-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neon-green">Catálogo · Táchira</p>
          <h1 className="type-display mt-3 font-display font-extrabold">
            {ocasionActual ? (
              `Para ${ocasionActual.nombre.toLowerCase()}`
            ) : (
              <>
                Arma tu{" "}
                <span className="relative inline-block">
                  fiesta
                  <HandDrawnUnderline className="absolute -bottom-2 left-0 w-full text-neon-green" width={220} />
                </span>
              </>
            )}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-foreground/80">
            Personajes, shows y atracciones con el equipo de Divertimania. Elige lo que te guste y te cotizamos todo
            junto por WhatsApp.
          </p>

          <ol className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/85">
            {["Elige", "Toca Agregar", "Te cotizamos por WhatsApp"].map((paso, i) => (
              <li key={paso} className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neon-green text-xs font-bold text-background">
                  {i + 1}
                </span>
                {paso}
              </li>
            ))}
          </ol>

          <div className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <label className="relative block flex-1">
              <span className="sr-only">Buscar en el catálogo</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden />
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Princesas, espuma, hora loca…"
                className="h-[52px] w-full rounded-xl border border-white/15 bg-background-card pl-12 pr-12 text-base outline-none transition-colors placeholder:text-muted focus:border-neon-green"
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
            <label className="relative block sm:w-52">
              <span className="sr-only">Ocasión</span>
              <select
                value={ocasion ?? ""}
                onChange={(e) => elegirOcasion(e.target.value || null)}
                className={`h-[52px] w-full appearance-none rounded-xl border bg-background-card pl-4 pr-10 text-base outline-none transition-colors focus:border-neon-green ${
                  ocasion ? "border-neon-green text-neon-green" : "border-white/15 text-foreground"
                }`}
              >
                <option value="">Cualquier ocasión</option>
                {OCASIONES.map((o) => (
                  <option key={o.slug} value={o.slug}>
                    Para {o.nombre.toLowerCase()}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden />
            </label>
          </div>

          <p className="mt-5 text-sm text-muted">
            <strong className="font-semibold text-foreground">{PERFIL_IG.seguidores}</strong> nos siguen en Instagram
            <span className="mx-2 text-white/25">·</span>
            <strong className="font-semibold text-foreground">{totalVisible}</strong> opciones para tu evento
          </p>
        </div>

        <CatalogoPortada fotos={portada} />
      </header>

      <div ref={inicioListado} className="mt-10" aria-hidden />
      {/* Pestañas de categoría: fijas bajo el menú, una sola línea con scroll horizontal */}
      <div className="sticky top-[60px] z-30 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="scrollbar-none mx-auto flex max-w-6xl gap-7 overflow-x-auto px-4 sm:px-6" role="tablist" aria-label="Categorías">
          {[null, ...CATEGORIAS].map((c) => {
            const activa = !buscando && categoria === c;
            const total = c ? servicios.filter((s) => s.categoria === c).length : totalVisible;
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
                className={`relative flex min-h-[52px] shrink-0 items-center gap-1.5 text-[15px] font-semibold transition-colors ${
                  activa ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {c ?? "Todo"}
                <span className={`text-xs tabular-nums ${activa ? "text-neon-green" : "text-muted/80"}`}>{total}</span>
                {activa && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-t-full bg-neon-green" aria-hidden />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {ocasionActual && (
          <button
            type="button"
            onClick={() => elegirOcasion(null)}
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-neon-green/50 px-3 py-1.5 text-sm font-medium text-neon-green hover:bg-neon-green/10"
          >
            Para {ocasionActual.nombre.toLowerCase()}
            <X className="h-4 w-4" aria-hidden />
            <span className="sr-only">Quitar filtro de ocasión</span>
          </button>
        )}

        {filtrados.length === 0 ? (
          <div className="mx-auto mt-16 flex max-w-md flex-col items-center gap-4 text-center">
            <h2 className="type-h3 font-bold">
              {buscando ? `No encontramos “${busqueda.trim()}”` : "Nada por aquí con ese filtro"}
            </h2>
            <p className="text-muted">
              Igual pregúntanos: muchas veces lo armamos a la medida aunque no esté en el catálogo.
            </p>
            <a
              href={whatsapp.link(buscando ? MENSAJES_WHATSAPP.noEncontrado(busqueda.trim()) : MENSAJES_WHATSAPP.asesoria())}
              data-origen={buscando ? "catalogo-busqueda" : "catalogo-asesoria"}
              data-detalle={buscando ? busqueda.trim() : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target rounded-full bg-neon-green px-6 text-sm font-bold text-background"
            >
              Preguntar por WhatsApp
            </a>
          </div>
        ) : vistaAgrupada ? (
          <div className="mt-10 flex flex-col gap-16">
            {porCategoria.map(({ categoria: c, items }, gi) => (
              <section key={c} aria-labelledby={`cat-${c}`}>
                <div className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-3">
                  <div>
                    <span
                      className="mb-2 block h-1 w-10 rounded-full"
                      style={{ background: COLOR_CATEGORIA[c] ?? "var(--neon-green)" }}
                      aria-hidden
                    />
                    <h2 id={`cat-${c}`} className="type-h2 font-display font-extrabold">
                      {c}
                    </h2>
                  </div>
                  {items.length > MAX_POR_CATEGORIA && (
                    <button
                      type="button"
                      onClick={() => elegirCategoria(c)}
                      className="touch-target shrink-0 text-sm font-semibold text-neon-green hover:underline"
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

        <div className="mt-20 flex flex-col items-start gap-6 rounded-2xl bg-plum px-6 py-9 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div>
            <h2 className="type-h3 font-display font-extrabold text-white">¿No sabes qué elegir?</h2>
            <p className="mt-1 max-w-md text-white/85">
              Cuéntanos la fecha, la edad del cumpleañero y cuántos invitados. Te armamos el combo.
            </p>
          </div>
          <a
            href={whatsapp.link(MENSAJES_WHATSAPP.asesoria())}
            data-origen="catalogo-asesoria"
            target="_blank"
            rel="noopener noreferrer"
            className="touch-target shrink-0 rounded-full bg-neon-green px-6 text-sm font-bold text-background transition-colors hover:bg-neon-green-dark"
          >
            Pedir recomendación por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function Grid({ items, priority = false }: { items: ServicioCatalogo[]; priority?: boolean }) {
  // Como mucho un "Más pedido" por fila: si todo es lo más pedido, nada lo es.
  const filasConEtiqueta = new Set<number>();
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {items.map((s, i) => {
        const fila = Math.floor(i / 4);
        const etiqueta = s.masPedido && !filasConEtiqueta.has(fila);
        if (etiqueta) filasConEtiqueta.add(fila);
        return <ServicioCard key={s.id} {...s} masPedido={etiqueta} priority={priority && i < 2} />;
      })}
    </div>
  );
}
