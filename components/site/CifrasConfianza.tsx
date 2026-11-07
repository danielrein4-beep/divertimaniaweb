import { cifrasParaMostrar, type Cifras } from "@/lib/confianza";

/** Franja de cifras reales debajo de la portada («+800 fiestas realizadas»). Sin cifras, no aparece. */
export default function CifrasConfianza({ cifras }: { cifras: Cifras }) {
  const lista = cifrasParaMostrar(cifras);
  if (lista.length === 0) return null;
  return (
    <section aria-label="Divertimania en números" className="border-y border-white/10 bg-white/[0.02]">
      <dl className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-14 gap-y-6 px-4 py-8 sm:px-6">
        {lista.map((c) => (
          <div key={c.texto} className="text-center">
            <dt className="sr-only">{c.texto}</dt>
            <dd>
              <span className="block font-display text-4xl font-extrabold text-neon-green sm:text-5xl">{c.valor}</span>
              <span className="text-sm text-muted">{c.texto}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
