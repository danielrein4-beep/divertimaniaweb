"use client";

import { FormEvent, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Film, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { TIPOS_OPCION, TIPO_OPCION_LABEL, type TipoOpcion } from "@/lib/validation";
import SubirFoto from "@/components/admin/SubirFoto";
import { pedir, subirArchivo } from "@/components/admin/subir";
import { Aviso, Campo, inputClase } from "@/components/admin/ui";

type Opcion = {
  id: string;
  tipo: TipoOpcion;
  grupo: string | null;
  nombre: string;
  descripcion: string | null;
  videoUrl: string | null;
  fotoUrl: string | null;
  orden: number;
};

type Datos = { tipo: TipoOpcion; grupo: string; nombre: string; descripcion: string; videoUrl: string; fotoUrl: string };
const vacio: Datos = { tipo: "VARIANTE", grupo: "", nombre: "", descripcion: "", videoUrl: "", fotoUrl: "" };

const aDatos = (o: Opcion): Datos => ({
  tipo: o.tipo,
  grupo: o.grupo ?? "",
  nombre: o.nombre,
  descripcion: o.descripcion ?? "",
  videoUrl: o.videoUrl ?? "",
  fotoUrl: o.fotoUrl ?? "",
});

/** Variantes de personaje (con foto) y dinámicas de juego de un servicio. Cada cambio se guarda al momento. */
export default function OpcionesManager({ servicioId, initialOpciones }: { servicioId: string; initialOpciones: Opcion[] }) {
  const [opciones, setOpciones] = useState(initialOpciones);
  const [agregando, setAgregando] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [error, setError] = useState("");

  const cuerpo = (d: Datos, orden: number) => ({ ...d, grupo: d.tipo === "VARIANTE" ? d.grupo : "", orden });

  async function crear(d: Datos) {
    const { opcion } = await pedir<{ opcion: Opcion }>(`/api/servicios/${servicioId}/opciones`, "POST", cuerpo(d, opciones.length));
    setOpciones((prev) => [...prev, opcion]);
    setAgregando(false);
  }

  async function guardar(o: Opcion, d: Datos) {
    const { opcion } = await pedir<{ opcion: Opcion }>(`/api/opciones/${o.id}`, "PUT", cuerpo(d, o.orden));
    setOpciones((prev) => prev.map((x) => (x.id === o.id ? opcion : x)));
    setEditando(null);
  }

  async function mover(i: number, delta: -1 | 1) {
    const j = i + delta;
    if (j < 0 || j >= opciones.length) return;
    const nueva = [...opciones];
    [nueva[i], nueva[j]] = [nueva[j], nueva[i]];
    const anterior = opciones;
    setOpciones(nueva);
    setError("");
    try {
      await Promise.all(
        [i, j].map((k) => pedir(`/api/opciones/${nueva[k].id}`, "PUT", cuerpo(aDatos(nueva[k]), k)))
      );
      setOpciones(nueva.map((o, k) => ({ ...o, orden: k })));
    } catch (e) {
      setOpciones(anterior);
      setError(e instanceof Error ? e.message : "No se pudo ordenar.");
    }
  }

  async function borrar(o: Opcion) {
    if (!confirm(`¿Quitar "${o.nombre}"?`)) return;
    setError("");
    try {
      await pedir(`/api/opciones/${o.id}`, "DELETE");
      setOpciones((prev) => prev.filter((x) => x.id !== o.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo quitar.");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <Aviso tipo="error">{error}</Aviso>}

      {opciones.length === 0 && !agregando && (
        <p className="text-sm text-muted">Este servicio todavía no tiene variantes ni dinámicas.</p>
      )}

      {opciones.length > 0 && (
        <ul className="overflow-hidden rounded-xl border border-white/10">
          {opciones.map((o, i) =>
            editando === o.id ? (
              <li key={o.id} className="border-b border-white/10 bg-background p-4 last:border-b-0">
                <FormOpcion inicial={aDatos(o)} textoBoton="Guardar" onGuardar={(d) => guardar(o, d)} onCancelar={() => setEditando(null)} />
              </li>
            ) : (
              <li key={o.id} className="flex items-center gap-3 border-b border-white/10 bg-background-card px-3 py-2.5 last:border-b-0">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black/40">
                  {o.fotoUrl ? (
                    <Image src={o.fotoUrl} alt="" fill sizes="56px" className="object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[10px] font-semibold uppercase text-muted">
                      {o.tipo === "VARIANTE" ? "Sin foto" : "Juego"}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted">
                    {TIPO_OPCION_LABEL[o.tipo]}
                    {o.grupo ? ` · ${o.grupo}` : ""}
                    {o.videoUrl ? " · con video" : ""}
                  </p>
                  <p className="truncate font-semibold">{o.nombre}</p>
                  {o.descripcion && <p className="truncate text-xs text-muted">{o.descripcion}</p>}
                </div>
                <div className="flex shrink-0">
                  <div className="hidden sm:flex">
                    <Icono etiqueta="Subir" onClick={() => mover(i, -1)} disabled={i === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Icono>
                    <Icono etiqueta="Bajar" onClick={() => mover(i, 1)} disabled={i === opciones.length - 1}>
                      <ArrowDown className="h-4 w-4" />
                    </Icono>
                  </div>
                  <Icono etiqueta="Editar" onClick={() => setEditando(o.id)}>
                    <Pencil className="h-4 w-4" />
                  </Icono>
                  <Icono etiqueta="Quitar" onClick={() => borrar(o)} peligro>
                    <Trash2 className="h-4 w-4" />
                  </Icono>
                </div>
              </li>
            )
          )}
        </ul>
      )}

      {agregando ? (
        <div className="rounded-xl border border-neon-green/30 bg-background p-4">
          <FormOpcion inicial={vacio} textoBoton="Agregar" onGuardar={crear} onCancelar={() => setAgregando(false)} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAgregando(true)}
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-lg border border-white/15 px-4 text-sm font-semibold hover:border-neon-green hover:text-neon-green"
        >
          <Plus className="h-4 w-4" aria-hidden /> Agregar variante o dinámica
        </button>
      )}
    </div>
  );
}

function FormOpcion({
  inicial,
  textoBoton,
  onGuardar,
  onCancelar,
}: {
  inicial: Datos;
  textoBoton: string;
  onGuardar: (d: Datos) => Promise<void>;
  onCancelar: () => void;
}) {
  const [d, setD] = useState(inicial);
  const [guardando, setGuardando] = useState(false);
  const [subiendoVideo, setSubiendoVideo] = useState(false);
  const [error, setError] = useState("");
  const inputVideo = useRef<HTMLInputElement>(null);
  const set = <K extends keyof Datos>(k: K, v: Datos[K]) => setD((x) => ({ ...x, [k]: v }));
  const esVariante = d.tipo === "VARIANTE";

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError("");
    try {
      await onGuardar(d);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
      setGuardando(false);
    }
  }

  async function subirVideo(file: File | undefined) {
    if (!file) return;
    setSubiendoVideo(true);
    setError("");
    try {
      const { url, tipo } = await subirArchivo(file);
      if (tipo !== "VIDEO") throw new Error("Eso no es un video. Usa un MP4.");
      set("videoUrl", url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir el video.");
    } finally {
      setSubiendoVideo(false);
    }
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4">
      <div className="flex gap-2" role="radiogroup" aria-label="Tipo">
        {TIPOS_OPCION.map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={d.tipo === t}
            onClick={() => set("tipo", t)}
            className={`h-10 rounded-lg border px-3 text-sm font-semibold ${
              d.tipo === t ? "border-neon-green bg-neon-green/15 text-neon-green" : "border-white/15 text-foreground/80"
            }`}
          >
            {TIPO_OPCION_LABEL[t]}
          </button>
        ))}
      </div>

      <div className={`grid gap-4 ${esVariante ? "sm:grid-cols-[160px_minmax(0,1fr)]" : ""}`}>
        {esVariante && (
          <div className="mx-auto w-40 sm:mx-0">
            <SubirFoto valor={d.fotoUrl || null} onCambio={(url) => set("fotoUrl", url ?? "")} aspecto="aspect-square" />
          </div>
        )}
        <div className="flex flex-col gap-3">
          {esVariante && (
            <Campo etiqueta="Personaje" ayuda="Agrupa las variantes del mismo personaje.">
              <input required value={d.grupo} onChange={(e) => set("grupo", e.target.value)} placeholder="Rapunzel" className={inputClase} />
            </Campo>
          )}
          <Campo etiqueta="Nombre">
            <input
              required
              minLength={2}
              value={d.nombre}
              onChange={(e) => set("nombre", e.target.value)}
              placeholder={esVariante ? "Rapunzel con el príncipe" : "Carrera de biberones"}
              className={inputClase}
            />
          </Campo>
          <Campo etiqueta="Descripción (opcional)">
            <textarea rows={2} value={d.descripcion} onChange={(e) => set("descripcion", e.target.value)} className={inputClase} />
          </Campo>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {d.videoUrl ? (
              <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white/10 px-3 font-semibold">
                <Film className="h-4 w-4" aria-hidden /> Video listo
                <button type="button" onClick={() => set("videoUrl", "")} aria-label="Quitar video" className="ml-1 text-muted hover:text-red-300">
                  <X className="h-4 w-4" />
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => inputVideo.current?.click()}
                disabled={subiendoVideo}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/15 px-3 font-semibold hover:border-neon-green hover:text-neon-green"
              >
                {subiendoVideo ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Film className="h-4 w-4" aria-hidden />}
                {subiendoVideo ? "Subiendo video…" : "Video corto (opcional)"}
              </button>
            )}
            <input
              ref={inputVideo}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              className="hidden"
              onChange={(e) => subirVideo(e.target.files?.[0])}
            />
          </div>
        </div>
      </div>

      {error && <Aviso tipo="error">{error}</Aviso>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={guardando || subiendoVideo}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-neon-green px-5 text-sm font-bold text-background hover:bg-neon-green-dark disabled:opacity-50"
        >
          {guardando && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {textoBoton}
        </button>
        <button type="button" onClick={onCancelar} className="h-11 rounded-lg px-4 text-sm font-semibold text-foreground/80 hover:text-foreground">
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Icono({
  etiqueta,
  onClick,
  disabled,
  peligro,
  children,
}: {
  etiqueta: string;
  onClick: () => void;
  disabled?: boolean;
  peligro?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={etiqueta}
      title={etiqueta}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground/85 disabled:opacity-25 ${
        peligro ? "hover:bg-red-500/15 hover:text-red-300" : "hover:bg-white/10 hover:text-neon-green"
      }`}
    >
      {children}
    </button>
  );
}
