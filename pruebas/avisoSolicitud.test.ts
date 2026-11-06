import { afterEach, describe, expect, it, vi } from "vitest";

const enviados: Record<string, unknown>[] = [];
vi.mock("nodemailer", () => ({
  default: { createTransport: () => ({ sendMail: async (correo: Record<string, unknown>) => void enviados.push(correo) }) },
}));

import { armarCorreo, avisarSolicitud, configCorreo } from "@/lib/avisoSolicitud";

const SMTP = { SMTP_HOST: "smtp.hostinger.com", SMTP_USUARIO: "web@divertimania.com", SMTP_CLAVE: "x", AVISO_CORREO_PARA: "reservas@divertimania.com" };
const solicitud = { nombre: "Ana <b>", telefono: "0414-728-6881", email: "ana@correo.com", mensaje: "Fiesta de <script>Sofía</script>", fechaDeseada: "2099-05-10" };

afterEach(() => {
  vi.unstubAllEnvs();
  enviados.length = 0;
});

describe("aviso por correo de solicitudes", () => {
  it("queda apagado si falta alguna variable", async () => {
    expect(configCorreo({})).toBeNull();
    expect(configCorreo({ ...SMTP, SMTP_CLAVE: "" })).toBeNull();
    expect(await avisarSolicitud(solicitud)).toBe("apagado");
    expect(enviados).toHaveLength(0);
  });

  it("usa el puerto 465 por defecto y el usuario como remitente", () => {
    expect(configCorreo(SMTP)).toMatchObject({ puerto: 465, de: "web@divertimania.com", para: "reservas@divertimania.com" });
  });

  it("escapa lo que escribió el visitante y trae el enlace de WhatsApp", () => {
    const { asunto, html, texto } = armarCorreo(solicitud);
    expect(asunto).toBe("Nueva solicitud: Ana <b> para el 2099-05-10");
    expect(html).toContain("Ana &lt;b&gt;");
    expect(html).toContain("&lt;script&gt;Sofía&lt;/script&gt;");
    expect(html).not.toContain("<script>");
    expect(html).toContain("https://wa.me/584147286881");
    expect(texto).toContain("Teléfono: +58 414-728-6881");
  });

  it("con la configuración puesta, envía al destinatario y responde al visitante", async () => {
    for (const [k, v] of Object.entries(SMTP)) vi.stubEnv(k, v);
    expect(await avisarSolicitud(solicitud)).toBe("enviado");
    expect(enviados[0]).toMatchObject({ to: "reservas@divertimania.com", replyTo: "ana@correo.com" });
  });
});
