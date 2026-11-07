import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";
import { buildWhatsAppLink } from "@/lib/telefono";
import { formatFechaAmigable } from "@/lib/miFiesta";
import { SITE_URL } from "@/lib/negocio";
import Encabezado, { botonSecundario } from "@/components/admin/Encabezado";
import { Tarjeta } from "@/components/admin/ui";
import AccionesReserva from "@/components/admin/reservas/AccionesReserva";
import { ESTADO_RESERVA_LABEL, leerServicios, type EstadoReserva } from "@/lib/reservas/estados";
import { COLOR_ESTADO } from "@/lib/reservas/colores";
import { mensajeAnticipo } from "@/lib/reservas/avisos";
import { disponibilidad } from "@/lib/reservas/disponibilidad";

export const dynamic = "force-dynamic";

export default async function ReservaAdmin({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await prisma.reserva.findUnique({ where: { id } });
  if (!r) notFound();
  const estado = r.estado as EstadoReserva;
  const servicios = leerServicios(r.servicios);
  const disp = await disponibilidad(r.fecha, r.id);
  const msj = mensajeAnticipo(r);

  const datos: [string, string | null][] = [
    ["Fecha", `${formatFechaAmigable(r.fecha)}${r.horaInicio ? ` · ${r.horaInicio}` : ""}`],
    ["Lugar", [r.lugar, r.zona].filter(Boolean).join(", ")],
    ["Invitados", r.invitados],
    ["Cliente", r.nombre],
    ["Teléfono", r.telefono],
    ["Correo", r.email],
    ["Recibida", r.createdAt.toLocaleString("es-VE", { timeZone: "America/Caracas" })],
  ];

  return (
    <div>
      <Encabezado
        grupo={
          <Link href="/admin/reservas" className="hover:text-neon-green">
            Negocio · Reservas · {r.codigo}
          </Link>
        }
        titulo={`${r.tipoEvento} · ${r.nombre}`}
        extra={
          <span className={`rounded px-1.5 py-px text-[10.5px] font-bold uppercase tracking-wide ring-1 ring-inset ${COLOR_ESTADO[estado]}`}>
            {ESTADO_RESERVA_LABEL[estado]}
          </span>
        }
        acciones={
          <a href={`${SITE_URL}/reserva/${r.token}`} target="_blank" rel="noopener noreferrer" className={botonSecundario}>
            Lo que ve el cliente <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        }
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex flex-col gap-6">
          <AccionesReserva
            id={r.id}
            estado={estado}
            montoAnticipo={r.montoAnticipo}
            montoTotal={r.montoTotal}
            notaInterna={r.notaInterna}
            eventoId={r.eventoId}
            whatsappCliente={buildWhatsAppLink(msj.numero, msj.texto)}
          />

          {r.comprobante && (
            <Tarjeta titulo="Comprobante de pago" ayuda={`${r.metodoPago ?? ""} · referencia ${r.referenciaPago ?? "—"}`}>
              <a href={`/api/reservas/${r.id}/comprobante`} target="_blank" rel="noopener noreferrer" className="block">
                {/* eslint-disable-next-line @next/next/no-img-element -- imagen privada servida por el panel */}
                <img src={`/api/reservas/${r.id}/comprobante`} alt="Comprobante del pago" className="max-h-[520px] w-auto rounded-lg border border-white/10" />
              </a>
            </Tarjeta>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <Tarjeta titulo="Datos del evento">
            <dl className="flex flex-col gap-2.5 text-sm">
              {datos
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-white/[0.06] pb-2 last:border-0">
                    <dt className="text-muted">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </div>
                ))}
            </dl>
            {estado !== "CONFIRMADA" && (
              <p className={`text-xs ${disp.estado === "completa" ? "text-red-300" : "text-muted"}`}>
                Ese día hay {disp.ocupadas} de {disp.tope} fiestas ocupadas sin contar esta.
              </p>
            )}
          </Tarjeta>

          <Tarjeta titulo="Lo que pidió">
            {servicios.length === 0 ? (
              <p className="text-sm text-muted">No eligió servicios: quiere asesoría.</p>
            ) : (
              <ul className="flex flex-col gap-1.5 text-sm">
                {servicios.map((s) => (
                  <li key={s.servicioId + (s.variante ?? "")}>
                    {s.nombre}
                    {s.variante && <span className="text-muted"> · {s.variante}</span>}
                  </li>
                ))}
              </ul>
            )}
            {r.comentarios && <p className="whitespace-pre-line border-t border-white/[0.07] pt-3 text-sm text-foreground/85">{r.comentarios}</p>}
          </Tarjeta>
        </div>
      </div>
    </div>
  );
}
