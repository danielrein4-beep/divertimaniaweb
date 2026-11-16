// Cálculos de la pantalla Resultados: periodos, días en hora de Venezuela y conteos.

export const RANGOS = [7, 30, 90] as const;
const ZONA = "America/Caracas";

export const diaLocal = new Intl.DateTimeFormat("en-CA", { timeZone: ZONA, year: "numeric", month: "2-digit", day: "2-digit" });
export const diaCorto = new Intl.DateTimeFormat("es-VE", { timeZone: ZONA, day: "numeric", month: "short" });
export const numero = new Intl.NumberFormat("es-VE");

/** Cuenta cuántas veces aparece cada clave y lo devuelve de mayor a menor. */
export function contar<T>(lista: T[], clave: (x: T) => string | null | undefined) {
  const mapa = new Map<string, number>();
  for (const x of lista) {
    const k = clave(x);
    if (k) mapa.set(k, (mapa.get(k) ?? 0) + 1);
  }
  return [...mapa.entries()].sort((a, b) => b[1] - a[1]);
}

export const NOMBRE_PAGINA: Record<string, string> = {
  "/": "Inicio",
  "/catalogo": "Catálogo",
  "/galeria": "Galería",
  "/equipo": "Equipo",
  "/contacto": "Contacto",
  "/disponibilidad": "Consulta tu fecha",
};

const DIA_MS = 24 * 60 * 60 * 1000;

/** Inicio del periodo y todos sus días (hora de Venezuela), para que los días en cero también salgan. */
export function rango(dias: number) {
  const ahora = Date.now();
  return {
    desde: new Date(ahora - dias * DIA_MS),
    diasSerie: Array.from({ length: dias }, (_, i) => {
      const fecha = new Date(ahora - (dias - 1 - i) * DIA_MS);
      return { clave: diaLocal.format(fecha), etiqueta: diaCorto.format(fecha) };
    }),
  };
}

/** Fiestas que llegaron por la web en el periodo: en qué paso va cada reserva y el dinero de las confirmadas. */
export type ReservaResumen = { estado: string; montoTotal: number | null; montoAnticipo: number | null };

export function resumenReservas(reservas: ReservaResumen[]) {
  const en = (...estados: string[]) => reservas.filter((r) => estados.includes(r.estado));
  const confirmadas = en("CONFIRMADA");
  const suma = (lista: ReservaResumen[], campo: "montoTotal" | "montoAnticipo") =>
    lista.reduce((t, r) => t + (r[campo] ?? 0), 0);
  return {
    apartadas: reservas.length,
    porCotizar: en("SOLICITADA").length,
    esperandoAnticipo: en("ESPERANDO_PAGO").length,
    pagoPorRevisar: en("PAGO_REPORTADO").length,
    confirmadas: confirmadas.length,
    noRealizadas: en("RECHAZADA").length,
    vendidoConfirmado: suma(confirmadas, "montoTotal"),
    anticiposConfirmados: suma(confirmadas, "montoAnticipo"),
  };
}

/** Personas distintas (no clics) por clave: así un servicio abierto diez veces por la misma persona cuenta una. */
export function contarPersonas<T extends { visitante: string | null; createdAt: Date }>(
  lista: T[],
  clave: (x: T) => string | null | undefined
) {
  const mapa = new Map<string, Set<string>>();
  for (const x of lista) {
    const k = clave(x);
    if (!k) continue;
    const quien = x.visitante ?? x.createdAt.toISOString();
    mapa.set(k, (mapa.get(k) ?? new Set()).add(quien));
  }
  return [...mapa.entries()].map(([k, s]): [string, number] => [k, s.size]).sort((a, b) => b[1] - a[1]);
}

export const dolares = new Intl.NumberFormat("es-VE", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
