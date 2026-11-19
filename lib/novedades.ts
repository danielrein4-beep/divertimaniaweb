/** Lo que el Inicio necesita de cada novedad de temporada (o del «lo más buscado» que la reemplaza si no hay ninguna). */
export type NovedadHero = {
  id: string;
  badge: string;
  titulo: string;
  descripcion: string;
  fotoUrl: string | null;
  /** Todas las fotos de fondo, en orden (la principal primero). */
  fotos: string[];
  ctaTexto: string;
  ctaUrl: string | null;
};

/** «2026-12-01» → Date a mediodía (UTC), para que el día no se corra por la zona horaria. Vacío → null. */
export function fechaDeFormulario(valor: string | null | undefined, finDeDia = false): Date | null {
  if (!valor) return null;
  const dia = valor.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dia)) return null;
  return new Date(`${dia}T${finDeDia ? "23:59:59" : "00:00:00"}.000Z`);
}

/** «a.jpg, b.jpg» → ["a.jpg", "b.jpg"]; la foto principal va primero y sin repetir. */
export function listaDeFotos(principal: string | null, extra: string | null | undefined): string[] {
  const todas = [principal, ...(extra ?? "").split(",")].map((f) => (f ?? "").trim()).filter(Boolean);
  return [...new Set(todas)];
}
