"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Trash2 } from "lucide-react";
import { type TipoServicioMedia } from "@/lib/validation";
import SubirFoto from "@/components/admin/SubirFoto";
import Ocasiones from "@/components/admin/servicio/Ocasiones";
import CombinaCon from "@/components/admin/servicio/CombinaCon";
import Publicacion from "@/components/admin/servicio/Publicacion";
import BarraGuardado from "@/components/admin/servicio/BarraGuardado";
import VistaPrevia from "@/components/admin/servicio/VistaPrevia";
import MediaManager from "@/components/admin/MediaManager";
import OpcionesManager from "@/components/admin/OpcionesManager";
import { pedir } from "@/lib/servidor";
import Encabezado, { botonSecundario } from "@/components/admin/Encabezado";
import { Campo, Tarjeta, inputClase } from "@/components/admin/ui";

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
  enPdf: boolean;
  activo: boolean;
  ocasiones: string | null;
  combinaCon: string | null;
};

type Media = { id: string; servicioId: string; url: string; tipo: TipoServicioMedia; poster: string | null; orden: number };
type Otro = { id: string; nombre: string; categoria: string };


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
  opciones: React.ComponentProps<typeof OpcionesManager>["opcionesIniciales"];
}) {
  const router = useRouter();
  const [guardado, setGuardado] = useState(inicial);
  const [form, setForm] = useState(inicial);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: "error" | "ok"; texto: string } | null>(null);

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
        enPdf: form.enPdf,
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


  return (
    <div className="flex flex-col gap-6 pb-28">
      <div className="[&>header]:mb-0">
        <Encabezado
          grupo={
            <Link href="/admin/catalogo" className="hover:text-neon-green">
              Catálogo · Servicios · {guardado.categoria}
            </Link>
          }
          titulo={guardado.nombre}
          extra={
            <span
              className={`rounded px-1.5 py-px text-[10.5px] font-bold uppercase tracking-wide ring-1 ring-inset ${
                guardado.activo ? "text-neon-green ring-neon-green/40" : "text-foreground/70 ring-white/20"
              }`}
            >
              {guardado.activo ? "Visible" : "Oculto"}
            </span>
          }
          acciones={
            guardado.activo && (
              <a href={`/catalogo/${guardado.id}`} target="_blank" rel="noopener noreferrer" className={botonSecundario}>
                Ver en el sitio <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            )
          }
        />
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
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

          <Ocasiones valor={form.ocasiones} onCambio={(v) => set("ocasiones", v)} />

          <CombinaCon valor={form.combinaCon} otros={otros} onCambio={(v) => set("combinaCon", v)} />

          <MediaManager
            servicioId={form.id}
            mediaInicial={media}
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
            <OpcionesManager servicioId={form.id} opcionesIniciales={opciones} />
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

        <div className="flex flex-col gap-6 xl:sticky xl:top-6">
          <Tarjeta titulo="Foto de portada" ayuda="La que se ve en el catálogo. Mejor vertical, con caras visibles.">
            <SubirFoto valor={form.fotoUrl} onCambio={(url) => set("fotoUrl", url)} />
          </Tarjeta>

          <Publicacion form={form} set={set} />

          <VistaPrevia servicio={form} />
        </div>
      </div>

      <BarraGuardado
        aviso={aviso}
        cambios={cambios}
        guardando={guardando}
        onDescartar={() => {
          setForm(guardado);
          setAviso(null);
        }}
        onGuardar={guardar}
      />
    </div>
  );
}
