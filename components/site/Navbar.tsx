"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/site";
import Logo from "@/components/site/Logo";
import { useMiFiesta } from "@/context/MiFiestaContext";
import { Sparkles, Calendar } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { items, openSheet } = useMiFiesta();

  const totalItems = items.length;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center">
          <Logo height={36} />
        </Link>

        {/* Links en escritorio */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors hover:text-neon-green ${
                  active ? "text-neon-green" : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Acciones a la derecha */}
        <div className="flex items-center gap-2.5">
          {/* Botón Cotizar / Mi Fiesta (Desktop y Mobile) */}
          <button
            type="button"
            onClick={() => openSheet(1)}
            aria-label="Abrir panel de cotización"
            className={`touch-target relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md ${
              totalItems > 0
                ? "bg-neon-green text-[#0a0a0f] shadow-neon-green/20 hover:scale-105 active:scale-95"
                : "bg-surface-raised border border-white/15 text-foreground hover:border-neon-green hover:text-neon-green"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{totalItems > 0 ? "Mi Fiesta" : "Cotizar"}</span>
            {totalItems > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0a0a0f] text-[11px] font-extrabold text-neon-green">
                {totalItems}
              </span>
            )}
          </button>

          {/* Botón hamburguesa mobile */}
          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden touch-target rounded-full bg-surface-raised border border-white/10 text-foreground"
          >
            <span
              className={`h-0.5 w-5 bg-foreground transition-transform ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 bg-foreground transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 bg-foreground transition-transform ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Menú desplegable mobile */}
      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1.5 px-4 py-4">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`touch-target rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                    active
                      ? "bg-neon-green/15 text-neon-green"
                      : "text-foreground/90 hover:bg-surface-raised"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openSheet(1);
                }}
                className="touch-target w-full rounded-xl bg-neon-green py-3 text-center text-sm font-bold text-[#0a0a0f]"
              >
                Pedir cotización por WhatsApp
              </button>
              <Link
                href="/disponibilidad"
                onClick={() => setOpen(false)}
                className="touch-target inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-surface py-3 text-center text-sm font-semibold text-foreground"
              >
                <Calendar className="w-4 h-4 text-neon-green" />
                <span>Consultar disponibilidad</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
