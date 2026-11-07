import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import { getConfigSitio } from "@/lib/configSitio";
import { buildWhatsAppLink } from "@/lib/telefono";
import { formatFechaAmigable } from "@/lib/miFiesta";
import { PAGOS } from "@/lib/negocio";
import { leerServicios, PASOS_CLIENTE, type EstadoReserva } from "@/lib/reservas/estados";
import SubirComprobante from "@/components/site/reservas/SubirComprobante";
import CuentasCliente from "@/components/site/reservas/CuentasCliente";
import { cuentasActivas, leerCuentas, metodosDisponibles } from "@/lib/cuentasPago";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mi reserva | Divertimania", robots: { index: false, follow: false } };

/** Página privada del cliente (solo con su enlace): estado, datos, cómo pagar y subir el comprobante. */
export default async function MiReserva({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const [reserva, { whatsapp }, config] = await Promise.all([
    prisma.reserva.findUnique({ where: { token } }),
    getConfigSitio(),
    prisma.configuracionSitio.findUnique({ where: { id: "principal" }, select: { datosPago: true } }),
  ]);
  if (!reserva) notFound();

  const estado = reserva.estado as EstadoReserva;
  const indice = PASOS_CLIENTE.findIndex((p) => p.estado === estado);
  const servicios = leerServicios(reserva.servicios);
  const hablar = buildWhatsAppLink(whatsapp, `Hola Divertimania, les escribo por mi reserva ${reserva.codigo}.`);
  const pagando = estado === "ESPERANDO_PAGO" || estado === "PAGO_REPORTADO";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-sm text-neon-green">Reserva {reserva.codigo}</p>
      <h1 className="type-h1 mt-2 font-display font-extrabold">
        {estado === "CONFIRMADA" ? "¡Tu fecha está confirmada!" : estado === "RECHAZADA" ? "Esta reserva no se realizó" : `Hola, ${reserva.nombre.split(" ")[0]}`}
      </h1>
      <p className="mt-2 text-muted">
        {reserva.tipoEvento} · {formatFechaAmigable(reserva.fecha)}
        {reserva.horaInicio ? ` · ${reserva.horaInicio}` : ""} · {reserva.zona}
      </p>

      {estado !== "RECHAZADA" && (
        <ol className="mt-8 flex flex-col gap-4">
          {PASOS_CLIENTE.map((p, i) => {
            const hecho = i < indice || estado === "CONFIRMADA";
            const actual = i === indice && estado !== "CONFIRMADA";
            return (
              <li key={p.estado} className={`flex gap-4 ${i > indice ? "opacity-45" : ""}`}>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    hecho ? "bg-neon-green text-background" : actual ? "border-2 border-neon-green text-neon-green" : "border border-white/20"
                  }`}
                >
                  {hecho ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
                </span>
                <div>
                  <p className="font-display text-lg font-bold">{p.titulo}</p>
                  {(actual || (estado === "CONFIRMADA" && p.estado === "CONFIRMADA")) && <p className="text-sm text-muted">{p.texto}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {pagando && (
        <section className="mt-10 flex flex-col gap-6 rounded-2xl border border-neon-green/40 bg-neon-green/[0.05] p-6">
          <div>
            <p className="text-sm text-muted">Anticipo para apartar tu fecha</p>
            <p className="font-display text-4xl font-extrabold text-neon-green">US$ {reserva.montoAnticipo}</p>
            {reserva.montoTotal != null && <p className="mt-1 text-sm text-muted">Total cotizado: US$ {reserva.montoTotal}. El resto se paga el día del evento.</p>}
          </div>
          <CuentasCliente cuentas={cuentasActivas(config?.datosPago)} textoLibre={leerCuentas(config?.datosPago).textoLibre} />
          {estado === "PAGO_REPORTADO" && (
            <p className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold">
              Recibimos tu comprobante ({reserva.metodoPago}, ref. {reserva.referenciaPago}). Lo estamos revisando.
            </p>
          )}
          <SubirComprobante token={reserva.token} metodos={metodosDisponibles(config?.datosPago, PAGOS.metodos)} yaReportado={estado === "PAGO_REPORTADO"} />
        </section>
      )}

      <section className="mt-10 rounded-2xl border border-white/10 p-6">
        <h2 className="font-display text-lg font-bold">Tu fiesta</h2>
        <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          {[
            ["Lugar", [reserva.lugar, reserva.zona].filter(Boolean).join(", ")],
            ["Invitados", reserva.invitados],
            ["A nombre de", reserva.nombre],
            ["Teléfono", reserva.telefono],
          ]
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k}>
                <dt className="text-muted">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
        </dl>
        {servicios.length > 0 && (
          <ul className="mt-5 flex flex-col gap-1.5 border-t border-white/10 pt-4 text-sm">
            {servicios.map((s) => (
              <li key={s.servicioId + (s.variante ?? "")}>
                {s.nombre}
                {s.variante && <span className="text-muted"> · {s.variante}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <a
        href={hablar}
        target="_blank"
        rel="noopener noreferrer"
        data-origen="reserva"
        className="touch-target mt-8 w-full gap-2 rounded-full border border-white/20 text-sm font-semibold hover:border-neon-green hover:text-neon-green"
      >
        <MessageCircle className="h-4 w-4" aria-hidden /> Escribir a Divertimania por esta reserva
      </a>
      <p className="mt-4 text-center text-xs text-muted">Guarda este enlace: es tu acceso privado para seguir la reserva.</p>
    </div>
  );
}
