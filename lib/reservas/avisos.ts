// Correos de las reservas: al equipo (nueva reserva, pago reportado) y al cliente (confirmada).
// Todo lo que escribió el cliente va escapado. Si el correo está apagado, no pasa nada.
import { enviarCorreo, escapar } from "@/lib/avisoSolicitud";
import { SITE_URL } from "@/lib/negocio";
import { normalizarTelefono } from "@/lib/telefono";
import { leerServicios } from "./estados";

type ReservaCorreo = {
  id: string;
  codigo: string;
  token: string;
  fecha: string;
  horaInicio: string | null;
  tipoEvento: string;
  zona: string;
  nombre: string;
  telefono: string;
  email: string | null;
  servicios: string | null;
  montoAnticipo?: number | null;
  referenciaPago?: string | null;
  metodoPago?: string | null;
};

function bloque(r: ReservaCorreo, lineas: [string, string][], boton: { texto: string; url: string }) {
  const texto = [...lineas.map(([k, v]) => `${k}: ${v}`), "", `${boton.texto}: ${boton.url}`].join("\n");
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#111;max-width:560px">
  <table style="border-collapse:collapse;margin:0 0 18px">
    ${lineas.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#555">${k}</td><td style="padding:4px 0"><b>${escapar(v)}</b></td></tr>`).join("")}
  </table>
  <a href="${boton.url}" style="display:inline-block;background:#111;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold">${boton.texto}</a>
</div>`;
  return { texto, html };
}

const datosBase = (r: ReservaCorreo): [string, string][] => [
  ["Reserva", r.codigo],
  ["Fecha", `${r.fecha}${r.horaInicio ? ` · ${r.horaInicio}` : ""}`],
  ["Evento", r.tipoEvento],
  ["Zona", r.zona],
  ["Cliente", r.nombre],
  ["Teléfono", r.telefono],
];

export function avisarNuevaReserva(r: ReservaCorreo) {
  const servicios = leerServicios(r.servicios).map((s) => s.nombre + (s.variante ? ` (${s.variante})` : "")).join(", ");
  const { texto, html } = bloque(r, [...datosBase(r), ...(servicios ? [["Servicios", servicios] as [string, string]] : [])], {
    texto: "Cotizar en el panel",
    url: `${SITE_URL}/admin/reservas/${r.id}`,
  });
  return enviarCorreo({ asunto: `Fecha apartada ${r.codigo}: ${r.tipoEvento} el ${r.fecha}`, texto, html, replyTo: r.email });
}

export function avisarPagoReportado(r: ReservaCorreo) {
  const { texto, html } = bloque(
    r,
    [...datosBase(r), ["Método", r.metodoPago ?? "—"], ["Referencia", r.referenciaPago ?? "—"], ["Anticipo pedido", r.montoAnticipo != null ? `US$ ${r.montoAnticipo}` : "—"]],
    { texto: "Revisar el comprobante", url: `${SITE_URL}/admin/reservas/${r.id}` }
  );
  return enviarCorreo({ asunto: `Pago reportado ${r.codigo}: revisar comprobante`, texto, html, replyTo: r.email });
}

export function avisarConfirmacionAlCliente(r: ReservaCorreo) {
  if (!r.email) return Promise.resolve("apagado" as const);
  const { texto, html } = bloque(r, [["Reserva", r.codigo], ["Fecha", r.fecha], ["Evento", r.tipoEvento]], {
    texto: "Ver mi reserva",
    url: `${SITE_URL}/reserva/${r.token}`,
  });
  return enviarCorreo({
    asunto: `¡Tu fecha está confirmada! Reserva ${r.codigo}`,
    texto: `Hola ${r.nombre}, tu fecha quedó confirmada en el calendario de Divertimania.\n\n${texto}`,
    html: `<p style="font-family:Arial,sans-serif;font-size:15px">Hola ${escapar(r.nombre)}, tu fecha quedó confirmada en el calendario de Divertimania.</p>${html}`,
    para: r.email,
  });
}

/** Mensaje de WhatsApp que el equipo manda al cliente con el monto y el enlace para pagar. */
export function mensajeAnticipo(r: ReservaCorreo): { numero: string; texto: string } {
  return {
    numero: normalizarTelefono(r.telefono),
    texto: `Hola ${r.nombre}, te saluda Divertimania. Para apartar tu ${r.tipoEvento.toLowerCase()} del ${r.fecha} (reserva ${r.codigo}) el anticipo es de US$ ${r.montoAnticipo ?? "—"}. Aquí ves cómo pagar y subes el comprobante: ${SITE_URL}/reserva/${r.token}`,
  };
}
