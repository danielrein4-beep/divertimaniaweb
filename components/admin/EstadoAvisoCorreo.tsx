import { MailCheck, MailX } from "lucide-react";
import { configCorreo } from "@/lib/avisoSolicitud";

/** En Ajustes: si las solicitudes nuevas llegan por correo y a qué dirección. Nunca muestra claves. */
export default function EstadoAvisoCorreo() {
  const config = configCorreo();
  return (
    <section className="flex flex-col rounded-xl border border-white/10 bg-background-card">
      <div className="border-b border-white/[0.07] px-5 py-3.5">
        <h2 className="text-[15px] font-bold">Aviso de solicitudes por correo</h2>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">Cada vez que alguien llena el formulario de Contacto, llega un correo con sus datos y un botón para responder por WhatsApp.</p>
      </div>
      <div className="flex items-start gap-3 p-5 text-sm">
        {config ? (
          <>
            <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-neon-green" aria-hidden />
            <p>
              <span className="font-semibold text-neon-green">Activo.</span> Las solicitudes llegan a <b>{config.para}</b>.
            </p>
          </>
        ) : (
          <>
            <MailX className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
            <p>
              <span className="font-semibold text-gold">Apagado.</span> Las solicitudes solo se ven en el panel. Se activa cuando Aurora configura el
              correo del dominio en el servidor.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
