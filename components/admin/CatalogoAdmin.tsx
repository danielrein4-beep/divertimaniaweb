"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, ListOrdered, Loader2, Plus, Search, Settings2 } from "lucide-react";
import Link from "next/link";
import { pedir } from "@/lib/servidor";
import { Aviso, inputClase } from "@/components/admin/ui";
import { ListaOrdenable } from "@/components/admin/catalogo/Ordenable";
import FilaServicio, { type ServicioFila } from "@/components/admin/catalogo/FilaServicio";
import OrdenSecciones, { type SeccionOrden } from "@/components/admin/catalogo/OrdenSecciones";
import NuevoServicio from "@/components/admin/catalogo/NuevoServicio";
import Encabezado, { botonPrimario, botonSecundario } from "@/components/admin/Encabezado";

export type { ServicioFila };
export type SeccionAdmin = { id: string | null; nombre: string; color: string };

type Estado = { tipo: "guardando" } | { tipo: "ok"; hora: string } | { tipo: "error"; texto: string } | null;

/** Catálogo del panel: ordenar arrastrando, mover entre secciones, y elegir qué sale en la web y en el PDF. */
export default function CatalogoAdmin({ servicios: iniciales, secciones: seccionesIniciales }: { servicios: ServicioFila[]; secciones: SeccionAdmin[] }) {
  const router = useRouter();
  const [servicios, setServicios] = useState(iniciales);
  const [secciones, setSecciones] = useState(seccionesIniciales);
  const [filtro, setFiltro] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState<Estado>(null);
  const [creando, setCreando] = useState(false);
  const [ordenandoSecciones, setOrdenandoSecciones] = useState(false);

  const termino = busqueda.trim().toLowerCase();
  // Secciones a mostrar: las configuradas y, por si acaso, cualquiera que usen servicios viejos.
  const todas = useMemo(() => {
    const nombres = secciones.map((c) => c.nombre);
    const extra = [...new Set(servicios.map((s) => s.categoria))].filter((c) => !nombres.includes(c));
    return [...secciones, ...extra.map((nombre) => ({ id: null, nombre, color: "#8e8e9e" }))];
  }, [secciones, servicios]);
  const deSeccion = (nombre: string) => servicios.filter((s) => s.categoria === nombre);

  const metricas = [
    { etiqueta: "Servicios", valor: servicios.length },
    { etiqueta: "En la web", valor: servicios.filter((s) => s.activo).length },
    { etiqueta: "En el PDF", valor: servicios.filter((s) => s.activo && s.enPdf).length },
    { etiqueta: "Sin foto", valor: servicios.filter((s) => !s.fotoUrl).length, alerta: true },
  ];

  /** Cambio optimista: se ve al instante y, si el servidor falla, vuelve atrás. */
  async function guardar(aplicar: () => void, revertir: () => void, envio: () => Promise<unknown>) {
    aplicar();
    setEstado({ tipo: "guardando" });
    try {
      await envio();
      setEstado({ tipo: "ok", hora: new Date().toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" }) });
      router.refresh();
    } catch (e) {
      revertir();
      setEstado({ tipo: "error", texto: e instanceof Error ? e.message : "No se pudo guardar." });
    }
  }

  function ordenarDentro(seccion: string, nuevos: ServicioFila[]) {
    const anterior = servicios;
    guardar(
      () => setServicios([...servicios.filter((x) => x.categoria !== seccion), ...nuevos]),
      () => setServicios(anterior),
      () => pedir("/api/servicios/orden", "PUT", { ids: nuevos.map((x) => x.id) })
    );
  }

  function llevarAlExtremo(s: ServicioFila, donde: "inicio" | "fin") {
    const resto = deSeccion(s.categoria).filter((x) => x.id !== s.id);
    ordenarDentro(s.categoria, donde === "inicio" ? [s, ...resto] : [...resto, s]);
  }

  function moverASeccion(s: ServicioFila, destino: string) {
    const anterior = servicios;
    const orden = deSeccion(destino).length;
    guardar(
      () => setServicios([...servicios.filter((x) => x.id !== s.id), { ...s, categoria: destino }]),
      () => setServicios(anterior),
      () => pedir(`/api/servicios/${s.id}`, "PUT", { categoria: destino, orden })
    );
  }

  function cambiar(s: ServicioFila, cambio: Partial<Pick<ServicioFila, "activo" | "enPdf">>) {
    const anterior = servicios;
    guardar(
      () => setServicios(servicios.map((x) => (x.id === s.id ? { ...x, ...cambio } : x))),
      () => setServicios(anterior),
      () => pedir(`/api/servicios/${s.id}`, "PUT", cambio)
    );
  }

  function ordenarSecciones(nuevas: SeccionOrden[]) {
    const anterior = secciones;
    guardar(
      () => setSecciones(nuevas.map(({ id, nombre, color }) => ({ id, nombre, color }))),
      () => setSecciones(anterior),
      () => pedir("/api/categorias", "PUT", { ids: nuevas.map((x) => x.id) })
    );
  }

  const seccionesOrdenables: SeccionOrden[] = secciones
    .filter((c): c is SeccionAdmin & { id: string } => c.id !== null)
    .map((c) => ({ id: c.id, nombre: c.nombre, color: c.color, total: deSeccion(c.nombre).length }));
  const hayVisibles = todas.some((sec) => deSeccion(sec.nombre).some((s) => (!filtro || s.categoria === filtro) && (!termino || s.nombre.toLowerCase().includes(termino))));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-5 [&>header]:mb-0">
        <Encabezado
          grupo="Catálogo"
          titulo="Servicios"
          extra={<EstadoGuardado estado={estado} />}
          descripcion="Todo lo que se ofrece en el sitio y en el catálogo PDF, en el orden en que aparece."
          acciones={
            <>
              {seccionesOrdenables.length > 1 && (
                <BotonSecundario onClick={() => setOrdenandoSecciones(true)}>
                  <ListOrdered className="h-4 w-4" aria-hidden /> Orden de secciones
                </BotonSecundario>
              )}
              <Link href="/admin/categorias" className={botonSecundario}>
                <Settings2 className="h-4 w-4" aria-hidden /> Secciones
              </Link>
              <a href="/catalogo/pdf" target="_blank" rel="noopener" className={botonSecundario}>
                Ver PDF <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
              <button type="button" onClick={() => setCreando(true)} className={botonPrimario}>
                <Plus className="h-4 w-4" aria-hidden /> Nuevo servicio
              </button>
            </>
          }
        />

        <dl className="grid grid-cols-2 overflow-hidden rounded-xl border border-white/10 sm:grid-cols-4">
          {metricas.map((m, i) => (
            <div key={m.etiqueta} className={`px-4 py-3 ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t sm:border-t-0" : ""} ${i === 2 ? "sm:border-l" : ""} border-white/10`}>
              <dt className="text-[10.5px] font-bold uppercase tracking-wider text-muted">{m.etiqueta}</dt>
              <dd className={`mt-1 font-mono text-2xl font-semibold tabular-nums ${m.alerta && m.valor > 0 ? "text-gold" : ""}`}>{m.valor}</dd>
            </div>
          ))}
        </dl>
      </div>

      {creando && <NuevoServicio categorias={todas.map((c) => c.nombre)} inicial={filtro} onCerrar={() => setCreando(false)} />}
      {ordenandoSecciones && (
        <OrdenSecciones secciones={seccionesOrdenables} onOrden={ordenarSecciones} onCerrar={() => setOrdenandoSecciones(false)} />
      )}

      <div className="flex flex-col gap-3">
        <label className="relative block max-w-md">
          <span className="sr-only">Buscar servicio</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por nombre…" className={`${inputClase} pl-9`} />
        </label>
        <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {[null, ...todas.map((c) => c.nombre)].map((c) => {
            const activo = filtro === c;
            return (
              <button
                key={c ?? "todas"}
                type="button"
                onClick={() => setFiltro(c)}
                className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-colors ${
                  activo ? "border-neon-green bg-neon-green/15 text-neon-green" : "border-white/15 text-foreground/80 hover:border-white/35"
                }`}
              >
                {c ?? "Todas"} <span className="font-mono text-xs tabular-nums opacity-70">{c ? deSeccion(c).length : servicios.length}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted">
          {termino ? "Para ordenar, borra la búsqueda." : "Arrastra desde la agarradera para ordenar. El orden es el mismo en el sitio y en el PDF."}
        </p>
      </div>

      {estado?.tipo === "error" && <Aviso tipo="error">{estado.texto}</Aviso>}

      {todas.map((sec) => {
        if (filtro && filtro !== sec.nombre) return null;
        const items = deSeccion(sec.nombre);
        const visibles = termino ? items.filter((s) => s.nombre.toLowerCase().includes(termino)) : items;
        if (!visibles.length) return null;
        const enWeb = items.filter((s) => s.activo).length;
        const enPdf = items.filter((s) => s.activo && s.enPdf).length;
        return (
          <section key={sec.nombre} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3 px-1">
              <h2 className="flex items-center gap-2.5 text-lg font-bold">
                <span className="h-5 w-1.5 rounded-full" style={{ background: sec.color }} aria-hidden />
                {sec.nombre}
              </h2>
              <p className="font-mono text-xs tabular-nums text-muted">
                web {enWeb}/{items.length} · pdf {enPdf}/{items.length}
              </p>
            </div>
            <ul className="rounded-xl border border-white/10">
              <ListaOrdenable id={`orden-${sec.nombre}`} items={visibles} onOrden={(nuevos) => ordenarDentro(sec.nombre, nuevos)}>
                {visibles.map((s) => (
                  <FilaServicio
                    key={s.id}
                    servicio={s}
                    posicion={items.findIndex((x) => x.id === s.id)}
                    total={items.length}
                    secciones={todas.map((c) => c.nombre)}
                    ordenBloqueado={!!termino}
                    onCambiar={(cambio) => cambiar(s, cambio)}
                    onExtremo={(donde) => llevarAlExtremo(s, donde)}
                    onMoverSeccion={(destino) => moverASeccion(s, destino)}
                  />
                ))}
              </ListaOrdenable>
            </ul>
          </section>
        );
      })}

      {!hayVisibles && (
        <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-muted">
          No hay servicios {termino ? `con “${busqueda.trim()}”` : "en esta sección"}.
        </p>
      )}
    </div>
  );
}

function BotonSecundario({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={botonSecundario}>
      {children}
    </button>
  );
}

/** «Guardando…» / «Guardado 14:32»: confirma cada cambio sin ventanas emergentes. */
function EstadoGuardado({ estado }: { estado: Estado }) {
  return (
    <span aria-live="polite" className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
      {estado?.tipo === "guardando" && (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Guardando…
        </>
      )}
      {estado?.tipo === "ok" && (
        <>
          <Check className="h-3.5 w-3.5 text-neon-green" aria-hidden /> Guardado {estado.hora}
        </>
      )}
    </span>
  );
}
