"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { pedir } from "@/components/admin/subir";
import { Aviso, Campo, Tarjeta, inputClase } from "@/components/admin/ui";

/** Cambiar la contraseña del panel. */
export default function CambiarClave() {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [repetir, setRepetir] = useState("");
  const [ver, setVer] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: "error" | "ok"; texto: string } | null>(null);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (nueva !== repetir) {
      setAviso({ tipo: "error", texto: "Las dos contraseñas nuevas no coinciden." });
      return;
    }
    setGuardando(true);
    setAviso(null);
    try {
      await pedir("/api/ajustes/clave", "PUT", { actual, nueva });
      setActual("");
      setNueva("");
      setRepetir("");
      setAviso({ tipo: "ok", texto: "Listo. La próxima vez entra con la contraseña nueva." });
    } catch (err) {
      setAviso({ tipo: "error", texto: err instanceof Error ? err.message : "No se pudo cambiar." });
    } finally {
      setGuardando(false);
    }
  }

  const tipo = ver ? "text" : "password";

  return (
    <Tarjeta titulo="Contraseña del panel" ayuda="Usa al menos 8 caracteres. No la compartas por chat.">
      <form onSubmit={enviar} className="flex flex-col gap-4">
        <Campo etiqueta="Contraseña actual">
          <input type={tipo} autoComplete="current-password" required value={actual} onChange={(e) => setActual(e.target.value)} className={inputClase} />
        </Campo>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo etiqueta="Nueva contraseña">
            <input type={tipo} autoComplete="new-password" required minLength={8} value={nueva} onChange={(e) => setNueva(e.target.value)} className={inputClase} />
          </Campo>
          <Campo etiqueta="Repite la nueva">
            <input type={tipo} autoComplete="new-password" required minLength={8} value={repetir} onChange={(e) => setRepetir(e.target.value)} className={inputClase} />
          </Campo>
        </div>
        <button type="button" onClick={() => setVer((v) => !v)} className="inline-flex items-center gap-1.5 self-start text-sm text-muted hover:text-foreground">
          {ver ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
          {ver ? "Ocultar" : "Mostrar"} contraseñas
        </button>
        {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}
        <button
          type="submit"
          disabled={guardando}
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-lg bg-neon-green px-5 text-sm font-bold text-background hover:bg-neon-green-dark disabled:opacity-50"
        >
          {guardando && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Cambiar contraseña
        </button>
      </form>
    </Tarjeta>
  );
}
