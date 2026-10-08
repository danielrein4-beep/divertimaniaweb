import Link from "next/link";
import Button from "@/components/ui/Button";
import { Sparkles, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-surface/80 p-8 sm:p-12 shadow-2xl backdrop-blur-md">
        <div className="relative">
          <span className="font-display font-extrabold text-7xl sm:text-8xl text-neon-green tracking-tight drop-shadow-[0_0_25px_rgba(157,255,60,0.3)]">
            404
          </span>
          <span className="absolute -top-2 -right-4 rotate-12 rounded-full bg-magenta/20 border border-magenta/40 px-2.5 py-0.5 text-[11px] font-bold text-magenta uppercase">
            ¡Ups!
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-display font-extrabold text-2xl text-foreground">
            Esta fiesta no está por aquí
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            La página que buscas cambió de lugar o aún no está disponible. Pero la diversión continúa en nuestro catálogo.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button variant="secondary" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Ir al Inicio
            </Button>
          </Link>
          <Link href="/catalogo">
            <Button variant="primary" size="md" leftIcon={<Compass className="w-4 h-4" />}>
              Ver Catálogo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
