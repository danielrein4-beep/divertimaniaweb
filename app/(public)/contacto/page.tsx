import { Metadata } from "next";
import ContactForm from "@/components/site/ContactForm";
import { WHATSAPP_LINK } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { MessageCircle, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contacto | Divertimania Táchira",
  description:
    "Comunícate con Divertimania para cotizar tu evento en San Cristóbal y todo el Estado Táchira. Atención directa por WhatsApp o formulario.",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-14 flex flex-col gap-10">
      <SectionHeader
        badge="Estamos listos para atenderte"
        title="Conversemos sobre tu celebración"
        underlineWord="celebración"
        subtitle="Cotizamos cada fiesta de forma personalizada según fecha, lugar y servicios. Escríbenos por WhatsApp para respuesta inmediata o déjanos un mensaje."
        align="center"
        tilt="left"
      />

      {/* Datos directos de contacto */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3.5 p-4 rounded-2xl bg-surface border border-white/10 hover:border-neon-green/60 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-neon-green/15 border border-neon-green/30 flex items-center justify-center text-neon-green shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase font-bold text-muted">WhatsApp Directo</p>
            <p className="font-bold text-sm text-foreground group-hover:text-neon-green transition-colors">
              +58 414-7286881
            </p>
          </div>
        </a>

        <a
          href="https://www.instagram.com/divertimaniashow"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3.5 p-4 rounded-2xl bg-surface border border-white/10 hover:border-magenta/60 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-magenta/15 border border-magenta/30 flex items-center justify-center text-magenta shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] uppercase font-bold text-muted">Instagram</p>
            <p className="font-bold text-sm text-foreground group-hover:text-magenta transition-colors">
              @divertimaniashow
            </p>
          </div>
        </a>

        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-surface border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-surface-raised border border-white/10 flex items-center justify-center text-foreground shrink-0">
            <MapPin className="w-5 h-5 text-neon-green" />
          </div>
          <div>
            <p className="text-[11px] uppercase font-bold text-muted">Zona de cobertura</p>
            <p className="font-bold text-sm text-foreground">
              Todo el Estado Táchira
            </p>
          </div>
        </div>
      </div>

      {/* CTA destacado de WhatsApp */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl border border-neon-green/30 bg-gradient-to-r from-neon-green/10 via-surface to-surface shadow-lg text-center sm:text-left">
        <div>
          <h2 className="font-display font-extrabold text-lg text-foreground">
            ¿Quieres cotizar en menos de 2 minutos?
          </h2>
          <p className="text-xs text-muted mt-0.5">
            El canal más rápido de atención es nuestro WhatsApp oficial.
          </p>
        </div>
        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="md" leftIcon={<MessageCircle className="w-4 h-4" />}>
            Escribir por WhatsApp
          </Button>
        </a>
      </div>

      {/* Formulario */}
      <div className="flex flex-col gap-4">
        <h3 className="font-display font-bold text-xl text-foreground">
          O envíanos los detalles por aquí:
        </h3>
        <ContactForm />
      </div>
    </div>
  );
}
