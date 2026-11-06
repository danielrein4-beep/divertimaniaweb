// Aviso por correo cuando alguien deja una solicitud en el formulario de Contacto, para que
// Divertimania se entere sin tener que abrir el panel. Se activa solo con las variables SMTP_*;
// sin ellas no se envía nada y el formulario funciona igual.
import nodemailer from "nodemailer";
import { normalizarTelefono, formatTelefono } from "@/lib/telefono";
import { SITE_URL } from "@/lib/negocio";

export type DatosSolicitud = {
  nombre: string;
  telefono: string;
  email?: string | null;
  mensaje: string;
  fechaDeseada?: string | null;
};

type ConfigCorreo = { host: string; puerto: number; usuario: string; clave: string; para: string; de: string };

/** Lee la configuración del entorno; null si falta algo (aviso apagado). */
export function configCorreo(env: Record<string, string | undefined> = process.env): ConfigCorreo | null {
  const { SMTP_HOST, SMTP_PUERTO, SMTP_USUARIO, SMTP_CLAVE, AVISO_CORREO_PARA } = env;
  if (!SMTP_HOST || !SMTP_USUARIO || !SMTP_CLAVE || !AVISO_CORREO_PARA) return null;
  return {
    host: SMTP_HOST,
    puerto: Number(SMTP_PUERTO) || 465,
    usuario: SMTP_USUARIO,
    clave: SMTP_CLAVE,
    para: AVISO_CORREO_PARA,
    de: env.AVISO_CORREO_DE || SMTP_USUARIO,
  };
}

const escapar = (texto: string) =>
  texto.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Asunto, texto plano y HTML del correo. Todo lo que escribió el visitante va escapado. */
export function armarCorreo(s: DatosSolicitud) {
  const digitos = normalizarTelefono(s.telefono);
  const whatsapp = `https://wa.me/${digitos}`;
  const panel = `${SITE_URL}/admin/solicitudes`;
  const filas: [string, string][] = [
    ["Nombre", s.nombre],
    ["Teléfono", formatTelefono(digitos)],
    ...(s.email ? [["Correo", s.email] as [string, string]] : []),
    ...(s.fechaDeseada ? [["Fecha que busca", s.fechaDeseada] as [string, string]] : []),
  ];

  const asunto = `Nueva solicitud: ${s.nombre}${s.fechaDeseada ? ` para el ${s.fechaDeseada}` : ""}`;
  const texto = [
    "Llegó una solicitud nueva desde la página web.",
    "",
    ...filas.map(([k, v]) => `${k}: ${v}`),
    "",
    "Mensaje:",
    s.mensaje,
    "",
    `Responder por WhatsApp: ${whatsapp}`,
    `Ver en el panel: ${panel}`,
  ].join("\n");

  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#111;max-width:560px">
  <p style="margin:0 0 16px">Llegó una solicitud nueva desde la página web.</p>
  <table style="border-collapse:collapse;margin:0 0 16px">
    ${filas.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#555">${k}</td><td style="padding:4px 0"><b>${escapar(v)}</b></td></tr>`).join("")}
  </table>
  <p style="margin:0 0 4px;color:#555">Mensaje</p>
  <p style="margin:0 0 20px;white-space:pre-wrap">${escapar(s.mensaje)}</p>
  <p style="margin:0">
    <a href="${whatsapp}" style="display:inline-block;background:#25d366;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold">Responder por WhatsApp</a>
    &nbsp; <a href="${panel}" style="color:#111">Ver en el panel</a>
  </p>
</div>`;

  return { asunto, texto, html };
}

/**
 * Envía el aviso. Nunca lanza: si el correo falla, la solicitud ya quedó guardada en el panel
 * y el visitante no debe ver un error por eso.
 */
export async function avisarSolicitud(s: DatosSolicitud): Promise<"enviado" | "apagado" | "fallo"> {
  const config = configCorreo();
  if (!config) return "apagado";
  try {
    const transporte = nodemailer.createTransport({
      host: config.host,
      port: config.puerto,
      secure: config.puerto === 465,
      auth: { user: config.usuario, pass: config.clave },
    });
    const { asunto, texto, html } = armarCorreo(s);
    await transporte.sendMail({
      from: `Divertimania web <${config.de}>`,
      to: config.para,
      replyTo: s.email || undefined,
      subject: asunto,
      text: texto,
      html,
    });
    return "enviado";
  } catch (e) {
    console.error("No se pudo enviar el aviso de solicitud:", e instanceof Error ? e.message : e);
    return "fallo";
  }
}
