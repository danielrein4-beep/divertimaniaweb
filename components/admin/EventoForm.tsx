"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ESTADOS_EVENTO, ESTADO_EVENTO_LABEL, TIPO_RECURSO_LABEL, type EstadoEvento } from "@/lib/validation";
import type { ConflictoRecurso } from "@/lib/conflicts";

type Servicio = { id: string; nombre: string; categoria: string };
type Recurso = { id: string; nombre: string; tipo: "PERSONAJE" | "EQUIPO" | "PERSONAL"; cantidadTotal: number };

type EventoInicial = {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tipo: string;
  ubicacion: string | null;
  estado: EstadoEvento;
  notas: string | null;
  cliente: { nombre: string; telefono: string | null; email: string | null };
  servicios: { servicioId: string }[];
  recursos: { recursoId: string; cantidadUsada: number }[];
};

export default function EventoForm({
  servicios,
  recursos,
  evento,
}: {
  servicios: Servicio[];
  recursos: Recurso[];
  evento?: EventoInicial;
}) {
  const router = useRouter();
  const isEdit = Boolean(evento);

  const [clienteNombre, setClienteNombre] = useState(evento?.cliente.nombre ?? "");
  const [clienteTelefono, setClienteTelefono] = useState(evento?.cliente.telefono ?? "");
  const [clienteEmail, setClienteEmail] = useState(evento?.cliente.email ?? "");
  const [fecha, setFecha] = useState(evento?.fecha ?? "");
  const [horaInicio, setHoraInicio] = useState(evento?.horaInicio ?? "");
  const [horaFin, setHoraFin] = useState(evento?.horaFin ?? "");
  const [tipo, setTipo] = useState(evento?.tipo ?? "");
  const [ubicacion, setUbicacion] = useState(evento?.ubicacion ?? "");
  const [estado, setEstado] = useState<EstadoEvento>(evento?.estado ?? "COTIZACION");
  const [notas, setNotas] = useState(evento?.notas ?? "");
  const [servicioIds, setServicioIds] = useState<Set<string>>(
    new Set(evento?.servicios.map((s) => s.servicioId) ?? [])
  );
  const [recursosAsignados, setRecursosAsignados] = useState<Map<string, number>>(
    new Map(evento?.recursos.map((r) => [r.recursoId, r.cantidadUsada]) ?? [])
  );
  const [conflictos, setConflictos] = useState<ConflictoRecurso[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const recursosPayload = useMemo(
    () => Array.from(recursosAsignados.entries()).map(([recursoId, cantidadUsada]) => ({ recursoId, cantidadUsada })),
    [recursosAsignados]
  );

  useEffect(() => {
    if (!fecha || !horaInicio || !horaFin || recursosPayload.length === 0) {
      setConflictos([]);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch("/api/eventos/conflictos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          eventoId: evento?.id ?? null,
          fecha,
          horaInicio,
          horaFin,
          recursos: recursosPayload,
        }),
      })
        .then((res) => res.json())
        .then((data) => setConflictos(data.conflictos ?? []))
        .catch(() => {});
    }, 350);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [fecha, horaInicio, horaFin, recursosPayload, evento?.id]);

  function toggleServicio(id: string) {
    setServicioIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleRecurso(id: string) {
    setRecursosAsignados((prev) => {
      const next = new Map(prev);
      if (next.has(id)) next.delete(id);
      else next.set(id, 1);
      return next;
    });
  }

  function setCantidadRecurso(id: string, cantidad: number) {
    setRecursosAsignados((prev) => {
      const next = new Map(prev);
      next.set(id, Math.max(1, cantidad));
      return next;
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      clienteNombre,
      clienteTelefono,
      clienteEmail,
      fecha,
      horaInicio,
      horaFin,
      tipo,
      ubicacion,
      estado,
      notas,
      servicioIds: Array.from(servicioIds),
      recursos: recursosPayload,
    };

    try {
      const res = await fetch(isEdit ? `/api/eventos/${evento!.id}` : "/api/eventos", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "No se pudo guardar el evento");
      }
      const data = await res.json();
      router.push(`/admin/eventos/${data.evento.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setSubmitting(false);
    }
  }

  const serviciosPorCategoria = new Map<string, Servicio[]>();
  for (const s of servicios) {
    const lista = serviciosPorCategoria.get(s.categoria) ?? [];
    lista.push(s);
    serviciosPorCategoria.set(s.categoria, lista);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <section className="card-glass rounded-2xl p-5">
        <h2 className="mb-4 font-semibold">Cliente</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm">
            Nombre*
            <input
              required
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Teléfono*
            <input
              required
              value={clienteTelefono}
              onChange={(e) => setClienteTelefono(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Email
            <input
              type="email"
              value={clienteEmail}
              onChange={(e) => setClienteEmail(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
        </div>
      </section>

      <section className="card-glass rounded-2xl p-5">
        <h2 className="mb-4 font-semibold">Evento</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm">
            Fecha*
            <input
              type="date"
              required
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Hora inicio*
            <input
              type="time"
              required
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Hora fin*
            <input
              type="time"
              required
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Estado
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as EstadoEvento)}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            >
              {ESTADOS_EVENTO.map((s) => (
                <option key={s} value={s}>
                  {ESTADO_EVENTO_LABEL[s]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            Tipo de evento*
            <input
              required
              placeholder="Ej. 15 años, Boda, Cumpleaños infantil..."
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            Ubicación
            <input
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-4">
            Notas
            <textarea
              rows={3}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="resize-none rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-neon-green"
            />
          </label>
        </div>
      </section>

      <section className="card-glass rounded-2xl p-5">
        <h2 className="mb-4 font-semibold">Servicios contratados</h2>
        <div className="flex flex-col gap-4">
          {Array.from(serviciosPorCategoria.entries()).map(([categoria, items]) => (
            <div key={categoria}>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">{categoria}</p>
              <div className="flex flex-wrap gap-2">
                {items.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => toggleServicio(s.id)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      servicioIds.has(s.id)
                        ? "border-neon-green bg-neon-green/10 text-neon-green"
                        : "border-border text-foreground/80 hover:border-neon-green/50"
                    }`}
                  >
                    {s.nombre}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card-glass rounded-2xl p-5">
        <h2 className="mb-1 font-semibold">Recursos asignados</h2>
        <p className="mb-4 text-xs text-muted">
          Asigna trajes, equipos o personal específico. El sistema avisa (sin bloquear) si un
          recurso queda comprometido con otro evento que se solape en horario.
        </p>

        {conflictos.length > 0 && (
          <div className="mb-4 flex flex-col gap-2 rounded-xl border border-gold/40 bg-gold/10 p-3 text-sm text-gold">
            {conflictos.map((c) => (
              <div key={c.recursoId}>
                <strong>{c.recursoNombre}</strong>: asignado {c.cantidadAsignada} de {c.cantidadTotal}{" "}
                disponibles en ese horario, junto con{" "}
                {c.eventosEnConflicto.map((ev) => `${ev.tipo} (${ev.horaInicio}-${ev.horaFin})`).join(", ")}.
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {recursos.map((r) => {
            const asignado = recursosAsignados.has(r.id);
            const tieneConflicto = conflictos.some((c) => c.recursoId === r.id);
            return (
              <div
                key={r.id}
                className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 ${
                  tieneConflicto ? "border-gold/50" : "border-border"
                }`}
              >
                <label className="flex flex-1 items-center gap-2 text-sm">
                  <input type="checkbox" checked={asignado} onChange={() => toggleRecurso(r.id)} />
                  {r.nombre}
                  <span className="text-xs text-muted">
                    ({TIPO_RECURSO_LABEL[r.tipo]} · disponibles: {r.cantidadTotal})
                  </span>
                </label>
                {asignado && (
                  <input
                    type="number"
                    min={1}
                    value={recursosAsignados.get(r.id)}
                    onChange={(e) => setCantidadRecurso(r.id, Number(e.target.value))}
                    className="w-16 rounded-lg border border-border bg-background px-2 py-1 text-sm outline-none focus:border-neon-green"
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-neon-green px-6 py-2.5 font-semibold text-background transition-transform hover:scale-105 disabled:opacity-60"
        >
          {submitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear evento"}
        </button>
      </div>
    </form>
  );
}
