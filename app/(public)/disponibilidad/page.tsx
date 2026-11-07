import type { Metadata } from "next";
import Link from "next/link";
import ConsultaFecha from "@/components/mifiesta/ConsultaFecha";

export const metadata: Metadata = {
  title: "Consulta tu fecha | Divertimania",
  description: "Elige el día de tu fiesta y pregúntanos por WhatsApp si tenemos disponibilidad.",
};

export default function DisponibilidadPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-16 text-center sm:py-24">
      <h1 className="type-h1 font-display font-extrabold">¿Para cuándo es tu fiesta?</h1>
      <p className="text-muted">
        Elige la fecha y te confirmamos por WhatsApp. Podemos cubrir varios eventos el mismo día, así que pregunta aunque
        sea temporada alta.
      </p>
      <ConsultaFecha />
      <p className="text-sm text-muted">
        ¿Ya la tienes clara?{" "}
        <Link href="/reservar" className="font-semibold text-neon-green hover:underline">
          Aparta tu fecha con anticipo
        </Link>
      </p>
    </div>
  );
}
