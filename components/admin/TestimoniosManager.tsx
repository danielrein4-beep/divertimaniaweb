"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { MessageSquareQuote } from "lucide-react";
import Desplegable from "@/components/admin/Desplegable";
import SubirFoto from "@/components/admin/SubirFoto";
import { botonPrimario, listaClase, Vacio } from "@/components/admin/Encabezado";
import { Aviso, Campo, inputClase } from "@/components/admin/ui";
import { useColeccion } from "@/components/admin/useColeccion";

type Testimonio = { id: string; nombre: string; evento: string; ciudad: string | null; texto: string; fotoUrl: string | null; activo: boolean; orden: number };

const VACIO = { nombre: "", evento: "", ciudad: "", texto: "", fotoUrl: "" };

/** Opiniones de clientes: se agregan aquí y aparecen en el Inicio y en las páginas por ocasión. */
export default function TestimoniosManager({ iniciales }: { iniciales: Testimonio[] }) {
  const { items, error, crear, actualizar, borrar } = useColeccion(iniciales, "/api/testimonios", "testimonio");
  const [form, setForm] = useState(VACIO);
  const [creando, setCreando] = useState(false);

  async function agregar(e: FormEvent) {
    e.preventDefault();
    setCreando(true);
    if (await crear({ ...form, orden: items.length, activo: true })) setForm(VACIO);
    setCreando(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {error && <Aviso tipo="error">{error}</Aviso>}
      <Desplegable etiqueta="Agregar testimonio">
        <form onSubmit={agregar} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Campo etiqueta="Nombre">
              <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="María Gómez" className={inputClase} />
            </Campo>
            <Campo etiqueta="Qué celebró">
              <input required value={form.evento} onChange={(e) => setForm({ ...form, evento: e.target.value })} placeholder="Cumpleaños de Sofía, 6 años" className={inputClase} />
            </Campo>
            <Campo etiqueta="Ciudad">
              <input value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} placeholder="San Cristóbal" className={inputClase} />
            </Campo>
          </div>
          <Campo etiqueta="Lo que dijo" ayuda="Con sus palabras, como lo escribió por WhatsApp o Instagram. Pide su permiso antes de publicarlo.">
            <textarea required rows={3} value={form.texto} onChange={(e) => setForm({ ...form, texto: e.target.value })} className={inputClase} />
          </Campo>
          <Campo etiqueta="Foto (opcional)" ayuda="Una foto de la fiesta o de la persona.">
            <SubirFoto valor={form.fotoUrl || null} onCambio={(url) => setForm({ ...form, fotoUrl: url ?? "" })} />
          </Campo>
          <button type="submit" disabled={creando} className={`${botonPrimario} self-start`}>
            Publicar testimonio
          </button>
        </form>
      </Desplegable>

      {items.length === 0 ? (
        <Vacio
          icono={<MessageSquareQuote className="h-6 w-6" aria-hidden />}
          titulo="Todavía no hay testimonios"
          texto="Las opiniones de clientes son lo que más convence. Copia los mensajes bonitos que les llegan por WhatsApp o Instagram."
        />
      ) : (
        <ul className={listaClase}>
          {items.map((t) => (
            <li key={t.id} className="flex items-start gap-4 px-4 py-4">
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/10">
                {t.fotoUrl && <Image src={t.fotoUrl} alt="" fill sizes="48px" className="object-cover" />}
              </span>
              <div className={`min-w-0 flex-1 ${t.activo ? "" : "opacity-50"}`}>
                <p className="font-semibold">
                  {t.nombre} <span className="font-normal text-muted">· {t.evento}{t.ciudad ? ` · ${t.ciudad}` : ""}</span>
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-foreground/85">«{t.texto}»</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => actualizar(t, { activo: !t.activo })}
                  className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-muted hover:bg-white/10 hover:text-foreground"
                >
                  {t.activo ? "Ocultar" : "Mostrar"}
                </button>
                <button
                  type="button"
                  onClick={() => borrar(t, "¿Borrar este testimonio?")}
                  className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-muted hover:bg-red-500/10 hover:text-red-300"
                >
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
