"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMiFiesta } from "@/context/MiFiestaContext";
import { esFichaDeServicio } from "@/lib/site";
import { useBottomBarSpace } from "@/lib/useBottomBarSpace";

export default function MiFiestaBar() {
  const { items, openPanel, isPanelOpen } = useMiFiesta();
  const pathname = usePathname();
  const visible = items.length > 0 && !esFichaDeServicio(pathname);
  useBottomBarSpace(visible);

  // En la ficha de un servicio manda su propia barra fija.
  if (items.length === 0 || isPanelOpen || esFichaDeServicio(pathname)) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-3 sm:px-6 pointer-events-none flex justify-center">
      <div className="pointer-events-auto flex items-center justify-between gap-3 sm:gap-6 bg-[#141414]/95 border border-neon-green/40 shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(168,255,48,0.18)] backdrop-blur-md rounded-full py-2.5 px-4 sm:px-5 max-w-lg w-full anim-rise">
        {/* Avatares apilados */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex -space-x-2.5 overflow-hidden shrink-0">
            {items.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="relative inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-[#141414] bg-[#232323] overflow-hidden"
              >
                {item.fotoUrl ? (
                  <Image
                    src={item.fotoUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neon-green/20 text-neon-green">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-sm font-bold text-foreground truncate">
              Mi fiesta
            </span>
            <span className="text-[11px] text-neon-green font-medium">
              {items.length} {items.length === 1 ? "servicio" : "servicios"}
            </span>
          </div>
        </div>

        {/* Botón Pedir cotización */}
        <button
          type="button"
          onClick={() => openPanel(1)}
          className="touch-target inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-neon-green px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-[#0b0b0b] hover:bg-neon-green-dark hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
        >
          <span>Pedir cotización</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
