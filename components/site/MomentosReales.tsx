import Image from "next/image";
import Link from "next/link";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/site";


export default function MomentosReales() {
  return (
    <section className="overflow-hidden py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[1fr_1.1fr] md:gap-16">
        <div className="photo-polaroid relative mx-auto w-full max-w-sm">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src="/images/rapunzel-cumpleanos.png"
              alt="Rapunzel abrazando a una cumpleañera"
              fill
              sizes="(max-width: 768px) 90vw, 400px"
              className="object-cover"
            />
          </div>
          <p className="pt-3 text-center font-display text-lg font-bold text-neutral-800">Fiesta real · Táchira</p>
        </div>

        <div className="flex flex-col gap-5">
          <h2 className="type-h1 font-display font-extrabold">
            Lo que queda es la cara de tu chamo cuando llega su personaje.
          </h2>
          <p className="type-body text-muted">
            Llevamos la animación, el sonido y los personajes. Tú solo te preocupas por disfrutar y tomar las fotos.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/galeria"
              className="touch-target rounded-full border border-white/20 px-5 text-sm font-semibold transition-colors hover:border-neon-green hover:text-neon-green"
            >
              Ver galería
            </Link>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target rounded-full px-5 text-sm font-semibold text-muted transition-colors hover:text-foreground"
            >
              @{INSTAGRAM_HANDLE} en Instagram →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
