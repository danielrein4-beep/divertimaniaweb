import Link from "next/link";
import { NAV_LINKS, WHATSAPP_LINK } from "@/lib/site";
import Logo from "@/components/site/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background-elevated">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo height={32} />
          <p className="mt-2 max-w-xs text-sm text-muted">
            Eventos y animación en el Estado Táchira. Creamos momentos inolvidables.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-foreground/80 hover:text-neon-green">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 hover:text-neon-green"
          >
            WhatsApp
          </a>
          <a
            href="https://www.instagram.com/divertimania2"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 hover:text-neon-green"
          >
            Instagram
          </a>
          <Link href="/admin/login" className="text-muted hover:text-neon-green">
            Acceso equipo
          </Link>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} Divertimania. Todos los derechos reservados.
      </div>
    </footer>
  );
}
