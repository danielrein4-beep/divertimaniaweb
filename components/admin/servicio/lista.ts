/** Las ocasiones y los «se combina con» se guardan como texto separado por comas. */
export const leerLista = (valor: string | null) => (valor ?? "").split(",").map((x) => x.trim()).filter(Boolean);

/** Agrega o quita un elemento y lo devuelve como texto (null si queda vacío). */
export function alternarEnLista(valor: string | null, elemento: string): string | null {
  const actual = leerLista(valor);
  const nueva = actual.includes(elemento) ? actual.filter((x) => x !== elemento) : [...actual, elemento];
  return nueva.join(",") || null;
}
