"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Desplegable from "@/components/admin/Desplegable";
import { listaClase } from "@/components/admin/Encabezado";
import SubirFoto from "@/components/admin/SubirFoto";
import { Aviso } from "@/components/admin/ui";
import { useColeccion } from "@/components/admin/useColeccion";

type Recreador = {
  id: string;
  nombre: string;
  cargo: string;
  descripcion: string;
  fotoUrl: string | null;
  orden: number;
  activo: boolean;
};

const FORMULARIO_VACIO = { nombre: "", cargo: "", descripcion: "", fotoUrl: "" };

/** Tarjetas de la página Equipo: agregar, editar, ocultar y borrar recreadores. */
export default function EquipoManager({ iniciales }: { iniciales: Recreador[] }) {
  const { items: recreadores, setItems: setRecreadores, error, crear, actualizar, borrar } = useColeccion(
    iniciales,
    "/api/recreadores",
    "recreador"
  );
  const [form, setForm] = useState(FORMULARIO_VACIO);
  const [creando, setCreando] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  async function agregar(e: FormEvent) {
    e.preventDefault();
    setCreando(true);
    if (await crear({ ...form, orden: recreadores.length, activo: true })) setForm(FORMULARIO_VACIO);
    setCreando(false);
  }

  async function guardarEdicion(r: Recreador) {
    if (await actualizar(r, {})) setEditandoId(null);
  }

  return (
    <div className="flex flex-col gap-6">
      {error && <Aviso tipo="error">{error}</Aviso>}
      <Desplegable etiqueta="Agregar a alguien">
      <form onSubmit={agregar} className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            Nombre
            <input
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Cargo
            <input
              required
              placeholder="Animador principal, Coordinador de shows..."
              value={form.cargo}
              onChange={(e) => setForm({ ...form, cargo: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          Descripción / características
          <textarea
            required
            rows={2}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="resize-none rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
          />
        </label>
        <div className="flex flex-col gap-1 text-sm">
          Foto
          <div className="w-40">
            <SubirFoto valor={form.fotoUrl || null} onCambio={(url) => setForm({ ...form, fotoUrl: url ?? "" })} />
          </div>
        </div>
        <button
          type="submit"
          disabled={creando}
          className="self-start rounded-full bg-neon-green px-5 py-2 text-sm font-semibold text-background hover:scale-105 disabled:opacity-60"
        >
          Agregar al equipo
        </button>
      </form>
      </Desplegable>

      <div className={listaClase}>
        {recreadores.map((r) =>
          editandoId === r.id ? (
            <div key={r.id} className="flex flex-col gap-2 px-4 py-3">
              <input
                value={r.nombre}
                onChange={(e) => setRecreadores((prev) => prev.map((x) => (x.id === r.id ? { ...x, nombre: e.target.value } : x)))}
                className="rounded-lg border border-border bg-background px-2 py-1 text-sm outline-none focus:border-neon-green"
              />
              <input
                value={r.cargo}
                onChange={(e) => setRecreadores((prev) => prev.map((x) => (x.id === r.id ? { ...x, cargo: e.target.value } : x)))}
                className="rounded-lg border border-border bg-background px-2 py-1 text-sm outline-none focus:border-neon-green"
              />
              <textarea
                rows={2}
                value={r.descripcion}
                onChange={(e) => setRecreadores((prev) => prev.map((x) => (x.id === r.id ? { ...x, descripcion: e.target.value } : x)))}
                className="resize-none rounded-lg border border-border bg-background px-2 py-1 text-sm outline-none focus:border-neon-green"
              />
              <div className="w-40">
                <SubirFoto
                  valor={r.fotoUrl}
                  onCambio={(url) => setRecreadores((prev) => prev.map((x) => (x.id === r.id ? { ...x, fotoUrl: url } : x)))}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => guardarEdicion(r)}
                  className="rounded-full bg-neon-green px-4 py-1.5 text-xs font-semibold text-background"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setEditandoId(null)}
                  className="rounded-full border border-border px-4 py-1.5 text-xs text-muted"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div key={r.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="relative h-16 w-[52px] shrink-0 overflow-hidden rounded-lg bg-black/40">
                {r.fotoUrl && <Image src={r.fotoUrl} alt="" fill sizes="52px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {r.nombre} {!r.activo && <span className="text-xs text-muted">(oculto)</span>}
                </p>
                <p className="text-xs text-neon-green">{r.cargo}</p>
                <p className="mt-1 text-xs text-muted">{r.descripcion}</p>
              </div>
              <div className="flex flex-none items-center gap-2">
                <button
                  type="button"
                  onClick={() => actualizar(r, { activo: !r.activo })}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:border-neon-green hover:text-neon-green"
                >
                  {r.activo ? "Ocultar" : "Mostrar"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditandoId(r.id)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:border-neon-green hover:text-neon-green"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => borrar(r, "¿Eliminar este recreador del equipo?")}
                  className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-muted hover:bg-red-500/10 hover:text-red-300"
                >
                  Eliminar
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
