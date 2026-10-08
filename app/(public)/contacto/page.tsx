import type { Metadata } from "next";
import { AtSign, MapPin, MessageCircle } from "lucide-react";
import ContactoCotizacion from "@/components/mifiesta/ContactoCotizacion";
import { getGeneralWhatsAppLink } from "@/lib/whatsapp";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto y cotización | Divertimania",
  description: "Cuéntanos de tu evento y te mandamos la cotización por WhatsApp. Atendemos todo el Estado Táchira.",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
      <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
        <h1 className="type-h1 font-display font-extrabold">Cuéntanos de tu fiesta</h1>
        <p className="text-muted">
          Llena los datos y se abre WhatsApp con tu mensaje listo. Te respondemos con la cotización según fecha, zona y
          servicios.
        </p>

        <ul className="flex flex-col gap-3 text-sm">
          <li>
            <a
              href={getGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-semibold hover:text-neon-green"
            >
              <MessageCircle className="h-5 w-5 text-neon-green" aria-hidden />
              {WHATSAPP_DISPLAY}
            </a>
          </li>
          <li>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-semibold hover:text-neon-green"
            >
              <AtSign className="h-5 w-5 text-neon-green" aria-hidden />@{INSTAGRAM_HANDLE}
            </a>
          </li>
          <li className="inline-flex items-center gap-3 text-muted">
            <MapPin className="h-5 w-5 text-neon-green" aria-hidden />
            Atendemos todo el Estado Táchira
          </li>
        </ul>
      </div>

      <ContactoCotizacion />
    </div>
  );
}
