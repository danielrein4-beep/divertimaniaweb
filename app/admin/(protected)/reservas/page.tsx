import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { prisma } from "@/lib/db";
import Encabezado, { listaClase, Vacio } from "@/components/admin/Encabezado";
import { ESTADOS_RESERVA, ESTADO_RESERVA_LABEL, type EstadoReserva } from "@/lib/reservas/estados";
import { COLOR_ESTADO } from "@/lib/reservas/colores";

export const dynamic = "force-dynamic";

export default async function ReservasPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  const filtro = ESTADOS_RESERVA.find((e) => e === estado);
  const [reservas, conteo] = await Promise.all([
    prisma.reserva.findMany({ where: filtro ? { estado: filtro } : undefined, orderBy: [{ createdAt: "desc" }], take: 200 }),
    prisma.reserva.groupBy({ by: ["estado"], _count: { _all: true } }),
  ]);
  const cuantas = (e: string) => conteo.find((c) => c.estado === e)?._count._all ?? 0;

  return (
    <div>
      <Encabezado
        grupo="Negocio"
        titulo="Reservas"
        descripcion="Fechas apartadas desde la web. Pon el monto del anticipo, revisa el comprobante y al confirmar el evento pasa solo al calendario."
      />
      <nav aria-label="Filtrar por estado" className="mb-5 flex flex-wrap gap-2">
        {[null, ...ESTADOS_RESERVA].map((e) => (
          <Link
            key={e ?? "todas"}
            href={e ? `/admin/reservas?estado=${e}` : "/admin/reservas"}
            className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-semibold ${
              filtro === e || (!filtro && !e) ? "border-neon-green bg-neon-green/15 text-neon-green" : "border-white/15 text-foreground/80 hover:border-white/35"
            }`}
          >
            {e ? ESTADO_RESERVA_LABEL[e] : "Todas"}
            <span className="font-mono text-xs tabular-nums opacity-70">{e ? cuantas(e) : conteo.reduce((s, c) => s + c._count._all, 0)}</span>
          </Link>
        ))}
      </nav>

      {reservas.length === 0 ? (
        <Vacio
          icono={<CalendarCheck className="h-6 w-6" aria-hidden />}
          titulo={filtro ? "No hay reservas en este estado" : "Todavía no hay reservas"}
          texto="Cuando alguien aparte su fecha desde la web, aparece aquí para cotizarla y confirmarla."
        />
      ) : (
        <ul className={listaClase}>
          {reservas.map((r) => (
            <li key={r.id}>
              <Link href={`/admin/reservas/${r.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.03]">
                <div className="w-24 shrink-0 font-mono text-xs tabular-nums">
                  <p className="text-foreground/85">{r.fecha}</p>
                  <p className="text-muted">{r.codigo}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{r.tipoEvento}</span>
                    <span className={`rounded px-1.5 py-px text-[10.5px] font-bold uppercase tracking-wide ring-1 ring-inset ${COLOR_ESTADO[r.estado as EstadoReserva]}`}>
                      {ESTADO_RESERVA_LABEL[r.estado as EstadoReserva]}
                    </span>
                  </p>
                  <p className="mt-0.5 truncate text-sm text-muted">
                    {r.nombre} · {r.zona}
                  </p>
                </div>
                <p className="hidden shrink-0 font-mono text-sm tabular-nums sm:block">{r.montoAnticipo != null ? `US$ ${r.montoAnticipo}` : "—"}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
