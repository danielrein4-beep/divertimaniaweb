import { prisma } from "@/lib/db";
import { WHATSAPP_LINK } from "@/lib/site";
import ChromaGrid from "@/components/site/ChromaGrid";

const ACCENT_PALETTE = [
  { border: "#9dff3c", gradient: "linear-gradient(145deg, #9dff3c, #0a0a0f)" },
  { border: "#ff4fd8", gradient: "linear-gradient(210deg, #ff4fd8, #0a0a0f)" },
  { border: "#00f0ff", gradient: "linear-gradient(165deg, #00f0ff, #0a0a0f)" },
  { border: "#ffd166", gradient: "linear-gradient(195deg, #ffd166, #0a0a0f)" },
  { border: "#a78bfa", gradient: "linear-gradient(225deg, #a78bfa, #0a0a0f)" },
  { border: "#f43f5e", gradient: "linear-gradient(135deg, #f43f5e, #0a0a0f)" },
  { border: "#10b981", gradient: "linear-gradient(145deg, #10b981, #0a0a0f)" },
  { border: "#fb923c", gradient: "linear-gradient(210deg, #fb923c, #0a0a0f)" },
];

export default async function EquipoPage() {
  const recreadores = await prisma.recreador.findMany({
    where: { activo: true },
    orderBy: { orden: "asc" },
  });

  const items = recreadores.map((r, i) => {
    const pal = ACCENT_PALETTE[i % ACCENT_PALETTE.length];
    return {
      id: r.id,
      image: r.fotoUrl || "/images/bolas-disco-equipo.jpg",
      title: r.nombre,
      subtitle: r.cargo,
      handle: `@${r.nombre.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
      borderColor: pal.border,
      gradient: pal.gradient,
      location: "Táchira, Venezuela",
    };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="mb-12 text-center">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Nuestro equipo</h1>
        <p className="mt-2 text-muted">
          Los recreadores que le ponen la energía y magia a cada evento de Divertimania.
        </p>
      </div>

      <div className="relative w-full">
        <ChromaGrid
          items={items}
          columns={4}
          rows={2}
          radius={300}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
        />
      </div>

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
