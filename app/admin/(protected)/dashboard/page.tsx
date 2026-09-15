"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MonthCalendar from "@/components/calendar/MonthCalendar";
import { todayStr } from "@/lib/date";
import { ESTADO_EVENTO_LABEL, type EstadoEvento } from "@/lib/validation";

type EventoResumen = {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tipo: string;
  estado: EstadoEvento;
  cliente: { nombre: string };
};

const ESTADO_DOT: Record<EstadoEvento, string> = {
  COTIZACION: "bg-gold",
  CONFIRMADO: "bg-neon-green",
  CANCELADO: "bg-red-400",
};

export default function AdminDashboardPage() {
  const [eventos, setEventos] = useState<EventoResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const today = todayStr();

  useEffect(() => {
    fetch("/api/eventos")
      .then((res) => res.json())
      .then((data) => setEventos(data.eventos ?? []))
      .finally(() => setLoading(false));
  }, []);

  const porFecha = new Map<string, EventoResumen[]>();
  for (const e of eventos) {
    const lista = porFecha.get(e.fecha) ?? [];
    lista.push(e);
    porFecha.set(e.fecha, lista);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Calendario de eventos</h1>
        <Link
          href="/admin/eventos/nuevo"
          className="rounded-full bg-neon-green px-5 py-2 text-sm font-semibold text-background hover:scale-105"
        >
          + Nuevo evento
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <MonthCalendar
          renderDay={(dateStr, day) => {
            const eventosDia = porFecha.get(dateStr) ?? [];
            return (
              <Link
                href={`/admin/eventos?fecha=${dateStr}`}
                className={`flex h-full w-full flex-col items-center justify-start gap-1 rounded-lg p-1 text-sm hover:bg-background-card ${
                  dateStr === today ? "ring-1 ring-neon-green" : ""
                }`}
              >
                <span>{day}</span>
                {eventosDia.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-0.5">
                    {eventosDia.slice(0, 4).map((e) => (
                      <span key={e.id} className={`h-1.5 w-1.5 rounded-full ${ESTADO_DOT[e.estado]}`} />
                    ))}
                  </div>
                )}
                {eventosDia.length > 0 && (
                  <span className="text-[10px] text-muted">{eventosDia.length}</span>
                )}
              </Link>
            );
          }}
        />

        <div className="card-glass h-fit rounded-2xl p-5">
          <h2 className="mb-3 font-semibold">Próximos eventos</h2>
          {loading && <p className="text-sm text-muted">Cargando...</p>}
          {!loading && eventos.filter((e) => e.fecha >= today).length === 0 && (
            <p className="text-sm text-muted">No hay eventos próximos.</p>
          )}
          <ul className="flex flex-col gap-3">
            {eventos
              .filter((e) => e.fecha >= today)
              .slice(0, 8)
              .map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/eventos/${e.id}`} className="block rounded-lg p-2 hover:bg-background-card">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className={`h-2 w-2 rounded-full ${ESTADO_DOT[e.estado]}`} />
                      {e.tipo}
                    </div>
                    <p className="text-xs text-muted">
                      {e.fecha} · {e.horaInicio}–{e.horaFin} · {e.cliente.nombre}
                    </p>
                    <p className="text-xs text-muted">{ESTADO_EVENTO_LABEL[e.estado]}</p>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
