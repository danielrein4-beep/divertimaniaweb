"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MonthCalendar from "@/components/calendar/MonthCalendar";
import { todayStr } from "@/lib/date";

type FechaConteo = { fecha: string; cantidad: number };

function nivelActividad(cantidad: number): { label: string; className: string } {
  if (cantidad === 0) return { label: "", className: "" };
  if (cantidad <= 2) return { label: "Con actividad", className: "bg-neon-green/20 text-neon-green" };
  return { label: "Alta demanda", className: "bg-gold/20 text-gold" };
}

export default function DisponibilidadPage() {
  const [conteos, setConteos] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const today = todayStr();

  useEffect(() => {
    fetch("/api/eventos/publico")
      .then((res) => res.json())
      .then((data: { fechas: FechaConteo[] }) => {
        setConteos(new Map(data.fechas.map((f) => [f.fecha, f.cantidad])));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Disponibilidad</h1>
        <p className="mx-auto mt-2 max-w-lg text-muted">
          Este calendario es informativo: como contamos con varios equipos, en muchos casos
          podemos cubrir tu evento aunque el día ya tenga actividad. Escríbenos para confirmar.
        </p>
      </div>

      <MonthCalendar
        renderDay={(dateStr, day) => {
          const cantidad = conteos.get(dateStr) ?? 0;
          const nivel = nivelActividad(cantidad);
          const esPasado = dateStr < today;
          return (
            <div
              className={`flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-lg text-sm ${
                esPasado ? "text-muted/40" : "text-foreground"
              } ${dateStr === today ? "ring-1 ring-neon-green" : ""}`}
            >
              <span>{day}</span>
              {!esPasado && nivel.label && !loading && (
                <span className={`rounded-full px-1.5 text-[10px] font-medium ${nivel.className}`}>
                  {nivel.label}
                </span>
              )}
            </div>
          );
        }}
      />

      <div className="mt-10 flex flex-col items-center gap-4 text-center">
        <p className="text-muted">¿Ya tienes una fecha en mente?</p>
        <Link
          href="/contacto"
          className="rounded-full bg-neon-green px-6 py-3 font-semibold text-background transition-transform hover:scale-105"
        >
          Consultar esta fecha
        </Link>
      </div>
    </div>
  );
}
