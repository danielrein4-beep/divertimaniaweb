"use client";

import { useState } from "react";
import Link from "next/link";
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
  NUEVA: "bg-neon-green/15 text-neon-green",
  CONTACTADA: "bg-gold/15 text-gold",
  CONVERTIDA: "bg-magenta/15 text-magenta",
  DESCARTADA: "bg-white/10 text-muted",
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
    return <p className="text-muted">No hay solicitudes todavía.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {solicitudes.map((s) => (
        <div key={s.id} className="card-glass rounded-xl p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{s.nombre}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_BADGE[s.estado]}`}>
                  {ESTADO_SOLICITUD_LABEL[s.estado]}
                </span>
              </div>
              <p className="text-sm text-muted">
                {s.telefono} {s.email ? `· ${s.email}` : ""}
                {s.fechaDeseada ? ` · Fecha deseada: ${s.fechaDeseada}` : ""}
              </p>
              <p className="mt-2 text-sm">{s.mensaje}</p>
              <p className="mt-1 text-xs text-muted">{new Date(s.createdAt).toLocaleString("es-VE")}</p>
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
        </div>
      ))}
    </div>
  );
}
