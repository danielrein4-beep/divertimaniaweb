"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/site";
import { useMiFiesta } from "@/context/MiFiestaContext";
import Logo from "@/components/site/Logo";

export default function Navbar() {
  const pathname = usePathname();
  const [openFor, setOpenFor] = useState<string | null>(null);
  const { items, openPanel } = useMiFiesta();
  // El menú se cierra solo al cambiar de página.
  const open = openFor === pathname;

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const cotizar = () => {
    setOpenFor(null);
    openPanel(items.length > 0 ? 1 : 2);
  };

  return (
    <>
      <header className="sticky top-0 z-50 h-[60px] border-b border-border/80 bg-background/85 backdrop-blur-md">
        <nav className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center" aria-label="Divertimania, inicio">
            <Logo height={36} />
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-sm font-medium transition-colors hover:text-neon-green ${
                    active ? "text-neon-green" : "text-foreground/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={cotizar}
              className="relative inline-flex h-10 items-center gap-2 rounded-full bg-neon-green px-4 text-sm font-bold text-background transition-colors hover:bg-neon-green-dark"
            >
              Cotizar
              {items.length > 0 && (
                <span
                  key={items.length}
                  className="anim-pop inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-background px-1.5 text-xs text-neon-green"
                  aria-label={`${items.length} en tu fiesta`}
                >
                  {items.length}
                </span>
              )}
            </button>

            <button
              type="button"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              onClick={() => setOpenFor(open ? null : pathname)}
              className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
            >
              <span className={`h-0.5 w-6 bg-foreground transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`h-0.5 w-6 bg-foreground transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-6 bg-foreground transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div className="anim-fade fixed inset-x-0 bottom-0 top-[60px] z-[45] overflow-y-auto bg-background md:hidden">
          <div className="flex flex-col gap-1 px-4 py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setOpenFor(null)}
                className={`rounded-2xl px-4 py-3.5 font-display text-2xl font-extrabold ${
                  pathname === link.href ? "text-neon-green" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
