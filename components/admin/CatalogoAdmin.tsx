"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Eye, EyeOff, ImageOff, Loader2, Pencil, Plus, Search, Settings2, X } from "lucide-react";
import type { CategoriaInfo } from "@/lib/categorias-comun";
import { pedir } from "@/components/admin/subir";
import { Aviso, Campo, inputClase } from "@/components/admin/ui";

export type ServicioFila = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  fotoUrl: string | null;
  activo: boolean;
  masPedido: boolean;
  soloAdultos: boolean;
  opciones: number;
  media: number;
};

/** Lista del catálogo en el panel: buscar, filtrar por sección, ordenar, ocultar y crear servicios. */
export default function CatalogoAdmin({
  servicios: iniciales,
  categorias,
}: {
  servicios: ServicioFila[];
  categorias: CategoriaInfo[];
}) {
  const router = useRouter();
  const [servicios, setServicios] = useState(iniciales);
  const [filtro, setFiltro] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [creando, setCreando] = useState(false);

  const termino = busqueda.trim().toLowerCase();
  const nombresCategorias = categorias.map((c) => c.nombre);
  // Secciones a mostrar: las configuradas y, por si acaso, cualquiera que usen servicios viejos.
  const secciones = useMemo(() => {
    const extra = [...new Set(servicios.map((s) => s.categoria))].filter((c) => !nombresCategorias.includes(c));
    return [...categorias, ...extra.map((nombre) => ({ nombre, color: "#8e8e9e" }))];
  }, [categorias, servicios, nombresCategorias]);

  const visibles = servicios.filter(
    (s) => (!filtro || s.categoria === filtro) && (!termino || s.nombre.toLowerCase().includes(termino))
  );
  const ocultos = servicios.filter((s) => !s.activo).length;
  const sinFoto = servicios.filter((s) => !s.fotoUrl).length;

  async function alternarVisible(s: ServicioFila) {
    setError("");
    setServicios((prev) => prev.map((x) => (x.id === s.id ? { ...x, activo: !s.activo } : x)));
    try {
      await pedir(`/api/servicios/${s.id}`, "PUT", { activo: !s.activo });
      router.refresh();
    } catch (e) {
      setServicios((prev) => prev.map((x) => (x.id === s.id ? { ...x, activo: s.activo } : x)));
      setError(e instanceof Error ? e.message : "No se pudo cambiar.");
    }
  }

  async function mover(s: ServicioFila, delta: -1 | 1) {
    const deLaSeccion = servicios.filter((x) => x.categoria === s.categoria);
    const i = deLaSeccion.findIndex((x) => x.id === s.id);
    const j = i + delta;
    if (j < 0 || j >= deLaSeccion.length) return;
    [deLaSeccion[i], deLaSeccion[j]] = [deLaSeccion[j], deLaSeccion[i]];
    const anterior = servicios;
    setServicios([...servicios.filter((x) => x.categoria !== s.categoria), ...deLaSeccion]);
    setError("");
    try {
      await pedir("/api/servicios/orden", "PUT", { ids: deLaSeccion.map((x) => x.id) });
      router.refresh();
    } catch (e) {
      setServicios(anterior);
      setError(e instanceof Error ? e.message : "No se pudo ordenar.");
    }
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Catálogo</h1>
          <p className="mt-1 text-sm text-muted">
            {servicios.length} servicios · {ocultos} oculto{ocultos === 1 ? "" : "s"}
            {sinFoto > 0 && <span className="text-gold"> · {sinFoto} sin foto</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/categorias"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-semibold hover:border-neon-green hover:text-neon-green"
          >
            <Settings2 className="h-4 w-4" aria-hidden /> Secciones
          </Link>
          <button
            type="button"
            onClick={() => setCreando(true)}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-neon-green px-4 text-sm font-bold text-background hover:bg-neon-green-dark"
          >
            <Plus className="h-4 w-4" aria-hidden /> Nuevo servicio
          </button>
        </div>
      </div>

      {creando && <NuevoServicio categorias={secciones.map((c) => c.nombre)} inicial={filtro} onCerrar={() => setCreando(false)} />}

      <div className="flex flex-col gap-3">
        <label className="relative block max-w-md">
          <span className="sr-only">Buscar servicio</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre…"
            className={`${inputClase} pl-9`}
          />
        </label>
        <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {[null, ...secciones.map((c) => c.nombre)].map((c) => {
            const activo = filtro === c;
            const total = c ? servicios.filter((s) => s.categoria === c).length : servicios.length;
            return (
              <button
                key={c ?? "todas"}
                type="button"
                onClick={() => setFiltro(c)}
                className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-colors ${
                  activo ? "border-neon-green bg-neon-green/15 text-neon-green" : "border-white/15 text-foreground/80 hover:border-white/35"
                }`}
              >
                {c ?? "Todas"} <span className="text-xs tabular-nums opacity-70">{total}</span>
              </button>
            );
          })}
        </div>
      </div>

      {error && <Aviso tipo="error">{error}</Aviso>}

      {secciones.map((sec) => {
        const items = visibles.filter((s) => s.categoria === sec.nombre);
        if (!items.length) return null;
        const total = servicios.filter((s) => s.categoria === sec.nombre).length;
        return (
          <section key={sec.nombre} className="flex flex-col gap-2">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <span className="h-3 w-3 rounded-full" style={{ background: sec.color }} aria-hidden />
              {sec.nombre}
              <span className="text-sm font-medium text-muted">{items.length}</span>
            </h2>
            <ul className="overflow-hidden rounded-2xl border border-white/10">
              {items.map((s) => {
                const pos = servicios.filter((x) => x.categoria === s.categoria).findIndex((x) => x.id === s.id);
                return (
                  <li
                    key={s.id}
                    className="flex items-center gap-3 border-b border-white/10 bg-background-card px-3 py-2.5 last:border-b-0 sm:gap-4"
                  >
                    <Link href={`/admin/catalogo/${s.id}`} className="relative h-16 w-[52px] shrink-0 overflow-hidden rounded-lg bg-black/40">
                      {s.fotoUrl ? (
                        <Image
                          src={s.fotoUrl}
                          alt=""
                          fill
                          sizes="52px"
                          className={`object-cover ${s.activo ? "" : "opacity-40 grayscale"}`}
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-gold" title="Sin foto">
                          <ImageOff className="h-5 w-5" aria-hidden />
                        </span>
                      )}
                    </Link>

                    <Link href={`/admin/catalogo/${s.id}`} className="min-w-0 flex-1">
                      <p className={`truncate font-semibold ${s.activo ? "" : "text-foreground/60"}`}>{s.nombre}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                        {!s.activo && <Etiqueta clase="bg-white/10 text-foreground/80">Oculto</Etiqueta>}
                        {s.masPedido && <Etiqueta clase="bg-neon-green/15 text-neon-green">Más pedido</Etiqueta>}
                        {s.soloAdultos && <Etiqueta clase="bg-red-500/15 text-red-300">+18</Etiqueta>}
                        <span>
                          {s.media} foto{s.media === 1 ? "" : "s"}/video{s.media === 1 ? "" : "s"}
                          {s.opciones > 0 && ` · ${s.opciones} opciones`}
                        </span>
                      </p>
                    </Link>

                    <div className="flex shrink-0 items-center gap-0.5">
                      <div className="hidden sm:flex">
                        <BotonFila etiqueta="Subir" onClick={() => mover(s, -1)} disabled={pos === 0 || !!termino}>
                          <ArrowUp className="h-4 w-4" />
                        </BotonFila>
                        <BotonFila etiqueta="Bajar" onClick={() => mover(s, 1)} disabled={pos === total - 1 || !!termino}>
                          <ArrowDown className="h-4 w-4" />
                        </BotonFila>
                      </div>
                      <BotonFila etiqueta={s.activo ? "Ocultar del sitio" : "Mostrar en el sitio"} onClick={() => alternarVisible(s)}>
                        {s.activo ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted" />}
                      </BotonFila>
                      <Link
                        href={`/admin/catalogo/${s.id}`}
                        aria-label={`Editar ${s.nombre}`}
                        className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-neon-green hover:bg-neon-green/10"
                      >
                        <Pencil className="h-4 w-4" aria-hidden /> <span className="hidden sm:inline">Editar</span>
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {visibles.length === 0 && (
        <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-muted">
          No hay servicios {termino ? `con “${busqueda.trim()}”` : "en esta sección"}.
        </p>
      )}
    </div>
  );
}

function Etiqueta({ clase, children }: { clase: string; children: React.ReactNode }) {
  return <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${clase}`}>{children}</span>;
}

function BotonFila({
  etiqueta,
  onClick,
  disabled,
  children,
}: {
  etiqueta: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={etiqueta}
      title={etiqueta}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground/85 hover:bg-white/10 hover:text-neon-green disabled:opacity-25 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

/** Ventana para crear un servicio: nombre y sección; luego se abre su ficha para completarlo. */
function NuevoServicio({
  categorias,
  inicial,
  onCerrar,
}: {
  categorias: string[];
  inicial: string | null;
  onCerrar: () => void;
}) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState(inicial ?? categorias[0] ?? "");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  async function crear(e: FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError("");
    try {
      const { servicio } = await pedir<{ servicio: { id: string } }>("/api/servicios", "POST", { nombre, categoria });
      router.push(`/admin/catalogo/${servicio.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear.");
      setGuardando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center" onClick={onCerrar}>
      <form
        onSubmit={crear}
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-white/10 bg-background-elevated p-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Nuevo servicio</h2>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className="rounded-lg p-2 text-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <Campo etiqueta="Nombre" ayuda="Ej: Show de Bluey, Hora Loca, Toro mecánico">
          <input autoFocus required minLength={2} value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClase} />
        </Campo>
        <Campo etiqueta="Sección">
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={inputClase}>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Campo>
        <p className="text-xs text-muted">Se crea oculto. Después le pones foto y detalles, y lo activas cuando esté listo.</p>
        {error && <Aviso tipo="error">{error}</Aviso>}
        <button
          type="submit"
          disabled={guardando}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neon-green text-sm font-bold text-background hover:bg-neon-green-dark disabled:opacity-50"
        >
          {guardando && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Crear y completar
        </button>
      </form>
    </div>
  );
}
