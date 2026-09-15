import Link from "next/link";
import Image from "next/image";
import PlaceholderImage from "@/components/site/PlaceholderImage";
import Hero from "@/components/site/Hero";
import AccordionGallery, { type AccordionGalleryItem } from "@/components/site/AccordionGallery";
import { CATEGORIAS } from "@/lib/site";
import { getImageAspect } from "@/lib/imageAspect";

const DESTACADOS = [
  { nombre: "Espumanía", fotoUrl: "/images/espumania-foam.png" },
  { nombre: "El Chacal de la Trompeta", fotoUrl: null },
  { nombre: "Bolas Disco", fotoUrl: "/images/bolas-disco-equipo.jpg" },
  { nombre: "Show según temática", fotoUrl: "/images/show-tematico-catrina.jpg" },
];

const CATEGORIA_FOTO: Partial<Record<(typeof CATEGORIAS)[number], string>> = {
  "Fiestas Infantiles": "/images/fiestas-infantiles-mario.jpg",
  "Baby Shower": "/images/baby-shower.png",
  Personajes: "/images/mickey-racer.jpg",
  "Show para Adultos": "/images/bolas-disco-duo.jpg",
  "Estación Creativa": "/images/diverti-artistas.png",
  Atracciones: "/images/pelotas-boom-rooftop.png",
};

const CATEGORIA_ITEMS: AccordionGalleryItem[] = CATEGORIAS.map((categoria) => ({
  image: CATEGORIA_FOTO[categoria] ?? "/images/fiestas-infantiles-mario.jpg",
  label: categoria,
  link: `/catalogo?categoria=${encodeURIComponent(categoria)}`,
}));

export default function Home() {
  return (
    <div>
      <Hero />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="mb-6 text-center text-2xl font-bold sm:text-3xl">¿Qué estás celebrando?</h2>
        <div className="hidden sm:block">
          <AccordionGallery
            items={CATEGORIA_ITEMS}
            defaultIndex={2}
            expandRatio={0.52}
            trigger="hover"
            accentColor="#9dff3c"
            overlayColor="#0a0a0f"
            textColor="#ffffff"
            grayscale
            showLabels
            duration={0.6}
            ease="power3.out"
            parallax={0.5}
            tilt={8}
            stagger={0.06}
            height={420}
            gap={10}
            radius={16}
            orientation="horizontal"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {CATEGORIA_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.link!}
              className="group relative aspect-[3/2] w-full overflow-hidden rounded-2xl border border-border bg-background-card"
            >
              <Image src={item.image} alt={item.label} fill className="object-cover" sizes="50vw" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-3 text-sm font-semibold text-white">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-background-elevated py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl">Shows destacados</h2>
          <p className="mb-8 text-center text-muted">
            La energía que hace que tu evento se hable por semanas.
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {DESTACADOS.map((show) =>
              show.fotoUrl ? (
                <div
                  className="relative w-full overflow-hidden rounded-2xl border border-border bg-background-card"
                  style={{ aspectRatio: getImageAspect(show.fotoUrl) }}
                  key={show.nombre}
                >
                  <Image src={show.fotoUrl} alt={show.nombre} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-4 text-sm font-semibold text-white">
                    {show.nombre}
                  </span>
                </div>
              ) : (
                <PlaceholderImage key={show.nombre} label={show.nombre} className="aspect-[4/5] w-full" />
              )
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          ¿Listo para <span className="text-neon-green">planear tu evento</span>?
        </h2>
        <p className="max-w-xl text-muted">
          Consulta disponibilidad para tu fecha y arma el paquete perfecto para tu celebración.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/disponibilidad"
            className="rounded-full bg-neon-green px-6 py-3 font-semibold text-background transition-transform hover:scale-105"
          >
            Consultar disponibilidad
          </Link>
          <Link
            href="/contacto"
            className="rounded-full border border-border px-6 py-3 font-semibold hover:border-neon-green hover:text-neon-green"
          >
            Contáctanos
          </Link>
        </div>
      </section>
    </div>
  );
}
