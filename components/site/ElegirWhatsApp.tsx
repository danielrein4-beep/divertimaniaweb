"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useWhatsApp } from "@/components/site/SitioConfigProvider";
import { formatTelefono } from "@/lib/telefono";

/** Cualquier parte del sitio puede pedir que el cliente elija el número: dispatchEvent con el enlace de WhatsApp. */
export const EVENTO_ELEGIR_WHATSAPP = "divertimania:elegir-whatsapp";

const ENLACE_WHATSAPP = /^https:\/\/api\.whatsapp\.com\/send\?phone=(\d+)(&.*)?$/;

/**
 * Con dos números de WhatsApp, cada botón de WhatsApp del sitio abre este selector para que la persona elija
 * a cuál escribir. Intercepta los enlaces al número principal (así cubre todos los botones sin tocarlos uno a
 * uno) y los que piden abrir WhatsApp por código (el carrito «Mi fiesta»).
 */
export default function ElegirWhatsApp() {
  const { numero, numeros } = useWhatsApp();
  const [enlace, setEnlace] = useState<string | null>(null);

  const cerrar = useCallback(() => setEnlace(null), []);

  useEffect(() => {
    if (numeros.length < 2) return;
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      const m = ENLACE_WHATSAPP.exec(a.href);
      if (!m || m[1] !== numero || a.hasAttribute("data-numero-fijo")) return;
      e.preventDefault();
      setEnlace(a.href);
    }
    function onPedido(e: Event) {
      setEnlace((e as CustomEvent<string>).detail);
    }
    document.addEventListener("click", onClick);
    window.addEventListener(EVENTO_ELEGIR_WHATSAPP, onPedido);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener(EVENTO_ELEGIR_WHATSAPP, onPedido);
    };
  }, [numero, numeros.length]);

  useEffect(() => {
    if (!enlace) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [enlace, cerrar]);

  const resto = enlace ? (ENLACE_WHATSAPP.exec(enlace)?.[2] ?? "") : "";

  if (!enlace) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 sm:items-center"
      onClick={cerrar}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="elegir-whatsapp-titulo"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-background-card p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={cerrar}
          aria-label="Cerrar"
          className="touch-target absolute right-2 top-2 rounded-full text-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 id="elegir-whatsapp-titulo" className="type-h3 pr-8 font-display font-extrabold">
          ¿A cuál número quieres escribir?
        </h2>
        <p className="mt-1 text-sm text-muted">Elige uno y se abre WhatsApp con tu mensaje listo.</p>
        <div className="mt-5 flex flex-col gap-3">
          {numeros.map((n) => (
            <a
              key={n}
              href={`https://api.whatsapp.com/send?phone=${n}${resto}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={cerrar}
              className="touch-target flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-neon-green px-4 text-base font-bold text-background transition-colors hover:bg-neon-green-dark"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              {formatTelefono(n)}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
