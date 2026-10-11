"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Clock, ExternalLink, Loader2, Search, Trash2, Users } from "lucide-react";
import { OCASIONES } from "@/lib/ocasiones";
import { type TipoServicioMedia } from "@/lib/validation";
import SubirFoto from "@/components/admin/SubirFoto";
import MediaManager from "@/components/admin/MediaManager";
import OpcionesManager from "@/components/admin/OpcionesManager";
import { pedir } from "@/components/admin/subir";
import { Aviso, Campo, Interruptor, Tarjeta, inputClase } from "@/components/admin/ui";

export type ServicioEditable = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  fotoUrl: string | null;
  incluye: string | null;
  edadIdeal: string | null;
  duracion: string | null;
  masPedido: boolean;
  destacado: boolean;
  soloAdultos: boolean;
  activo: boolean;
  ocasiones: string | null;
  combinaCon: string | null;
};

type Media = { id: string; servicioId: string; url: string; tipo: TipoServicioMedia; poster: string | null; orden: number };
type Otro = { id: string; nombre: string; categoria: string };

const lista = (v: string | null) => (v ?? "").split(",").map((x) => x.trim()).filter(Boolean);

export default function ServicioEditor({
  servicio: inicial,
  categorias,
  otros,
  media,
  opciones,
}: {
  servicio: ServicioEditable;
  categorias: string[];
  otros: Otro[];
  media: Media[];
  opciones: React.ComponentProps<typeof OpcionesManager>["initialOpciones"];
}) {
  const router = useRouter();
  const [guardado, setGuardado] = useState(inicial);
  const [form, setForm] = useState(inicial);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: "error" | "ok"; texto: string } | null>(null);
  const [buscaCombo, setBuscaCombo] = useState("");

  const cambios = JSON.stringify(form) !== JSON.stringify(guardado);
  const set = <K extends keyof ServicioEditable>(k: K, v: ServicioEditable[K]) => setForm((f) => ({ ...f, [k]: v }));

  // Avisa antes de salir con cambios sin guardar.
  useEffect(() => {
    if (!cambios) return;
    const avisar = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [cambios]);

  async function guardar() {
    if (form.nombre.trim().length < 2) {
      setAviso({ tipo: "error", texto: "El nombre debe tener al menos 2 letras." });
      return;
    }
    setGuardando(true);
    setAviso(null);
    try {
      const { servicio } = await pedir<{ servicio: ServicioEditable }>(`/api/servicios/${form.id}`, "PUT", {
        nombre: form.nombre.trim(),
        categoria: form.categoria,
        descripcion: form.descripcion.trim(),
        fotoUrl: form.fotoUrl,
        incluye: form.incluye?.trim() || null,
        edadIdeal: form.edadIdeal?.trim() || null,
        duracion: form.duracion?.trim() || null,
        masPedido: form.masPedido,
        destacado: form.destacado,
        soloAdultos: form.soloAdultos,
        activo: form.activo,
        ocasiones: form.ocasiones,
        combinaCon: form.combinaCon,
      });
      setGuardado(servicio);
      setForm(servicio);
      setAviso({ tipo: "ok", texto: "Guardado. Ya se ve así en el sitio." });
      router.refresh();
    } catch (e) {
      setAviso({ tipo: "error", texto: e instanceof Error ? e.message : "No se pudo guardar." });
    } finally {
      setGuardando(false);
    }
  }

  async function borrar() {
    if (!confirm(`¿Borrar "${guardado.nombre}" con todas sus fotos y opciones? Esto no se puede deshacer.`)) return;
    try {
      await pedir(`/api/servicios/${form.id}`, "DELETE");
      router.push("/admin/catalogo");
      router.refresh();
    } catch (e) {
      setAviso({ tipo: "error", texto: e instanceof Error ? e.message : "No se pudo borrar." });
    }
  }

  const ocasiones = lista(form.ocasiones);
  const toggleOcasion = (slug: string) =>
    set("ocasiones", (ocasiones.includes(slug) ? ocasiones.filter((o) => o !== slug) : [...ocasiones, slug]).join(",") || null);

  const combina = lista(form.combinaCon);
  const toggleCombo = (id: string) =>
    set("combinaCon", (combina.includes(id) ? combina.filter((c) => c !== id) : [...combina, id]).join(",") || null);
  const t = buscaCombo.trim().toLowerCase();
  const otrosFiltrados = otros
    .filter((o) => !combina.includes(o.id) && (!t || o.nombre.toLowerCase().includes(t)))
    .slice(0, 12);

  return (
    <div className="flex flex-col gap-6 pb-28">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/admin/catalogo" className="text-sm text-muted hover:text-neon-green">
            ← Catálogo
          </Link>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">{guardado.nombre}</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted">
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${
                guardado.activo ? "bg-neon-green/15 text-neon-green" : "bg-white/10 text-foreground/80"
              }`}
            >
              {guardado.activo ? "Visible en el sitio" : "Oculto"}
            </span>
            {guardado.categoria}
          </p>
        </div>
        {guardado.activo && (
          <a
            href={`/catalogo/${guardado.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-white/15 px-3 text-sm font-semibold hover:border-neon-green hover:text-neon-green"
          >
            Ver en el sitio <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        )}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-6">
          <Tarjeta titulo="Información" ayuda="Lo primero que leen los clientes en la tarjeta y en la ficha.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo etiqueta="Nombre">
                <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} className={inputClase} />
              </Campo>
              <Campo etiqueta="Sección del catálogo">
                <select value={form.categoria} onChange={(e) => set("categoria", e.target.value)} className={inputClase}>
                  {!categorias.includes(form.categoria) && <option value={form.categoria}>{form.categoria}</option>}
                  {categorias.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>
            <Campo etiqueta="Descripción" ayuda="Una o dos frases. Ej: personajes que incluye o qué pasa en el show.">
              <textarea
                rows={3}
                value={form.descripcion}
                onChange={(e) => set("descripcion", e.target.value)}
                className={inputClase}
              />
            </Campo>
          </Tarjeta>

          <Tarjeta titulo="Detalles del servicio">
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo etiqueta="Edad ideal" ayuda="Ej: 3 a 8 años · Todas las edades">
                <input
                  value={form.edadIdeal ?? ""}
                  onChange={(e) => set("edadIdeal", e.target.value)}
                  placeholder="3 a 8 años"
                  className={inputClase}
                />
              </Campo>
              <Campo etiqueta="Duración" ayuda="Ej: 1 hora · 45 minutos">
                <input
                  value={form.duracion ?? ""}
                  onChange={(e) => set("duracion", e.target.value)}
                  placeholder="1 hora"
                  className={inputClase}
                />
              </Campo>
            </div>
            <Campo etiqueta="Qué incluye" ayuda="Un punto por línea. Se muestran como lista en la ficha.">
              <textarea
                rows={5}
                value={form.incluye ?? ""}
                onChange={(e) => set("incluye", e.target.value)}
                placeholder={"Aparición de personajes\nBaile con los niños\nFotos con el cumpleañero"}
                className={inputClase}
              />
            </Campo>
          </Tarjeta>

          <Tarjeta titulo="¿Para qué ocasiones sirve?" ayuda="Aparece cuando el cliente filtra el catálogo por ocasión.">
            <div className="flex flex-wrap gap-2">
              {OCASIONES.map((o) => {
                const on = ocasiones.includes(o.slug);
                return (
                  <button
                    key={o.slug}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleOcasion(o.slug)}
                    className={`inline-flex h-10 items-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-colors ${
                      on ? "border-neon-green bg-neon-green/15 text-neon-green" : "border-white/15 text-foreground/80 hover:border-white/35"
                    }`}
                  >
                    {on && <Check className="h-4 w-4" aria-hidden />}
                    {o.nombre}
                  </button>
                );
              })}
            </div>
          </Tarjeta>

          <Tarjeta titulo="Se combina con" ayuda="Se sugieren en la ficha como “Agrégale también”.">
            {combina.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {combina.map((id) => {
                  const o = otros.find((x) => x.id === id);
                  if (!o) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleCombo(id)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-neon-green/15 px-3 text-sm font-semibold text-neon-green hover:bg-red-500/15 hover:text-red-300"
                      title="Quitar"
                    >
                      {o.nombre} <span aria-hidden>×</span>
                    </button>
                  );
                })}
              </div>
            )}
            <label className="relative block">
              <span className="sr-only">Buscar servicio para combinar</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <input
                value={buscaCombo}
                onChange={(e) => setBuscaCombo(e.target.value)}
                placeholder="Buscar servicio para agregar…"
                className={`${inputClase} pl-9`}
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {otrosFiltrados.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => toggleCombo(o.id)}
                  className="inline-flex h-9 items-center rounded-lg border border-white/15 px-3 text-sm text-foreground/85 hover:border-neon-green hover:text-neon-green"
                >
                  + {o.nombre}
                </button>
              ))}
            </div>
          </Tarjeta>

          <MediaManager
            servicioId={form.id}
            initialMedia={media}
            portada={form.fotoUrl}
            onUsarComoPortada={(url) => {
              set("fotoUrl", url);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />

          <Tarjeta
            titulo="Variantes y dinámicas"
            ayuda="Opciones que el cliente elige al cotizar: “Rapunzel sola” o “con el príncipe”, o los juegos de un baby shower. Se guardan al momento."
          >
            <OpcionesManager servicioId={form.id} initialOpciones={opciones} />
          </Tarjeta>

          <section className="rounded-2xl border border-red-500/25 p-5">
            <h2 className="font-bold text-red-300">Borrar servicio</h2>
            <p className="mt-1 text-sm text-muted">
              Si solo quieres sacarlo del sitio por un tiempo, mejor apaga “Visible en el sitio”.
            </p>
            <button
              type="button"
              onClick={borrar}
              className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-lg border border-red-500/40 px-4 text-sm font-semibold text-red-300 hover:bg-red-500/15"
            >
              <Trash2 className="h-4 w-4" aria-hidden /> Borrar para siempre
            </button>
          </section>
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-6">
          <Tarjeta titulo="Foto de portada" ayuda="La que se ve en el catálogo. Mejor vertical, con caras visibles.">
            <SubirFoto valor={form.fotoUrl} onCambio={(url) => set("fotoUrl", url)} />
          </Tarjeta>

          <Tarjeta titulo="Publicación">
            <div className="flex flex-col gap-2">
              <Interruptor
                titulo="Visible en el sitio"
                ayuda={form.fotoUrl ? "Apágalo para ocultarlo sin borrarlo." : "Ponle una foto antes de mostrarlo."}
                activo={form.activo}
                onCambio={(v) => set("activo", v)}
              />
              <Interruptor
                titulo="Más pedido"
                ayuda="Etiqueta en la tarjeta (como mucho una por fila)."
                activo={form.masPedido}
                onCambio={(v) => set("masPedido", v)}
              />
              <Interruptor
                titulo="Destacado en el Inicio"
                activo={form.destacado}
                onCambio={(v) => set("destacado", v)}
              />
              <Interruptor
                titulo="Solo adultos (+18)"
                ayuda="Solo aparece dentro de su sección, nunca en “Todo”."
                activo={form.soloAdultos}
                onCambio={(v) => set("soloAdultos", v)}
                tono="rojo"
              />
            </div>
          </Tarjeta>

          <VistaPrevia servicio={form} />
        </div>
      </div>

      {/* Barra de guardado: siempre a mano, avisa si hay cambios pendientes */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/95 backdrop-blur-md sm:left-56">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-3 px-4 py-3 sm:px-8">
          <div className="mr-auto min-w-0 text-sm">
            {aviso ? (
              <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>
            ) : cambios ? (
              <span className="font-semibold text-gold">Tienes cambios sin guardar</span>
            ) : (
              <span className="text-muted">Todo guardado</span>
            )}
          </div>
          {cambios && (
            <button
              type="button"
              onClick={() => {
                setForm(guardado);
                setAviso(null);
              }}
              className="h-11 rounded-lg px-4 text-sm font-semibold text-foreground/80 hover:text-foreground"
            >
              Descartar
            </button>
          )}
          <button
            type="button"
            onClick={guardar}
            disabled={!cambios || guardando}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-neon-green px-6 text-sm font-bold text-background transition-opacity hover:bg-neon-green-dark disabled:opacity-40"
          >
            {guardando && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

/** Mini tarjeta como la del catálogo público, para ver el resultado antes de guardar. */
function VistaPrevia({ servicio }: { servicio: ServicioEditable }) {
  return (
    <Tarjeta titulo="Así se ve en el catálogo">
      <div className="mx-auto w-full max-w-[220px] overflow-hidden rounded-xl border border-white/10 bg-background-card">
        <div className="relative aspect-[4/5] w-full bg-black/40">
          {servicio.fotoUrl ? (
            <Image src={servicio.fotoUrl} alt="" fill sizes="220px" className="object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-xs text-muted">Sin foto</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
          {servicio.masPedido && (
            <span className="absolute left-2 top-2 -rotate-2 rounded-md bg-neon-green px-2 py-1 text-[10px] font-bold uppercase text-background">
              Más pedido
            </span>
          )}
          <p className="ig-caption absolute inset-x-2.5 bottom-2.5 line-clamp-2 text-base leading-tight">
            {servicio.nombre || "Nombre del servicio"}
          </p>
        </div>
        <div className="flex flex-col gap-2 p-2.5">
          <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-foreground/75">
            {servicio.edadIdeal && (
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-muted" aria-hidden /> {servicio.edadIdeal}
              </span>
            )}
            {servicio.duracion && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-muted" aria-hidden /> {servicio.duracion}
              </span>
            )}
          </p>
          <span className="flex h-9 items-center justify-center rounded-lg border border-neon-green/55 text-xs font-bold text-neon-green">
            + Agregar
          </span>
        </div>
      </div>
    </Tarjeta>
  );
}
