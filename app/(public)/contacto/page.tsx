import ContactForm from "@/components/site/ContactForm";
import { WHATSAPP_LINK } from "@/lib/site";

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Contáctanos</h1>
        <p className="mt-2 text-muted">
          Cuéntanos sobre tu evento y te ayudamos a armar la celebración perfecta.
        </p>
      </div>

      <div className="mb-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-neon-green px-6 py-3 font-semibold text-background transition-transform hover:scale-105"
        >
          Escríbenos directo por WhatsApp
        </a>
        <span className="text-sm text-muted">o completa el formulario</span>
      </div>

      <ContactForm />
    </div>
  );
}
