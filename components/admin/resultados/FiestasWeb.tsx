import Link from "next/link";
import { dolares, numero, type resumenReservas } from "@/lib/resultados";

type Resumen = ReturnType<typeof resumenReservas>;

/** De cada 100 personas que entran, cuántas llegan a cada paso. */
export function Recorrido({ pasos }: { pasos: { titulo: string; valor: number }[] }) {
  const base = Math.max(1, pasos[0]?.valor ?? 1);
  return (
    <section className="border border-white/10 bg-background-card rounded-xl p-5">
      <h2 className="font-semibold">El recorrido de quien visita</h2>
      <p className="text-xs text-muted">Personas en cada paso. Donde más cae el número es donde se pierde la gente.</p>
      <ol className="mt-4 grid gap-3 sm:grid-cols-5">
        {pasos.map((p, i) => (
          <li key={p.titulo} className="rounded-xl bg-background-elevated p-3">
            <p className="text-xs text-muted">
              {i + 1}. {p.titulo}
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{numero.format(p.valor)}</p>
            <div className="mt-2 h-1.5 rounded-full bg-white/5">
              <div className="h-full rounded-full bg-neon-green/70" style={{ width: `${Math.min(100, (p.valor / base) * 100)}%` }} />
            </div>
            <p className="mt-1 text-xs text-muted tabular-nums">{i === 0 ? "100 %" : `${Math.round((p.valor / base) * 100)} % de los que entraron`}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Reservas que entraron por la web en el periodo, por paso, y lo vendido en las confirmadas. */
export function FiestasPorLaWeb({ r }: { r: Resumen }) {
  const pasos: [string, number][] = [
    ["Por cotizar", r.porCotizar],
    ["Esperando anticipo", r.esperandoAnticipo],
    ["Pago por revisar", r.pagoPorRevisar],
    ["Confirmadas", r.confirmadas],
    ["No realizadas", r.noRealizadas],
  ];
  return (
    <section className="border border-white/10 bg-background-card rounded-xl p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-semibold">Fiestas apartadas por la web</h2>
          <p className="text-xs text-muted">Reservas hechas desde la página en este periodo y en qué paso va cada una.</p>
        </div>
        <Link href="/admin/reservas" className="text-sm text-neon-green hover:underline">
          Ver reservas →
        </Link>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-background-elevated p-3">
          <p className="text-xs text-muted">Fechas apartadas</p>
          <p className="text-2xl font-bold tabular-nums">{numero.format(r.apartadas)}</p>
        </div>
        <div className="rounded-xl bg-background-elevated p-3">
          <p className="text-xs text-muted">Fiestas confirmadas</p>
          <p className="text-2xl font-bold tabular-nums text-neon-green">{numero.format(r.confirmadas)}</p>
        </div>
        <div className="rounded-xl bg-background-elevated p-3">
          <p className="text-xs text-muted">Vendido en las confirmadas</p>
          <p className="text-2xl font-bold tabular-nums">{dolares.format(r.vendidoConfirmado)}</p>
          <p className="text-xs text-muted">{dolares.format(r.anticiposConfirmados)} cobrados de anticipo</p>
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-5">
        {pasos.map(([k, v]) => (
          <div key={k} className="rounded-lg border border-white/[0.06] px-3 py-2">
            <dt className="text-xs text-muted">{k}</dt>
            <dd className="font-semibold tabular-nums">{numero.format(v)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
