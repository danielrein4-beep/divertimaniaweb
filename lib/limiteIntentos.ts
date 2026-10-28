// Límite de intentos por IP (login y formulario de contacto), en memoria: el sitio corre en un solo
// contenedor, así que no hace falta Redis. Se reinicia con cada despliegue, lo cual es aceptable.

type Registro = { cuenta: number; vence: number };
const registros = new Map<string, Registro>();

/**
 * IP real del visitante. En Coolify el proxy (Traefik) escribe X-Real-Ip y pisa lo que mande el
 * cliente; no se usa la primera IP de X-Forwarded-For porque esa la puede inventar cualquiera.
 */
export function ipDelVisitante(request: Request): string {
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  const reenviada = request.headers.get("x-forwarded-for")?.split(",").pop()?.trim();
  return reenviada || "desconocida";
}

/** true si todavía puede intentar; false si pasó el tope dentro de la ventana. */
export function permitirIntento(clave: string, tope: number, ventanaMs: number): boolean {
  const ahora = Date.now();
  const r = registros.get(clave);
  if (!r || r.vence < ahora) {
    registros.set(clave, { cuenta: 1, vence: ahora + ventanaMs });
    if (registros.size > 5000) for (const [k, v] of registros) if (v.vence < ahora) registros.delete(k);
    return true;
  }
  r.cuenta += 1;
  return r.cuenta <= tope;
}

/** Borra el contador (por ejemplo, después de un login correcto). */
export function reiniciarIntentos(clave: string) {
  registros.delete(clave);
}
