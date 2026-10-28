import Link from "next/link";
import { CalendarPlus, MapPin, PartyPopper, Plus, X } from "lucide-react";
import { prisma } from "@/lib/db";
import { ESTADO_EVENTO_LABEL, type EstadoEvento } from "@/lib/validation";
import EliminarEventoButton from "@/components/admin/EliminarEventoButton";
import Encabezado, { botonPrimario, botonSecundario, listaClase, Vacio } from "@/components/admin/Encabezado";

export const dynamic = "force-dynamic";

const ESTADO_BADGE: Record<EstadoEvento, string> = {
  COTIZACION: "text-gold ring-gold/40",
  CONFIRMADO: "text-neon-green ring-neon-green/40",
  CANCELADO: "text-red-300 ring-red-400/40",
};

export default async function EventosPage({
  searchParams,
}: {
  searchParams: Promise<{ fecha?: string }>;
}) {
  const { fecha } = await searchParams;

  const eventos = await prisma.evento.findMany({
    where: fecha ? { fecha } : undefined,
    include: { cliente: true },
    orderBy: [{ fecha: "desc" }, { horaInicio: "asc" }],
  });

  return (
    <div>
      <Encabezado
        grupo="Negocio"
        titulo="Eventos"
        extra={fecha ? <span className="font-mono text-sm tabular-nums text-muted">{fecha}</span> : null}
        descripcion="Cada fiesta agendada con su cliente, servicios y recursos."
        acciones={
          <>
            {fecha && (
              <Link href="/admin/eventos" className={botonSecundario}>
                <X className="h-4 w-4" aria-hidden /> Quitar filtro
              </Link>
            )}
            <Link href="/admin/eventos/nuevo" className={botonPrimario}>
              <Plus className="h-4 w-4" aria-hidden /> Nuevo evento
            </Link>
          </>
        }
      />

      {eventos.length === 0 ? (
        <Vacio
          icono={<PartyPopper className="h-6 w-6" aria-hidden />}
          titulo={fecha ? "No hay eventos en esta fecha" : "Todavía no hay eventos"}
          texto="Cuando cierres una fiesta, regístrala aquí: el calendario la muestra y el inventario avisa si algo se cruza."
          accion={
            <Link href="/admin/eventos/nuevo" className={botonPrimario}>
              <CalendarPlus className="h-4 w-4" aria-hidden /> Registrar el primero
            </Link>
          }
        />
      ) : (
        <ul className={listaClase}>
          {eventos.map((e) => (
            <li key={e.id} className="flex items-center gap-4 px-4 py-3">
              <div className="w-20 shrink-0 font-mono text-xs tabular-nums text-foreground/70">
                <p>{e.fecha}</p>
                <p className="text-muted">
                  {e.horaInicio}–{e.horaFin}
                </p>
              </div>
              <Link href={`/admin/eventos/${e.id}`} className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{e.tipo}</span>
                  <span className={`rounded px-1.5 py-px text-[10.5px] font-bold uppercase tracking-wide ring-1 ring-inset ${ESTADO_BADGE[e.estado as EstadoEvento]}`}>
                    {ESTADO_EVENTO_LABEL[e.estado as EstadoEvento]}
                  </span>
                </p>
                <p className="mt-0.5 truncate text-sm text-muted">
                  {e.cliente.nombre} · {e.cliente.telefono}
                  {e.ubicacion && (
                    <span className="ml-2 inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" aria-hidden /> {e.ubicacion}
                    </span>
                  )}
                </p>
              </Link>
              <EliminarEventoButton id={e.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
