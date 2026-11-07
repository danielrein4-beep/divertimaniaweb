import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getConfigSitio } from "@/lib/configSitio";
import { buildWhatsAppLink } from "@/lib/telefono";
import { COBERTURA, SITE_URL } from "@/lib/negocio";
import { FIESTAS, fiestaCompleta } from "@/lib/fiestas";
import { leerPrecios, paquetesConPrecio } from "@/lib/confianza";
import ServicioCard from "@/components/ui/ServicioCard";
import CotizarButtons from "@/components/site/CotizarButtons";
import PortadaFiesta from "@/components/site/fiestas/PortadaFiesta";
import Paquetes from "@/components/site/fiestas/Paquetes";
import GaleriaFiesta from "@/components/site/fiestas/GaleriaFiesta";
import Testimonios from "@/components/site/Testimonios";
import { OtrasCelebraciones, PasosReserva, PreguntasFiesta } from "@/components/site/fiestas/CierreFiesta";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ ocasion: string }> };

export function generateStaticParams() {
  return FIESTAS.map((f) => ({ ocasion: f.ruta }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const fiesta = fiestaCompleta((await params).ocasion);
  if (!fiesta) return {};
  return {
    title: fiesta.seo.titulo,
    description: fiesta.seo.descripcion,
    alternates: { canonical: `/fiestas/${fiesta.ruta}` },
    openGraph: { title: fiesta.seo.titulo, description: fiesta.seo.descripcion, images: [{ url: fiesta.foto, alt: fiesta.nombre }] },
  };
}

/** Página de una ocasión: portada, por qué, paquetes, servicios, galería, cómo reservar y preguntas. */
export default async function PaginaFiesta({ params }: Props) {
  const fiesta = fiestaCompleta((await params).ocasion);
  if (!fiesta) notFound();

  const ocasiones = [fiesta.ocasion, ...(fiesta.tambienServicios ?? [])];
  const [{ whatsapp }, servicios, config] = await Promise.all([
    getConfigSitio(),
    prisma.servicio.findMany({
      where: { activo: true, OR: ocasiones.map((o) => ({ ocasiones: { contains: o } })) },
      orderBy: [{ masPedido: "desc" }, { orden: "asc" }],
      include: {
        media: { orderBy: { orden: "asc" } },
        _count: { select: { opciones: true } },
      },
    }),
    prisma.configuracionSitio.findUnique({ where: { id: "principal" }, select: { preciosPaquetes: true } }),
  ]);

  const mensaje = `Hola Divertimania, vengo de la página de ${fiesta.nombre.toLowerCase()} y quiero cotizar para mi evento.`;
  const enlace = buildWhatsAppLink(whatsapp, mensaje);
  const fotos = servicios.flatMap((s) => [
    ...(s.fotoUrl ? [{ url: s.fotoUrl, servicio: s.nombre }] : []),
    ...s.media.filter((m) => m.tipo === "FOTO").map((m) => ({ url: m.url, servicio: s.nombre })),
  ]);

  // Para Google: el servicio que se ofrece y sus preguntas frecuentes.
  const datos = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: fiesta.h1,
      serviceType: `Animación para ${fiesta.nombre.toLowerCase()}`,
      description: fiesta.seo.descripcion,
      url: `${SITE_URL}/fiestas/${fiesta.ruta}`,
      areaServed: { "@type": "Country", name: "Venezuela" },
      provider: { "@type": "EntertainmentBusiness", name: "Divertimania", url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: fiesta.preguntas.map((p) => ({ "@type": "Question", name: p.pregunta, acceptedAnswer: { "@type": "Answer", text: p.respuesta } })),
    },
  ];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datos) }} />
      <PortadaFiesta nombre={fiesta.nombre} h1={fiesta.h1} bajada={fiesta.bajada} foto={fiesta.foto} video={fiesta.video} whatsapp={enlace} />

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pt-16 sm:px-6 md:grid-cols-3">
        {fiesta.porque.map((p) => (
          <div key={p.titulo} className="border-l-2 border-neon-green pl-5">
            <h2 className="font-display text-xl font-bold">{p.titulo}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.texto}</p>
          </div>
        ))}
      </section>

      <Paquetes paquetes={paquetesConPrecio(fiesta, leerPrecios(config?.preciosPaquetes))} nombre={fiesta.nombre} whatsapp={whatsapp} ocasionSlug={fiesta.ocasion} />

      {servicios.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
          <h2 className="type-h1 font-display font-extrabold">Lo que más piden</h2>
          <p className="mt-3 text-muted">Agrégalos a tu fiesta y te cotizamos todo junto.</p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {servicios.slice(0, 8).map((s, i) => {
              const video = s.media.find((m) => m.tipo === "VIDEO");
              return (
                <ServicioCard
                  key={s.id}
                  id={s.id}
                  nombre={s.nombre}
                  categoria={s.categoria}
                  fotoUrl={s.fotoUrl}
                  videoUrl={video?.url ?? null}
                  posterUrl={video?.poster ?? null}
                  edadIdeal={s.edadIdeal}
                  duracion={s.duracion}
                  masPedido={s.masPedido}
                  soloAdultos={s.soloAdultos}
                  tieneOpciones={s._count.opciones > 0}
                  priority={i < 2}
                />
              );
            })}
          </div>
        </section>
      )}

      <GaleriaFiesta fotos={fotos} nombre={fiesta.nombre} />
      <Testimonios />
      <PasosReserva />
      <PreguntasFiesta preguntas={fiesta.preguntas} />

      <section className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 pb-16 text-center sm:px-6">
        <h2 className="type-h1 font-display font-extrabold">
          ¿Ya tienes la fecha? <span className="text-neon-green">Armemos tu {fiesta.nombre.toLowerCase()}.</span>
        </h2>
        <p className="max-w-lg text-muted">{COBERTURA.titulo}. {COBERTURA.anticipacion}</p>
        <CotizarButtons />
        <Link href="/reservar" className="text-sm font-semibold text-neon-green hover:underline">
          O aparta tu fecha con anticipo
        </Link>
      </section>

      <OtrasCelebraciones actual={fiesta.ruta} />
    </div>
  );
}
