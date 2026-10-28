"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import Encabezado, { botonPrimario } from "@/components/admin/Encabezado";
import Desplegable from "@/components/admin/Desplegable";
import { ListaOrdenable, useFilaOrdenable } from "@/components/admin/catalogo/Ordenable";
import VistaPreviaSecciones from "@/components/admin/catalogo/VistaPreviaSecciones";
import { COLORES_CATEGORIA } from "@/lib/categorias-comun";
import { pedir } from "@/lib/servidor";
import { Aviso, inputClase } from "@/components/admin/ui";

type Fila = { id: string; nombre: string; color: string; servicios: number };

/** Secciones del catálogo: crear, renombrar, cambiar color, ordenar arrastrando y borrar (si están vacías). */
export default function CategoriasManager({ iniciales }: { iniciales: Fila[] }) {
  const router = useRouter();
  const [filas, setFilas] = useState(iniciales);
  const [error, setError] = useState("");
  // Sube con cada cambio guardado para que la vista previa del PDF se vuelva a pedir.
  const [version, setVersion] = useState(0);

  /** Cambio optimista: se ve al instante y, si el servidor falla, vuelve atrás. */
  async function aplicar(nuevas: Fila[], envio: () => Promise<unknown>, falla: string) {
    const anterior = filas;
    setFilas(nuevas);
    setError("");
    try {
      await envio();
      setVersion((v) => v + 1);
      router.refresh();
    } catch (e) {
      setFilas(anterior);
      setError(e instanceof Error ? e.message : falla);
    }
  }

  const guardar = (fila: Fila, cambio: Partial<Pick<Fila, "nombre" | "color">>) =>
    aplicar(filas.map((f) => (f.id === fila.id ? { ...f, ...cambio } : f)), () => pedir(`/api/categorias/${fila.id}`, "PUT", cambio), "No se pudo guardar.");

  const ordenar = (nuevas: Fila[]) => aplicar(nuevas, () => pedir("/api/categorias", "PUT", { ids: nuevas.map((f) => f.id) }), "No se pudo ordenar.");

  function borrar(fila: Fila) {
    if (!confirm(`¿Borrar la sección "${fila.nombre}"?`)) return;
    aplicar(filas.filter((f) => f.id !== fila.id), () => pedir(`/api/categorias/${fila.id}`, "DELETE"), "No se pudo borrar.");
  }

  return (
    <div>
      <Encabezado
        grupo="Catálogo"
        titulo="Secciones"
        descripcion="Las pestañas del catálogo, del Inicio y los capítulos del PDF, en este orden. Arrastra para ordenar; el color es la barrita de cada sección."
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="flex flex-col gap-5">
          {error && <Aviso tipo="error">{error}</Aviso>}

          <ol className="rounded-xl border border-white/10">
            <ListaOrdenable id="orden-secciones-pagina" items={filas} onOrden={ordenar}>
              {filas.map((f, i) => (
                <FilaSeccion
                  key={f.id}
                  fila={f}
                  posicion={i}
                  onGuardar={(cambio) => guardar(f, cambio)}
                  onBorrar={() => borrar(f)}
                />
              ))}
            </ListaOrdenable>
          </ol>

          <NuevaSeccion
            onCreada={(fila) => {
              setFilas((prev) => [...prev, fila]);
              setVersion((v) => v + 1);
              router.refresh();
            }}
            onError={setError}
          />
        </div>

        <VistaPreviaSecciones secciones={filas} version={version} />
      </div>
    </div>
  );
}

function FilaSeccion({
  fila: f,
  posicion,
  onGuardar,
  onBorrar,
}: {
  fila: Fila;
  posicion: number;
  onGuardar: (cambio: Partial<Pick<Fila, "nombre" | "color">>) => void;
  onBorrar: () => void;
}) {
  const { ref, estilo, agarradera, arrastrando } = useFilaOrdenable(f.id);
  return (
    <li
      ref={ref}
      style={estilo}
      className={`flex flex-col gap-3 border-b border-white/[0.07] px-3 py-3.5 last:border-b-0 ${
        arrastrando ? "bg-background-elevated shadow-[0_8px_30px_rgba(0,0,0,0.6)] ring-1 ring-neon-green/50" : "bg-background-card"
      }`}
    >
      <div className="flex items-center gap-2">
        {agarradera}
        <span className="w-6 text-right font-mono text-xs tabular-nums text-foreground/45">{String(posicion + 1).padStart(2, "0")}</span>
        <span className="h-5 w-1.5 shrink-0 rounded-full" style={{ background: f.color }} aria-hidden />
        <NombreEditable valor={f.nombre} onGuardar={(nombre) => onGuardar({ nombre })} />
        <span className="hidden shrink-0 font-mono text-xs tabular-nums text-muted sm:inline">
          {f.servicios} servicio{f.servicios === 1 ? "" : "s"}
        </span>
        <button
          type="button"
          onClick={onBorrar}
          disabled={f.servicios > 0}
          aria-label={f.servicios ? "Tiene servicios: muévelos antes de borrarla" : "Borrar sección"}
          title={f.servicios ? "Tiene servicios: muévelos antes de borrarla" : "Borrar sección"}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-foreground/70 hover:bg-red-500/15 hover:text-red-300 disabled:opacity-25 disabled:hover:bg-transparent"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="pl-[4.25rem]">
        <Colores valor={f.color} onElegir={(color) => onGuardar({ color })} />
      </div>
    </li>
  );
}

function NuevaSeccion({ onCreada, onError }: { onCreada: (fila: Fila) => void; onError: (texto: string) => void }) {
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState(COLORES_CATEGORIA[0]);
  const [creando, setCreando] = useState(false);

  async function crear(e: FormEvent) {
    e.preventDefault();
    setCreando(true);
    onError("");
    try {
      const { categoria } = await pedir<{ categoria: Fila }>("/api/categorias", "POST", { nombre, color });
      onCreada({ ...categoria, servicios: 0 });
      setNombre("");
    } catch (err) {
      onError(err instanceof Error ? err.message : "No se pudo crear.");
    } finally {
      setCreando(false);
    }
  }

  return (
    <Desplegable etiqueta="Nueva sección">
      <form onSubmit={crear} className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Hora Loca, Navidad, Decoración"
            required
            minLength={2}
            maxLength={40}
            className={`${inputClase} flex-1`}
          />
          <button type="submit" disabled={creando} className={botonPrimario}>
            {creando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
            Agregar
          </button>
        </div>
        <Colores valor={color} onElegir={setColor} />
        <p className="text-xs text-muted">Aparece en el sitio y en el PDF cuando tenga al menos un servicio visible.</p>
      </form>
    </Desplegable>
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
        className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 py-1.5 text-[15px] font-semibold outline-none hover:border-white/15 focus:border-neon-green focus:bg-background"
      />
      {cambiado && <span className="shrink-0 text-xs text-gold">Enter para guardar</span>}
    </div>
  );
}

function Colores({ valor, onElegir }: { valor: string; onElegir: (c: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Color">
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
            className={`flex h-7 w-7 items-center justify-center rounded-full ring-offset-2 ring-offset-background-card transition-transform hover:scale-110 ${
              elegido ? "ring-2 ring-white" : ""
            }`}
            style={{ background: c }}
          >
            {elegido && <Check className="h-3.5 w-3.5 text-black" aria-hidden />}
          </button>
        );
      })}
    </div>
  );
}
