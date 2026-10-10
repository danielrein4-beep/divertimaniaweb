"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useIsClient } from "@/lib/useIsClient";

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** 0 a 1: muestra una barra de progreso bajo el encabezado. */
  progress?: number;
}

/** Bottom sheet en celular, panel lateral en escritorio. */
export default function Sheet({ isOpen, onClose, title, description, children, footer, progress }: SheetProps) {
  const isClient = useIsClient();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isClient || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-end md:items-stretch">
      <div onClick={onClose} className="anim-fade fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        tabIndex={-1}
        className="anim-sheet relative z-10 flex max-h-[92dvh] w-full flex-col rounded-t-3xl border-t border-border bg-background-elevated shadow-2xl outline-none md:h-full md:max-h-full md:max-w-lg md:rounded-none md:border-l md:border-t-0"
      >
        <div className="flex justify-center pt-3 md:hidden" aria-hidden>
          <div className="h-1.5 w-12 rounded-full bg-white/20" />
        </div>

        <div className="flex shrink-0 items-start justify-between gap-4 px-5 pb-3 pt-3 md:px-6 md:pt-6">
          <div className="flex flex-col gap-1">
            {typeof title === "string" ? <h2 className="type-h3 font-bold">{title}</h2> : title}
            {description && <p className="text-sm text-muted">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="touch-target -mr-2 rounded-full p-2.5 text-muted transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {progress !== undefined && (
          <div className="mx-5 h-1 shrink-0 overflow-hidden rounded-full bg-white/10 md:mx-6" aria-hidden>
            <div
              className="h-full rounded-full bg-neon-green transition-[width] duration-300"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 md:px-6">{children}</div>

        {footer && (
          <div className="shrink-0 border-t border-border bg-background-elevated px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
