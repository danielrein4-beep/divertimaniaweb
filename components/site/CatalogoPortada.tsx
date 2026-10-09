import Image from "next/image";
import Link from "next/link";

type Foto = { id: string; nombre: string; fotoUrl: string | null };

// Posición y giro de cada foto del collage (como fotos pegadas en una pared).
const LUGARES = [
  { className: "left-0 top-10 w-[46%]", giro: -4 },
  { className: "right-2 top-0 w-[42%]", giro: 3 },
  { className: "left-[27%] bottom-0 w-[42%] z-10", giro: -1 },
];

/** Collage de fotos reales de eventos para la cabecera del catálogo (solo escritorio). */
export default function CatalogoPortada({ fotos }: { fotos: Foto[] }) {
  if (fotos.length < 3) return null;
  return (
    <div className="relative hidden h-[440px] lg:block" aria-hidden>
      {fotos.slice(0, 3).map((f, i) => (
        <div key={f.id} className={`absolute ${LUGARES[i].className}`} style={{ transform: `rotate(${LUGARES[i].giro}deg)` }}>
          <Link href={`/catalogo/${f.id}`} tabIndex={-1} className="photo-polaroid block">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px]">
              <Image src={f.fotoUrl!} alt="" fill sizes="220px" priority={i === 0} className="object-cover" />
            </div>
            <p className="mt-2 truncate px-0.5 font-display text-[15px] font-bold leading-none text-[#141414]">
              {f.nombre}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
}
