"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Boxes,
  CalendarDays,
  ExternalLink,
  Inbox,
  LayoutGrid,
  ListTree,
  LogOut,
  Megaphone,
  Menu,
  PartyPopper,
  Settings,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Logo from "@/components/site/Logo";

type Enlace = { href: string; label: string; icono: LucideIcon };

const GRUPOS: { titulo: string; enlaces: Enlace[] }[] = [
  {
    titulo: "Negocio",
    enlaces: [
      { href: "/admin/resultados", label: "Resultados", icono: BarChart3 },
      { href: "/admin/solicitudes", label: "Solicitudes", icono: Inbox },
      { href: "/admin/dashboard", label: "Calendario", icono: CalendarDays },
      { href: "/admin/eventos", label: "Eventos", icono: PartyPopper },
    ],
  },
  {
    titulo: "Catálogo",
    enlaces: [
      { href: "/admin/catalogo", label: "Servicios", icono: LayoutGrid },
      { href: "/admin/categorias", label: "Secciones", icono: ListTree },
      { href: "/admin/recursos", label: "Inventario", icono: Boxes },
    ],
  },
  {
    titulo: "Sitio",
    enlaces: [
      { href: "/admin/equipo", label: "Equipo", icono: Users },
      { href: "/admin/novedades", label: "Novedades", icono: Megaphone },
      { href: "/admin/ajustes", label: "Ajustes", icono: Settings },
    ],
  },
];

/** Marco del panel: menú lateral por grupos en computadora y menú desplegable en el teléfono. */
export default function AdminShell({ children, solicitudesNuevas = 0 }: { children: React.ReactNode; solicitudesNuevas?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  // El menú del teléfono queda abierto solo en la pantalla donde se abrió: al navegar se cierra solo.
  const [abiertoEn, setAbiertoEn] = useState<string | null>(null);
  const menuAbierto = abiertoEn === pathname;
  const setMenuAbierto = (abrir: boolean) => setAbiertoEn(abrir ? pathname : null);

  async function salir() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const menu = (
    <>
      <nav aria-label="Panel" className="flex flex-1 flex-col gap-6 overflow-y-auto">
        {GRUPOS.map((grupo) => (
          <div key={grupo.titulo}>
            <p className="mb-1.5 px-3 text-[10.5px] font-bold uppercase tracking-[0.14em] text-foreground/40">{grupo.titulo}</p>
            <ul className="flex flex-col gap-0.5">
              {grupo.enlaces.map(({ href, label, icono: Icono }) => {
                const activo = pathname.startsWith(href);
                const aviso = href === "/admin/solicitudes" && solicitudesNuevas > 0;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={activo ? "page" : undefined}
                      className={`relative flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                        activo ? "bg-white/[0.06] text-foreground" : "text-foreground/65 hover:bg-white/[0.04] hover:text-foreground"
                      }`}
                    >
                      {activo && <span className="absolute left-0 top-2 h-5 w-0.5 rounded-full bg-neon-green" aria-hidden />}
                      <Icono className={`h-4 w-4 ${activo ? "text-neon-green" : ""}`} aria-hidden />
                      <span className="flex-1">{label}</span>
                      {aviso && (
                        <span className="rounded-md bg-neon-green px-1.5 font-mono text-[11px] font-bold tabular-nums text-background" aria-label={`${solicitudesNuevas} nuevas`}>
                          {solicitudesNuevas}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="mt-6 flex flex-col gap-0.5 border-t border-white/[0.07] pt-4">
        <Link href="/" target="_blank" className="flex h-9 items-center gap-3 rounded-lg px-3 text-sm text-foreground/65 hover:bg-white/[0.04] hover:text-foreground">
          <ExternalLink className="h-4 w-4" aria-hidden /> Ver el sitio
        </Link>
        <button type="button" onClick={salir} className="flex h-9 items-center gap-3 rounded-lg px-3 text-left text-sm text-foreground/65 hover:bg-red-500/10 hover:text-red-300">
          <LogOut className="h-4 w-4" aria-hidden /> Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/[0.07] bg-background-elevated px-3 pb-4 pt-5 md:flex">
        <Link href="/admin/resultados" className="mb-7 flex items-center gap-3 px-3">
          <Logo height={28} />
          <span className="rounded border border-white/15 px-1.5 py-px text-[10px] font-bold uppercase tracking-wider text-foreground/55">Panel</span>
        </Link>
        {menu}
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/[0.07] bg-background-elevated/95 px-4 py-2.5 backdrop-blur md:hidden">
          <Link href="/admin/resultados" className="flex items-center gap-2.5">
            <Logo height={24} />
            <span className="rounded border border-white/15 px-1.5 py-px text-[10px] font-bold uppercase tracking-wider text-foreground/55">Panel</span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuAbierto(true)}
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/12"
          >
            <Menu className="h-5 w-5" aria-hidden />
            {solicitudesNuevas > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-neon-green" aria-hidden />}
          </button>
        </header>

        {menuAbierto && (
          <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menú del panel">
            <div className="absolute inset-0 bg-black/70" onClick={() => setMenuAbierto(false)} />
            <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-white/10 bg-background-elevated px-3 pb-4 pt-4">
              <div className="mb-6 flex items-center justify-between px-3">
                <Logo height={24} />
                <button type="button" onClick={() => setMenuAbierto(false)} aria-label="Cerrar menú" className="rounded-lg p-2 text-muted hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {menu}
            </div>
          </div>
        )}

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-9">{children}</main>
      </div>
    </div>
  );
}
