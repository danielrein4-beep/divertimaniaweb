// Cuentas donde Divertimania recibe pagos. Las llenan los dueños en Ajustes, por método, y el
// cliente las ve como tarjetas en su reserva. Se guardan como JSON en ConfiguracionSitio.datosPago
// (antes era texto libre: si lo que hay no es JSON, se muestra tal cual como «Otros datos»).
// Solo cobros en divisas: los métodos en bolívares se quitaron a pedido de los dueños.
import { z } from "zod";

export const TIPOS_CUENTA = ["ZELLE", "BINANCE", "EFECTIVO"] as const;
export type TipoCuenta = (typeof TIPOS_CUENTA)[number];

/** Nombre del método y los datos que pide, en el orden en que se muestran. */
export const METODOS: Record<TipoCuenta, { nombre: string; campos: { clave: string; etiqueta: string; ejemplo: string }[] }> = {
  ZELLE: {
    nombre: "Zelle",
    campos: [
      { clave: "correo", etiqueta: "Correo", ejemplo: "pagos@correo.com" },
      { clave: "titular", etiqueta: "A nombre de", ejemplo: "Nombre Apellido" },
    ],
  },
  BINANCE: {
    nombre: "Binance (USDT)",
    campos: [
      { clave: "payId", etiqueta: "Pay ID o correo", ejemplo: "123456789" },
      { clave: "titular", etiqueta: "Usuario", ejemplo: "divertimania" },
    ],
  },
  EFECTIVO: {
    nombre: "Efectivo en dólares",
    campos: [{ clave: "nota", etiqueta: "Dónde se entrega", ejemplo: "En nuestra oficina o el día de la visita" }],
  },
};

const cuentaSchema = z.object({
  tipo: z.enum(TIPOS_CUENTA),
  activo: z.boolean(),
  datos: z.record(z.string(), z.string().trim().max(120)),
});
export const cuentasSchema = z.array(cuentaSchema).max(TIPOS_CUENTA.length);
export type CuentaPago = z.infer<typeof cuentaSchema>;

export type CuentasGuardadas = { cuentas: CuentaPago[]; textoLibre: string | null };

/** Todas las cuentas (una por método, en orden), con lo guardado encima de los valores vacíos. */
export function leerCuentas(guardado: string | null | undefined): CuentasGuardadas {
  const vacias: CuentaPago[] = TIPOS_CUENTA.map((tipo) => ({ tipo, activo: false, datos: {} }));
  if (!guardado?.trim()) return { cuentas: vacias, textoLibre: null };
  try {
    // Métodos que ya no se ofrecen (pago móvil, transferencia en bolívares) se descartan sin error.
    const crudas: unknown = JSON.parse(guardado);
    const vigentes = Array.isArray(crudas) ? crudas.filter((c) => TIPOS_CUENTA.includes((c as { tipo?: TipoCuenta })?.tipo as TipoCuenta)) : crudas;
    const leidas = cuentasSchema.parse(vigentes);
    return { cuentas: vacias.map((v) => leidas.find((c) => c.tipo === v.tipo) ?? v), textoLibre: null };
  } catch {
    return { cuentas: vacias, textoLibre: guardado };
  }
}

/** Una cuenta se muestra al cliente si está activa y tiene al menos un dato (el efectivo no necesita datos). */
export function cuentasActivas(guardado: string | null | undefined): CuentaPago[] {
  return leerCuentas(guardado).cuentas.filter(
    (c) => c.activo && (c.tipo === "EFECTIVO" || METODOS[c.tipo].campos.some((f) => c.datos[f.clave]?.trim()))
  );
}

/** Nombres de los métodos que el cliente puede elegir al reportar el pago. */
export function metodosDisponibles(guardado: string | null | undefined, porDefecto: readonly string[]): string[] {
  const activas = cuentasActivas(guardado);
  return activas.length ? activas.map((c) => METODOS[c.tipo].nombre) : [...porDefecto];
}
