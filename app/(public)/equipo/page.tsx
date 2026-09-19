import Image from "next/image";
import { prisma } from "@/lib/db";
import PlaceholderImage from "@/components/site/PlaceholderImage";
import { getImageAspect } from "@/lib/imageAspect";
import { WHATSAPP_LINK } from "@/lib/site";

export default async function EquipoPage() {
  const recreadores = await prisma.recreador.findMany({
    where: { activo: true },
    orderBy: { orden: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Nuestro equipo</h1>
        <p className="mt-2 text-muted">
          Los recreadores que le ponen la energía a cada evento de Divertimania.
        </p>
      </div>

      {recreadores.length === 0 ? (
        <p className="text-center text-muted">Muy pronto vas a conocer aquí a todo el equipo.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recreadores.map((r) => (
            <div key={r.id} className="card-glass overflow-hidden rounded-2xl">
              {r.fotoUrl ? (
                <div className="relative w-full border-b border-border bg-background-elevated" style={{ aspectRatio: getImageAspect(r.fotoUrl, 0.8) }}>
                  <Image src={r.fotoUrl} alt={r.nombre} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              ) : (
                <PlaceholderImage label={r.nombre} className="aspect-[4/5] w-full rounded-none border-0 border-b border-border" />
              )}
              <div className="p-5">
                <h3 className="text-lg font-semibold">{r.nombre}</h3>
                <p className="text-sm font-medium text-neon-green">{r.cargo}</p>
                <p className="mt-2 text-sm text-muted">{r.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-border bg-background-elevated p-10 text-center">
        <h2 className="text-2xl font-bold">¿Quieres a este equipo en tu evento?</h2>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-neon-green px-6 py-3 font-semibold text-background transition-transform hover:scale-105"
        >
          Escríbenos por WhatsApp
        </a>
      </div>
    </div>
  );
}
