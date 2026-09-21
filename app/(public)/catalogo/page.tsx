import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import PlaceholderImage from "@/components/site/PlaceholderImage";
import { CATEGORIAS, WHATSAPP_LINK } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria: categoriaSeleccionada } = await searchParams;
  const servicios = await prisma.servicio.findMany({ orderBy: { orden: "asc" } });

  const porCategoria = new Map<string, typeof servicios>();
  for (const s of servicios) {
    const lista = porCategoria.get(s.categoria) ?? [];
    lista.push(s);
    porCategoria.set(s.categoria, lista);
  }

  const categorias = categoriaSeleccionada
    ? CATEGORIAS.filter((c) => c === categoriaSeleccionada)
    : CATEGORIAS;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Catálogo de servicios</h1>
        <p className="mt-2 text-muted">Todo lo que podemos hacer realidad en tu evento.</p>
      </div>

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <Link
          href="/catalogo"
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            !categoriaSeleccionada
              ? "border-neon-green bg-neon-green/10 text-neon-green"
              : "border-border text-muted hover:border-neon-green/50"
          }`}
        >
          Todas
        </Link>
        {CATEGORIAS.map((c) => (
          <Link
            key={c}
            href={`/catalogo?categoria=${encodeURIComponent(c)}`}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              categoriaSeleccionada === c
                ? "border-neon-green bg-neon-green/10 text-neon-green"
                : "border-border text-muted hover:border-neon-green/50"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-14">
        {categorias.map((categoria) => {
          const items = porCategoria.get(categoria) ?? [];
          if (items.length === 0) return null;
          return (
            <section key={categoria} id={categoria}>
              <h2 className="mb-5 text-2xl font-bold">{categoria}</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((servicio) => (
                  <div key={servicio.id} className="card-glass flex flex-col overflow-hidden rounded-2xl">
                    {servicio.fotoUrl ? (
                      <div className="relative aspect-[4/5] w-full border-b border-border bg-background-elevated">
                        <Image
                          src={servicio.fotoUrl}
                          alt={servicio.nombre}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    ) : (
                      <PlaceholderImage
                        label={servicio.nombre}
                        className="aspect-[4/5] w-full rounded-none border-0 border-b border-border"
                      />
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-semibold">{servicio.nombre}</h3>
                      <p className="mt-2 text-sm text-muted">{servicio.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-border bg-background-elevated p-10 text-center">
        <h2 className="text-2xl font-bold">¿No encuentras lo que buscas?</h2>
        <p className="max-w-md text-muted">
          Armamos paquetes a medida combinando animación, shows y personajes.
        </p>
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
