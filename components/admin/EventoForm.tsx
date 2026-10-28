"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ESTADOS_EVENTO, ESTADO_EVENTO_LABEL, type EstadoEvento } from "@/lib/validation";
import type { ConflictoRecurso } from "@/lib/conflicts";
import { pedir } from "@/lib/servidor";
import { inputClase } from "@/components/admin/ui";
import { botonPrimario } from "@/components/admin/Encabezado";
import ServiciosContratados, { type ServicioOpcion } from "@/components/admin/evento/ServiciosContratados";
import RecursosAsignados, { type RecursoOpcion } from "@/components/admin/evento/RecursosAsignados";

type Servicio = ServicioOpcion;
type Recurso = RecursoOpcion;

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
  const [conflictosApi, setConflictos] = useState<ConflictoRecurso[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const recursosPayload = useMemo(
    () => Array.from(recursosAsignados.entries()).map(([recursoId, cantidadUsada]) => ({ recursoId, cantidadUsada })),
    [recursosAsignados]
  );

  const puedeHaberConflictos = Boolean(fecha && horaInicio && horaFin && recursosPayload.length > 0);
  const conflictos = puedeHaberConflictos ? conflictosApi : [];

  useEffect(() => {
    if (!puedeHaberConflictos) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      pedir<{ conflictos: ConflictoRecurso[] }>(
        "/api/eventos/conflictos",
        "POST",
        { eventoId: evento?.id ?? null, fecha, horaInicio, horaFin, recursos: recursosPayload },
        { signal: controller.signal }
      )
        .then((data) => setConflictos(data.conflictos ?? []))
        .catch(() => {});
    }, 350);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [puedeHaberConflictos, fecha, horaInicio, horaFin, recursosPayload, evento?.id]);

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

  async function guardar(e: FormEvent) {
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
      const data = await pedir<{ evento: { id: string } }>(isEdit ? `/api/eventos/${evento!.id}` : "/api/eventos", isEdit ? "PUT" : "POST", payload);
      router.push(`/admin/eventos/${data.evento.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={guardar} className="flex flex-col gap-6">
      <section className="border border-white/10 bg-background-card rounded-xl p-5">
        <h2 className="mb-4 border-b border-white/[0.07] pb-3 text-[15px] font-bold">Cliente</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm">
            Nombre*
            <input
              required
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              className={inputClase}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Teléfono*
            <input
              required
              value={clienteTelefono}
              onChange={(e) => setClienteTelefono(e.target.value)}
              className={inputClase}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Email
            <input
              type="email"
              value={clienteEmail}
              onChange={(e) => setClienteEmail(e.target.value)}
              className={inputClase}
            />
          </label>
        </div>
      </section>

      <section className="border border-white/10 bg-background-card rounded-xl p-5">
        <h2 className="mb-4 border-b border-white/[0.07] pb-3 text-[15px] font-bold">Evento</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm">
            Fecha*
            <input
              type="date"
              required
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className={inputClase}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Hora inicio*
            <input
              type="time"
              required
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className={inputClase}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Hora fin*
            <input
              type="time"
              required
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              className={inputClase}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Estado
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as EstadoEvento)}
              className={inputClase}
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
              className={inputClase}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            Ubicación
            <input
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className={inputClase}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-4">
            Notas
            <textarea
              rows={3}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className={`${inputClase} resize-none`}
            />
          </label>
        </div>
      </section>

      <ServiciosContratados servicios={servicios} elegidos={servicioIds} onAlternar={toggleServicio} />

      <RecursosAsignados
        recursos={recursos}
        asignados={recursosAsignados}
        conflictos={conflictos}
        onAlternar={toggleRecurso}
        onCantidad={setCantidadRecurso}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={submitting}
          className={botonPrimario}
        >
          {submitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear evento"}
        </button>
      </div>
    </form>
  );
}
