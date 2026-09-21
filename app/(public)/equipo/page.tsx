import { prisma } from "@/lib/db";
import { WHATSAPP_LINK } from "@/lib/site";
import ChromaGrid from "@/components/site/ChromaGrid";

export default async function EquipoPage() {
  const recreadores = await prisma.recreador.findMany({
    where: { activo: true },
    orderBy: { orden: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-12 text-center">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Nuestro equipo</h1>
        <p className="mt-2 text-muted">
          Los recreadores que le ponen la energía y magia a cada evento de Divertimania.
        </p>
      </div>

      {recreadores.length === 0 ? (
        <p className="text-center text-muted">Muy pronto vas a conocer aquí a todo el equipo.</p>
      ) : (
        <ChromaGrid items={recreadores} />
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
