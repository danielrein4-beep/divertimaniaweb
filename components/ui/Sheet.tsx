"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Sheet({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}: SheetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end items-end md:items-stretch"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Sheet Content: Bottom Sheet on Mobile, Slide-over on Desktop */}
      <div className="relative z-10 w-full md:max-w-xl flex flex-col bg-[#12121a] border-t md:border-t-0 md:border-l border-white/10 shadow-2xl rounded-t-3xl md:rounded-none max-h-[92vh] md:max-h-full h-auto md:h-full animate-in slide-in-from-bottom md:slide-in-from-right duration-250 ease-out">
        {/* Mobile Drag Pill */}
        <div className="flex md:hidden justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <div className="flex flex-col gap-1 pr-4">
            {typeof title === "string" ? (
              <h2 className="type-h3 text-foreground font-bold tracking-tight">{title}</h2>
            ) : (
              title
            )}
            {description && (
              <p className="text-xs sm:text-sm text-muted">{description}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel"
            className="touch-target -mr-2 rounded-full p-2.5 text-muted hover:text-foreground hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 overscroll-contain">
          {children}
        </div>

        {/* Optional Sticky Footer */}
        {footer && (
          <div className="p-4 sm:px-6 sm:py-4 border-t border-white/10 bg-[#161622] shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
