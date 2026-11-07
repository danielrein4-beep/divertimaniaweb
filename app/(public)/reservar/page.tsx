import type { Metadata } from "next";
import FormReserva from "@/components/site/reservas/FormReserva";
import { PASOS_CLIENTE } from "@/lib/reservas/estados";

export const metadata: Metadata = {
  title: "Apartar mi fecha | Divertimania",
  description: "Aparta la fecha de tu fiesta en minutos: te enviamos la cotización, pagas el anticipo y queda confirmada.",
};

export default function ReservarPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-green">Reservas</p>
      <h1 className="type-display mt-3 font-display font-extrabold">Aparta tu fecha</h1>
      <ol className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-foreground/85">
        {PASOS_CLIENTE.map((p, i) => (
          <li key={p.estado} className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neon-green text-xs font-bold text-background">{i + 1}</span>
            {p.titulo}
          </li>
        ))}
      </ol>
      <div className="mt-10">
        <FormReserva />
      </div>
    </div>
  );
}
