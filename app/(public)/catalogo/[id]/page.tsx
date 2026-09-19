import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import PlaceholderImage from "@/components/site/PlaceholderImage";
import ServicioDetalle from "@/components/site/ServicioDetalle";
import { getImageAspect } from "@/lib/imageAspect";
import { buildWhatsAppLink } from "@/lib/site";
import { type TipoOpcion } from "@/lib/validation";

export default async function ServicioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const servicio = await prisma.servicio.findUnique({
    where: { id },
    include: { opciones: { orderBy: { orden: "asc" } } },
  });

  if (!servicio) notFound();

  const tieneOpciones = servicio.opciones.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <Link href={`/catalogo?categoria=${encodeURIComponent(servicio.categoria)}`} className="text-sm text-muted hover:text-neon-green">
        ← {servicio.categoria}
      </Link>

      <div className="mt-4 card-glass overflow-hidden rounded-2xl">
        {servicio.fotoUrl ? (
          <div className="relative w-full border-b border-border bg-background-elevated" style={{ aspectRatio: getImageAspect(servicio.fotoUrl) }}>
            <Image src={servicio.fotoUrl} alt={servicio.nombre} fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" />
          </div>
        ) : (
          <PlaceholderImage label={servicio.nombre} className="aspect-[4/5] w-full rounded-none border-0 border-b border-border" />
        )}
        <div className="p-6">
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{servicio.nombre}</h1>
          <p className="mt-2 text-muted">{servicio.descripcion}</p>

          {!tieneOpciones && (
            <a
              href={buildWhatsAppLink(`Hola Divertimania, quiero cotizar: ${servicio.nombre}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block rounded-full bg-neon-green px-6 py-3 font-semibold text-background transition-transform hover:scale-105"
            >
              Cotizar por WhatsApp
            </a>
          )}
        </div>
      </div>

      {tieneOpciones && (
        <div className="mt-6">
          <ServicioDetalle
            servicioNombre={servicio.nombre}
            opciones={servicio.opciones.map((o) => ({ ...o, tipo: o.tipo as TipoOpcion }))}
          />
        </div>
      )}
    </div>
  );
}
