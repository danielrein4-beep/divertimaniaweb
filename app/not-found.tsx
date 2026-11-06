import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/site/Logo";

export const metadata: Metadata = {
  title: "Página no encontrada | Divertimania",
  robots: { index: false },
};

/** 404 para cualquier dirección que no existe (enlaces viejos, servicios borrados, errores de tipeo). */
export default function NoEncontrada() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo height={44} />
      <p className="font-display text-7xl font-extrabold text-neon-green">404</p>
      <div className="max-w-md">
        <h1 className="font-display text-2xl font-bold">Esta página se fue de fiesta</h1>
        <p className="mt-2 text-muted">
          El enlace está viejo o el servicio ya no está en el catálogo. Lo que buscas seguro está aquí:
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/catalogo" className="touch-target rounded-full bg-neon-green px-6 text-sm font-bold text-background">
          Ver el catálogo
        </Link>
        <Link href="/" className="touch-target rounded-full border border-white/20 px-6 text-sm font-semibold hover:border-neon-green hover:text-neon-green">
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
