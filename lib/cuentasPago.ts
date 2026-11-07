// Cuentas donde Divertimania recibe pagos. Las llenan los dueños en Ajustes, por método, y el
// cliente las ve como tarjetas en su reserva. Se guardan como JSON en ConfiguracionSitio.datosPago
// (antes era texto libre: si lo que hay no es JSON, se muestra tal cual como «Otros datos»).
import { z } from "zod";

export const TIPOS_CUENTA = ["PAGO_MOVIL", "TRANSFERENCIA", "ZELLE", "BINANCE", "EFECTIVO"] as const;
export type TipoCuenta = (typeof TIPOS_CUENTA)[number];

/** Nombre del método y los datos que pide, en el orden en que se muestran. */
export const METODOS: Record<TipoCuenta, { nombre: string; campos: { clave: string; etiqueta: string; ejemplo: string }[] }> = {
  PAGO_MOVIL: {
    nombre: "Pago móvil",
    campos: [
      { clave: "banco", etiqueta: "Banco", ejemplo: "Banesco (0134)" },
      { clave: "telefono", etiqueta: "Teléfono", ejemplo: "0414-1234567" },
      { clave: "documento", etiqueta: "Cédula o RIF", ejemplo: "V-12345678" },
    ],
  },
  TRANSFERENCIA: {
    nombre: "Transferencia en bolívares",
    campos: [
      { clave: "banco", etiqueta: "Banco", ejemplo: "Mercantil" },
      { clave: "cuenta", etiqueta: "Número de cuenta", ejemplo: "0105 0000 00 0000000000" },
      { clave: "titular", etiqueta: "Titular", ejemplo: "Divertimania C.A." },
      { clave: "documento", etiqueta: "Cédula o RIF", ejemplo: "J-12345678-9" },
    ],
  },
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
    const leidas = cuentasSchema.parse(JSON.parse(guardado));
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
