import Link from "next/link";
import { INSTAGRAM_URL, NAV_LINKS } from "@/lib/site";
import { MENSAJES_WHATSAPP } from "@/lib/whatsapp";
import { buildWhatsAppLink, formatTelefono } from "@/lib/telefono";
import { getConfigSitio } from "@/lib/configSitio";
import Logo from "@/components/site/Logo";
import { MessageCircle, MapPin, ShieldCheck } from "lucide-react";

export default async function Footer() {
  const { whatsapp } = await getConfigSitio();
  return (
    <footer className="border-t border-white/10 bg-[#0e0e0e] relative z-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        {/* Columna Marca & Identidad */}
        <div className="flex flex-col gap-3 max-w-sm">
          <Logo height={34} />
          <p className="text-sm text-muted leading-relaxed">
            Animación, personajes y shows para toda clase de celebraciones.
            Cotizamos a tu medida según fecha, lugar y servicios.
          </p>

          <div className="flex items-center gap-2 text-xs font-semibold text-neon-green mt-1">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>Atendemos todo el Estado Táchira</span>
          </div>
        </div>

        {/* Mini Menú */}
        <div className="flex flex-col gap-2.5 text-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            Navegación
          </span>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/80 hover:text-neon-green transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Canales de Contacto */}
        <div className="flex flex-col gap-3 text-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            Contacto directo
          </span>

          <a
            href={buildWhatsAppLink(whatsapp, MENSAJES_WHATSAPP.general())}
            data-origen="pie"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-foreground/90 hover:text-neon-green transition-colors group"
          >
            <MessageCircle className="w-4 h-4 text-neon-green group-hover:scale-110 transition-transform" />
            <span className="font-semibold">{formatTelefono(whatsapp)}</span>
          </a>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-foreground/80 hover:text-neon-green transition-colors group"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-neon-green group-hover:scale-110 transition-transform fill-none stroke-currentColor stroke-[1.8] stroke-linecap-round stroke-linejoin-round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span>@divertimania2</span>
          </a>

          <p className="text-xs text-muted/70 max-w-xs mt-1">
            Cada fiesta es única: cotizaciones personalizadas directamente vía WhatsApp.
          </p>

          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-muted/50 hover:text-muted transition-colors mt-2"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Acceso administrativo</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-white/5 py-5 text-center text-xs text-muted/70">
        © {new Date().getFullYear()} Divertimania. Tu fiesta, armada en 2 minutos. San Cristóbal, Táchira.
      </div>
    </footer>
  );
}
