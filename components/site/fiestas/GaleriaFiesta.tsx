import Image from "next/image";

/** Mosaico de fotos reales de los servicios de esta ocasión: la primera grande, el resto alrededor. */
export default function GaleriaFiesta({ fotos, nombre }: { fotos: { url: string; servicio: string }[]; nombre: string }) {
  if (fotos.length < 3) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="type-h1 font-display font-extrabold">
        Así se viven nuestras fiestas de <span className="text-neon-green">{nombre.toLowerCase()}</span>
      </h2>
      <div className="mt-10 grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[200px] md:grid-cols-4">
        {fotos.slice(0, 7).map((f, i) => (
          <figure key={f.url} className={`group relative overflow-hidden rounded-xl bg-white/5 ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
            <Image
              src={f.url}
              alt={f.servicio}
              fill
              sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-8 text-xs font-semibold opacity-0 transition-opacity group-hover:opacity-100">
              {f.servicio}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
