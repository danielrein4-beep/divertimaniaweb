"use client";

import Image from "next/image";
import { Clock, Users } from "lucide-react";
import { Tarjeta } from "@/components/admin/ui";
import type { ServicioEditable } from "@/components/admin/ServicioEditor";

/** Mini tarjeta como la del catálogo público, para ver el resultado antes de guardar. */
export default function VistaPrevia({ servicio }: { servicio: ServicioEditable }) {
  return (
    <Tarjeta titulo="Así se ve en el catálogo">
      <div className="mx-auto w-full max-w-[220px] overflow-hidden rounded-xl border border-white/10 bg-background-card">
        <div className="relative aspect-[4/5] w-full bg-black/40">
          {servicio.fotoUrl ? (
            <Image src={servicio.fotoUrl} alt="" fill sizes="220px" className="object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-xs text-muted">Sin foto</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
          {servicio.masPedido && (
            <span className="absolute left-2 top-2 -rotate-2 rounded-md bg-neon-green px-2 py-1 text-[10px] font-bold uppercase text-background">
              Más pedido
            </span>
          )}
          <p className="ig-caption absolute inset-x-2.5 bottom-2.5 line-clamp-2 text-base leading-tight">
            {servicio.nombre || "Nombre del servicio"}
          </p>
        </div>
        <div className="flex flex-col gap-2 p-2.5">
          <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-foreground/75">
            {servicio.edadIdeal && (
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-muted" aria-hidden /> {servicio.edadIdeal}
              </span>
            )}
            {servicio.duracion && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-muted" aria-hidden /> {servicio.duracion}
              </span>
            )}
          </p>
          <span className="flex h-9 items-center justify-center rounded-lg border border-neon-green/55 text-xs font-bold text-neon-green">
            + Agregar
          </span>
        </div>
      </div>
    </Tarjeta>
  );
}
