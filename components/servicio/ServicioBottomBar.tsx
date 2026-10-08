"use client";

import React from "react";
import { Plus, Check, MessageCircle } from "lucide-react";
import { useMiFiesta } from "@/context/MiFiestaContext";
import Button from "@/components/ui/Button";
import { buildWhatsAppLink } from "@/lib/site";

interface ServicioBottomBarProps {
  servicioId: string;
  nombre: string;
  categoria: string;
  fotoUrl: string | null;
}

export default function ServicioBottomBar({
  servicioId,
  nombre,
  categoria,
  fotoUrl,
}: ServicioBottomBarProps) {
  const { isInFiesta, toggleItem, openSheet } = useMiFiesta();
  const added = isInFiesta(servicioId);

  const soloEsteWaLink = buildWhatsAppLink(
    `Hola Divertimania 👋 Vengo de la página web y quiero cotizar únicamente el servicio: ${nombre}.`
  );

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-[#12121c]/95 backdrop-blur-md border-t border-white/10 px-4 py-3 sm:py-3.5 shadow-2xl">
      <div className="mx-auto max-w-4xl flex items-center justify-between gap-3">
        {/* Info del servicio */}
        <div className="hidden sm:flex flex-col">
          <span className="text-xs text-muted uppercase font-semibold">{categoria}</span>
          <span className="font-bold text-foreground text-sm truncate max-w-xs">{nombre}</span>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <a
            href={soloEsteWaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex"
          >
            <Button variant="ghost" size="sm" className="border border-white/10 gap-1.5 text-xs">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Cotizar solo este</span>
            </Button>
          </a>

          <Button
            variant={added ? "secondary" : "primary"}
            size="md"
            onClick={() => {
              if (added) {
                openSheet(1);
              } else {
                toggleItem({
                  servicioId,
                  nombre,
                  categoria,
                  fotoUrl,
                });
              }
            }}
            leftIcon={added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            className="flex-1 sm:flex-initial"
          >
            {added ? "En tu fiesta (Ver panel) ✓" : `Agregar ${nombre} a mi fiesta`}
          </Button>
        </div>
      </div>
    </div>
  );
}
