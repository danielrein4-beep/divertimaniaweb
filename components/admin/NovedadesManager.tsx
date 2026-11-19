"use client";

import { FormEvent, useState } from "react";
import Desplegable from "@/components/admin/Desplegable";
import { listaClase } from "@/components/admin/Encabezado";
import SubirFoto from "@/components/admin/SubirFoto";
import { Aviso } from "@/components/admin/ui";
import { useColeccion } from "@/components/admin/useColeccion";
import { OCASIONES } from "@/lib/ocasiones";

type Novedad = {
  id: string;
  badge: string;
  titulo: string;
  descripcion: string;
  fotoUrl: string | null;
  ctaTexto: string;
  ctaUrl: string | null;
  activo: boolean;
  orden: number;
  fechaInicio?: string | null;
  fechaFin?: string | null;
};

const FORMULARIO_VACIO = { badge: "", titulo: "", descripcion: "", fotoUrl: "", ctaTexto: "Consultar disponibilidad", ctaUrl: "", fechaInicio: "", fechaFin: "" };

const SECCIONES = ["Personajes", "Servicios para tu fiesta", "Celebraciones"];

/** «2026-12-01T00:00:00.000Z» → «1 dic 2026». */
const formatoFecha = (iso: string) => new Date(iso).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** Novedades de temporada que rotan en la portada del Inicio (con fechas para que entren y salgan solas). */
export default function NovedadesManager({ iniciales, fichas }: { iniciales: Novedad[]; fichas: { id: string; nombre: string }[] }) {
  const { items: novedades, error, crear, actualizar, borrar } = useColeccion(iniciales, "/api/novedades", "novedad");
  const [form, setForm] = useState(FORMULARIO_VACIO);
  const [creando, setCreando] = useState(false);

  async function agregar(e: FormEvent) {
    e.preventDefault();
    setCreando(true);
    if (await crear({ ...form, orden: novedades.length, activo: true })) setForm(FORMULARIO_VACIO);
    setCreando(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {error && <Aviso tipo="error">{error}</Aviso>}
      <Desplegable etiqueta="Nueva novedad">
      <form onSubmit={agregar} className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            Etiqueta (badge)
            <input
              required
              placeholder="Especial de Halloween"
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Título
            <input
              required
              placeholder="¡Abrimos agenda para Halloween!"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          Descripción
          <textarea
            required
            rows={2}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="resize-none rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1 text-sm">
            Foto (opcional)
            <SubirFoto valor={form.fotoUrl || null} onCambio={(url) => setForm({ ...form, fotoUrl: url ?? "" })} aspecto="aspect-video" />
          </div>
          <label className="flex flex-col gap-1 text-sm">
            Texto del botón
            <input
              value={form.ctaTexto}
              onChange={(e) => setForm({ ...form, ctaTexto: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            ¿A dónde lleva el botón?
            <select
              value=""
              onChange={(e) => e.target.value && setForm({ ...form, ctaUrl: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            >
              <option value="">Elegir destino…</option>
              <option value="/catalogo">Catálogo completo</option>
              <option value="/contacto">Pedir cotización</option>
              <optgroup label="Una sección">
                {SECCIONES.map((s) => (
                  <option key={s} value={`/catalogo?categoria=${encodeURIComponent(s)}`}>{s}</option>
                ))}
              </optgroup>
              <optgroup label="Una ocasión">
                {OCASIONES.map((o) => (
                  <option key={o.slug} value={`/catalogo?ocasion=${o.slug}`}>Para {o.nombre.toLowerCase()}</option>
                ))}
              </optgroup>
              <optgroup label="Una ficha en particular">
                {fichas.map((f) => (
                  <option key={f.id} value={`/catalogo/${f.id}`}>{f.nombre}</option>
                ))}
              </optgroup>
            </select>
            <input
              placeholder="o escribe la dirección: /catalogo"
              value={form.ctaUrl}
              onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
              className="mt-1 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            Se muestra desde (opcional)
            <input
              type="date"
              value={form.fechaInicio}
              onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Hasta (opcional)
            <input
              type="date"
              value={form.fechaFin}
              onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
        </div>
        <p className="text-xs text-muted">
          Entra y sale sola en esas fechas, sin que tengas que tocar nada. Si no hay ninguna novedad vigente, el Inicio muestra «Lo más buscado».
        </p>
        <button
          type="submit"
          disabled={creando}
          className="self-start rounded-full bg-neon-green px-5 py-2 text-sm font-semibold text-background hover:scale-105 disabled:opacity-60"
        >
          Publicar novedad
        </button>
      </form>
      </Desplegable>

      <div className={listaClase}>
        {novedades.length === 0 && <p className="text-sm text-muted">No hay novedades todavía.</p>}
        {novedades.map((n) => (
          <div key={n.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-xs font-semibold text-neon-green">{n.badge}</p>
              <p className="font-medium">
                {n.titulo} {!n.activo && <span className="text-xs text-muted">(inactiva)</span>}
              </p>
              <p className="mt-1 text-xs text-muted">{n.descripcion}</p>
              {(n.fechaInicio || n.fechaFin) && (
                <p className="mt-1 text-xs text-muted">
                  {n.fechaInicio ? `Desde ${formatoFecha(n.fechaInicio)}` : "Desde ya"} · {n.fechaFin ? `hasta ${formatoFecha(n.fechaFin)}` : "sin fecha de salida"}
                </p>
              )}
            </div>
            <div className="flex flex-none items-center gap-2">
              <button
                type="button"
                onClick={() => actualizar(n, { activo: !n.activo })}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted hover:border-neon-green hover:text-neon-green"
              >
                {n.activo ? "Desactivar" : "Activar"}
              </button>
              <button
                type="button"
                onClick={() => borrar(n, "¿Eliminar esta novedad?")}
                className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-muted hover:bg-red-500/10 hover:text-red-300"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
