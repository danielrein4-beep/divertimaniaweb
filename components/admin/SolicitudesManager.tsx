"use client";

import { useState } from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { listaClase, Vacio } from "@/components/admin/Encabezado";
import { ESTADOS_SOLICITUD, ESTADO_SOLICITUD_LABEL, type EstadoSolicitud } from "@/lib/validation";

type Solicitud = {
  id: string;
  nombre: string;
  telefono: string;
  email: string | null;
  mensaje: string;
  fechaDeseada: string | null;
  estado: EstadoSolicitud;
  createdAt: string;
};

const ESTADO_BADGE: Record<EstadoSolicitud, string> = {
  NUEVA: "text-neon-green ring-neon-green/40",
  CONTACTADA: "text-gold ring-gold/40",
  CONVERTIDA: "text-magenta ring-magenta/40",
  DESCARTADA: "text-muted ring-white/20",
};

export default function SolicitudesManager({ initialSolicitudes }: { initialSolicitudes: Solicitud[] }) {
  const [solicitudes, setSolicitudes] = useState(initialSolicitudes);

  async function cambiarEstado(id: string, estado: EstadoSolicitud) {
    setSolicitudes((prev) => prev.map((s) => (s.id === id ? { ...s, estado } : s)));
    await fetch(`/api/solicitudes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
  }

  if (solicitudes.length === 0) {
    return (
      <Vacio
        icono={<Inbox className="h-6 w-6" aria-hidden />}
        titulo="Sin solicitudes por ahora"
        texto="Cuando alguien llene el formulario de Contacto, aparece aquí con su teléfono, la fecha que busca y su mensaje."
      />
    );
  }

  return (
    <ul className={listaClase}>
      {solicitudes.map((s) => (
        <li key={s.id} className="px-4 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{s.nombre}</span>
                <span className={`rounded px-1.5 py-px text-[10.5px] font-bold uppercase tracking-wide ring-1 ring-inset ${ESTADO_BADGE[s.estado]}`}>
                  {ESTADO_SOLICITUD_LABEL[s.estado]}
                </span>
              </div>
              <p className="text-sm text-muted">
                {s.telefono} {s.email ? `· ${s.email}` : ""}
                {s.fechaDeseada ? ` · Fecha deseada: ${s.fechaDeseada}` : ""}
              </p>
              <p className="mt-2 text-sm">{s.mensaje}</p>
              <p className="mt-1 font-mono text-xs tabular-nums text-muted">{new Date(s.createdAt).toLocaleString("es-VE")}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <select
                value={s.estado}
                onChange={(e) => cambiarEstado(s.id, e.target.value as EstadoSolicitud)}
                className="rounded-lg border border-border bg-background px-2 py-1 text-sm outline-none focus:border-neon-green"
              >
                {ESTADOS_SOLICITUD.map((estado) => (
                  <option key={estado} value={estado}>
                    {ESTADO_SOLICITUD_LABEL[estado]}
                  </option>
                ))}
              </select>
              <Link
                href={`/admin/eventos/nuevo`}
                className="text-xs text-neon-green hover:underline"
              >
                Crear evento →
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
