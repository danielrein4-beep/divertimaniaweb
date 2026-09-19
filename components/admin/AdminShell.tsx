"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/site/Logo";

const LINKS = [
  { href: "/admin/dashboard", label: "Calendario" },
  { href: "/admin/eventos", label: "Eventos" },
  { href: "/admin/recursos", label: "Recursos" },
  { href: "/admin/catalogo", label: "Catálogo" },
  { href: "/admin/equipo", label: "Equipo" },
  { href: "/admin/novedades", label: "Novedades" },
  { href: "/admin/solicitudes", label: "Solicitudes" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 flex-col border-r border-border bg-background-elevated p-4 sm:flex">
        <Link href="/admin/dashboard" className="mb-8">
          <Logo height={30} />
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-neon-green/10 text-neon-green" : "text-foreground/80 hover:bg-background-card"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/" className="mb-2 text-xs text-muted hover:text-neon-green">
          ← Ver sitio público
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-border px-3 py-2 text-left text-sm text-muted hover:border-red-400 hover:text-red-400"
        >
          Cerrar sesión
        </button>
      </aside>

      <div className="flex-1 overflow-x-hidden">
        <header className="flex items-center justify-between border-b border-border bg-background-elevated px-4 py-3 sm:hidden">
          <Link href="/admin/dashboard">
            <Logo height={24} />
          </Link>
          <button onClick={handleLogout} className="text-xs text-muted">
            Salir
          </button>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-background-elevated px-2 py-2 sm:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                pathname.startsWith(link.href) ? "bg-neon-green/10 text-neon-green" : "text-foreground/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
