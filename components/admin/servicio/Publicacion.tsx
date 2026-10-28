"use client";

import { Interruptor, Tarjeta } from "@/components/admin/ui";
import type { ServicioEditable } from "@/components/admin/ServicioEditor";

type Interruptores = Pick<ServicioEditable, "activo" | "masPedido" | "destacado" | "soloAdultos" | "enPdf">;

/** Dónde y cómo aparece el servicio: visible, más pedido, destacado, +18 y PDF. */
export default function Publicacion({
  form,
  set,
}: {
  form: ServicioEditable;
  set: <K extends keyof Interruptores>(campo: K, valor: Interruptores[K]) => void;
}) {
  return (
    <Tarjeta titulo="Publicación">
      <div className="flex flex-col gap-2">
        <Interruptor
          titulo="Visible en el sitio"
          ayuda={form.fotoUrl ? "Apágalo para ocultarlo sin borrarlo." : "Ponle una foto antes de mostrarlo."}
          activo={form.activo}
          onCambio={(v) => set("activo", v)}
        />
        <Interruptor
          titulo="Más pedido"
          ayuda="Etiqueta en la tarjeta (como mucho una por fila)."
          activo={form.masPedido}
          onCambio={(v) => set("masPedido", v)}
        />
        <Interruptor
          titulo="Destacado en el Inicio"
          activo={form.destacado}
          onCambio={(v) => set("destacado", v)}
        />
        <Interruptor
          titulo="Solo adultos (+18)"
          ayuda="Solo aparece dentro de su sección, nunca en “Todo”."
          activo={form.soloAdultos}
          onCambio={(v) => set("soloAdultos", v)}
          tono="rojo"
        />
        <Interruptor
          titulo="Mostrar en el PDF"
          ayuda="Apágalo para que se vea en la web pero no en el catálogo PDF."
          activo={form.enPdf}
          onCambio={(v) => set("enPdf", v)}
        />
      </div>
    </Tarjeta>
  );
}
