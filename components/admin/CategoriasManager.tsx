"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Check, Loader2, Plus, Trash2 } from "lucide-react";
import { COLORES_CATEGORIA } from "@/lib/categorias-comun";
import { pedir } from "@/components/admin/subir";
import { Aviso, inputClase } from "@/components/admin/ui";

type Fila = { id: string; nombre: string; color: string; servicios: number };

/** Secciones del catálogo: crear, renombrar, cambiar color, ordenar y borrar (si están vacías). */
export default function CategoriasManager({ iniciales }: { iniciales: Fila[] }) {
  const router = useRouter();
  const [filas, setFilas] = useState(iniciales);
  const [error, setError] = useState("");
  const [nuevo, setNuevo] = useState("");
  const [colorNuevo, setColorNuevo] = useState(COLORES_CATEGORIA[0]);
  const [creando, setCreando] = useState(false);

  async function guardar(fila: Fila, cambio: Partial<Pick<Fila, "nombre" | "color">>) {
    setError("");
    const anterior = filas;
    setFilas((prev) => prev.map((f) => (f.id === fila.id ? { ...f, ...cambio } : f)));
    try {
      await pedir(`/api/categorias/${fila.id}`, "PUT", cambio);
      router.refresh();
    } catch (e) {
      setFilas(anterior);
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
    }
  }

  async function mover(i: number, delta: -1 | 1) {
    const j = i + delta;
    if (j < 0 || j >= filas.length) return;
    const nueva = [...filas];
    [nueva[i], nueva[j]] = [nueva[j], nueva[i]];
    const anterior = filas;
    setFilas(nueva);
    setError("");
    try {
      await pedir("/api/categorias", "PUT", { ids: nueva.map((f) => f.id) });
      router.refresh();
    } catch (e) {
      setFilas(anterior);
      setError(e instanceof Error ? e.message : "No se pudo ordenar.");
    }
  }

  async function borrar(fila: Fila) {
    if (!confirm(`¿Borrar la sección "${fila.nombre}"?`)) return;
    setError("");
    try {
      await pedir(`/api/categorias/${fila.id}`, "DELETE");
      setFilas((prev) => prev.filter((f) => f.id !== fila.id));
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo borrar.");
    }
  }

  async function crear(e: FormEvent) {
    e.preventDefault();
    setCreando(true);
    setError("");
    try {
      const { categoria } = await pedir<{ categoria: Fila }>("/api/categorias", "POST", { nombre: nuevo, color: colorNuevo });
      setFilas((prev) => [...prev, { ...categoria, servicios: 0 }]);
      setNuevo("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear.");
    } finally {
      setCreando(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Link href="/admin/catalogo" className="text-sm text-muted hover:text-neon-green">
          ← Catálogo
        </Link>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Secciones del catálogo</h1>
        <p className="mt-1 text-sm text-muted">
          Son las pestañas del catálogo y del Inicio, en este orden. El color es la barrita de cada sección.
        </p>
      </div>

      {error && <Aviso tipo="error">{error}</Aviso>}

      <ul className="overflow-hidden rounded-2xl border border-white/10">
        {filas.map((f, i) => (
          <li key={f.id} className="flex flex-col gap-3 border-b border-white/10 bg-background-card p-4 last:border-b-0">
            <div className="flex items-center gap-3">
              <NombreEditable valor={f.nombre} onGuardar={(nombre) => guardar(f, { nombre })} />
              <span className="hidden shrink-0 text-sm text-muted sm:inline">
                {f.servicios} servicio{f.servicios === 1 ? "" : "s"}
              </span>
              <div className="flex shrink-0">
                <Icono etiqueta="Subir" onClick={() => mover(i, -1)} disabled={i === 0}>
                  <ArrowUp className="h-4 w-4" />
                </Icono>
                <Icono etiqueta="Bajar" onClick={() => mover(i, 1)} disabled={i === filas.length - 1}>
                  <ArrowDown className="h-4 w-4" />
                </Icono>
                <Icono
                  etiqueta={f.servicios ? "Tiene servicios: muévelos antes de borrarla" : "Borrar sección"}
                  onClick={() => borrar(f)}
                  disabled={f.servicios > 0}
                  peligro
                >
                  <Trash2 className="h-4 w-4" />
                </Icono>
              </div>
            </div>
            <Colores valor={f.color} onElegir={(color) => guardar(f, { color })} />
          </li>
        ))}
      </ul>

      <form onSubmit={crear} className="card-glass flex flex-col gap-3 rounded-2xl p-5">
        <h2 className="text-lg font-bold">Nueva sección</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={nuevo}
            onChange={(e) => setNuevo(e.target.value)}
            placeholder="Ej: Hora Loca, Navidad, Decoración"
            required
            minLength={2}
            maxLength={40}
            className={`${inputClase} flex-1`}
          />
          <button
            type="submit"
            disabled={creando}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neon-green px-5 text-sm font-bold text-background hover:bg-neon-green-dark disabled:opacity-50"
          >
            {creando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
            Agregar
          </button>
        </div>
        <Colores valor={colorNuevo} onElegir={setColorNuevo} />
        <p className="text-xs text-muted">Aparece en el sitio cuando tenga al menos un servicio visible.</p>
      </form>
    </div>
  );
}

/** Nombre que se edita en el lugar y se guarda al salir del campo o con Enter. */
function NombreEditable({ valor, onGuardar }: { valor: string; onGuardar: (v: string) => void }) {
  const [texto, setTexto] = useState(valor);
  const cambiado = texto.trim() !== valor && texto.trim().length >= 2;
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onBlur={() => (cambiado ? onGuardar(texto.trim()) : setTexto(valor))}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          if (e.key === "Escape") setTexto(valor);
        }}
        aria-label="Nombre de la sección"
        className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-2 text-[15px] font-semibold outline-none hover:border-white/15 focus:border-neon-green focus:bg-background"
      />
      {cambiado && <span className="shrink-0 text-xs text-gold">Enter para guardar</span>}
    </div>
  );
}

function Colores({ valor, onElegir }: { valor: string; onElegir: (c: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 pl-2" role="radiogroup" aria-label="Color">
      {COLORES_CATEGORIA.map((c) => {
        const elegido = c.toLowerCase() === valor.toLowerCase();
        return (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={elegido}
            aria-label={`Color ${c}`}
            onClick={() => !elegido && onElegir(c)}
            className={`flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 ring-offset-background-card transition-transform hover:scale-110 ${
              elegido ? "ring-2 ring-white" : ""
            }`}
            style={{ background: c }}
          >
            {elegido && <Check className="h-4 w-4 text-black" aria-hidden />}
          </button>
        );
      })}
    </div>
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
      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground/85 disabled:opacity-25 disabled:hover:bg-transparent ${
        peligro ? "hover:bg-red-500/15 hover:text-red-300" : "hover:bg-white/10 hover:text-neon-green"
      }`}
    >
      {children}
    </button>
  );
}
