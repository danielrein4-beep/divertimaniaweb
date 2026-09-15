import Link from "next/link";
import { prisma } from "@/lib/db";
import { ESTADO_EVENTO_LABEL, type EstadoEvento } from "@/lib/validation";
import EliminarEventoButton from "@/components/admin/EliminarEventoButton";

const ESTADO_BADGE: Record<EstadoEvento, string> = {
  COTIZACION: "bg-gold/15 text-gold",
  CONFIRMADO: "bg-neon-green/15 text-neon-green",
  CANCELADO: "bg-red-400/15 text-red-400",
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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Eventos{fecha ? ` · ${fecha}` : ""}</h1>
        <div className="flex gap-3">
          {fecha && (
            <Link href="/admin/eventos" className="text-sm text-muted hover:text-neon-green">
              Quitar filtro
            </Link>
          )}
          <Link
            href="/admin/eventos/nuevo"
            className="rounded-full bg-neon-green px-5 py-2 text-sm font-semibold text-background hover:scale-105"
          >
            + Nuevo evento
          </Link>
        </div>
      </div>

      {eventos.length === 0 && <p className="text-muted">No hay eventos {fecha ? "en esta fecha" : "registrados"}.</p>}

      <div className="flex flex-col gap-3">
        {eventos.map((e) => (
          <div key={e.id} className="card-glass flex flex-wrap items-center justify-between gap-3 rounded-xl p-4">
            <Link href={`/admin/eventos/${e.id}`} className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{e.tipo}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_BADGE[e.estado as EstadoEvento]}`}>
                  {ESTADO_EVENTO_LABEL[e.estado as EstadoEvento]}
                </span>
              </div>
              <p className="text-sm text-muted">
                {e.fecha} · {e.horaInicio}–{e.horaFin} · {e.cliente.nombre} · {e.cliente.telefono}
              </p>
              {e.ubicacion && <p className="text-xs text-muted">{e.ubicacion}</p>}
            </Link>
            <EliminarEventoButton id={e.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
