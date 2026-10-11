"use client";

/** Piezas pequeñas del panel: tarjeta, campo con etiqueta, interruptor y estilos de input. */

export const inputClase =
  "w-full rounded-lg border border-white/15 bg-background px-3 py-2.5 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted focus:border-neon-green";

export function Tarjeta({
  titulo,
  ayuda,
  children,
  className = "",
}: {
  titulo: string;
  ayuda?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`card-glass flex flex-col gap-4 rounded-2xl p-5 ${className}`}>
      <div>
        <h2 className="text-lg font-bold">{titulo}</h2>
        {ayuda && <p className="mt-0.5 text-sm text-muted">{ayuda}</p>}
      </div>
      {children}
    </section>
  );
}

export function Campo({
  etiqueta,
  ayuda,
  children,
  className = "",
}: {
  etiqueta: string;
  ayuda?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-sm font-semibold text-foreground/90">{etiqueta}</span>
      {children}
      {ayuda && <span className="text-xs text-muted">{ayuda}</span>}
    </label>
  );
}

export function Interruptor({
  activo,
  onCambio,
  titulo,
  ayuda,
  tono = "lima",
}: {
  activo: boolean;
  onCambio: (v: boolean) => void;
  titulo: string;
  ayuda?: string;
  tono?: "lima" | "rojo";
}) {
  const encendido = tono === "rojo" ? "bg-red-500" : "bg-neon-green";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      onClick={() => onCambio(!activo)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 px-4 py-3 text-left transition-colors hover:border-white/25"
    >
      <span>
        <span className="block text-[15px] font-semibold">{titulo}</span>
        {ayuda && <span className="mt-0.5 block text-xs text-muted">{ayuda}</span>}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${activo ? encendido : "bg-white/20"}`}
        aria-hidden
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            activo ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export function Aviso({ tipo, children }: { tipo: "error" | "ok"; children: React.ReactNode }) {
  return (
    <p
      role={tipo === "error" ? "alert" : "status"}
      className={`rounded-lg border px-3 py-2 text-sm ${
        tipo === "error" ? "border-red-500/30 bg-red-500/10 text-red-300" : "border-neon-green/30 bg-neon-green/10 text-neon-green"
      }`}
    >
      {children}
    </p>
  );
}
