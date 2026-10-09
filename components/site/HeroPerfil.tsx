import Image from "next/image";
import CotizarButtons from "@/components/site/CotizarButtons";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, PERFIL_IG } from "@/lib/site";

/** Cabecera del Inicio con la forma de su perfil de Instagram: lo primero que se ve es quiénes son. */
export default function HeroPerfil() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-5">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Instagram de Divertimania, @${INSTAGRAM_HANDLE}`}
          className="shrink-0 rounded-full bg-neon-green p-[3px]"
        >
          <span className="block rounded-full bg-background p-[3px]">
            <span className="relative block h-20 w-20 overflow-hidden rounded-full bg-black sm:h-24 sm:w-24">
              <Image src="/logo-square.png" alt="" fill sizes="96px" className="object-contain p-1.5" priority />
            </span>
          </span>
        </a>

        <dl className="grid flex-1 grid-cols-2 gap-2 text-center">
          <div className="flex flex-col-reverse">
            <dt className="text-xs text-muted">publicaciones</dt>
            <dd className="text-lg font-bold sm:text-xl">{PERFIL_IG.publicaciones}</dd>
          </div>
          <div className="flex flex-col-reverse">
            <dt className="text-xs text-muted">seguidores</dt>
            <dd className="text-lg font-bold sm:text-xl">{PERFIL_IG.seguidores}</dd>
          </div>
        </dl>
      </div>

      <div>
        <p className="text-sm font-semibold">Divertimania · Eventos y animación en el Táchira</p>
        <h1 className="mt-2 font-display text-[2.6rem] font-extrabold leading-[0.95] tracking-tight text-neon-green sm:text-6xl">
          Divierte
          <br />
          tus fiestas
        </h1>
        <ul className="mt-4 flex flex-col gap-1 text-[15px] text-foreground/90">
          {PERFIL_IG.bio.map((linea) => (
            <li key={linea.texto}>
              <span aria-hidden className="mr-1.5">
                {linea.icono}
              </span>
              {linea.texto}
            </li>
          ))}
        </ul>
      </div>

      <CotizarButtons align="start" />
    </div>
  );
}
