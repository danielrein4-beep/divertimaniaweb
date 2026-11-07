// Cifras de confianza del Inicio y precios «desde» de los paquetes de /fiestas. Las cargan los
// dueños en el panel; se guardan como JSON en ConfiguracionSitio y lo vacío no se muestra.
import { z } from "zod";
import type { Fiesta, Paquete } from "@/lib/fiestas";

const cifra = z.number().int().min(0).max(1_000_000).nullable().optional();
export const cifrasSchema = z.object({ fiestas: cifra, anios: cifra, ciudades: cifra });
export type Cifras = z.infer<typeof cifrasSchema>;

export const preciosSchema = z.record(z.string().max(80), z.number().min(0).max(100_000).nullable());
export type Precios = z.infer<typeof preciosSchema>;

function leerJson<T>(texto: string | null | undefined, schema: z.ZodType<T>, vacio: T): T {
  if (!texto) return vacio;
  try {
    const r = schema.safeParse(JSON.parse(texto));
    return r.success ? r.data : vacio;
  } catch {
    return vacio;
  }
}

export const leerCifras = (texto: string | null | undefined): Cifras => leerJson(texto, cifrasSchema, {});
export const leerPrecios = (texto: string | null | undefined): Precios => leerJson(texto, preciosSchema, {});

/** Clave del precio de un paquete: «15-anos/Show». */
export const clavePaquete = (ruta: string, paquete: string) => `${ruta}/${paquete}`;

/** Los paquetes de una fiesta con el «desde» que cargaron los dueños (si no hay, queda el del código). */
export function paquetesConPrecio(fiesta: Pick<Fiesta, "ruta" | "paquetes">, precios: Precios): Paquete[] {
  return fiesta.paquetes.map((p) => {
    const precio = precios[clavePaquete(fiesta.ruta, p.nombre)];
    return precio != null && precio > 0 ? { ...p, desde: precio } : p;
  });
}

/** Las cifras que se muestran en el Inicio, en orden; vacío si no cargaron ninguna. */
export function cifrasParaMostrar(c: Cifras): { valor: string; texto: string }[] {
  const n = new Intl.NumberFormat("es-VE");
  return [
    c.fiestas ? { valor: `+${n.format(c.fiestas)}`, texto: "fiestas realizadas" } : null,
    c.anios ? { valor: n.format(c.anios), texto: c.anios === 1 ? "año animando" : "años animando" } : null,
    c.ciudades ? { valor: n.format(c.ciudades), texto: c.ciudades === 1 ? "ciudad" : "ciudades de Venezuela" } : null,
  ].filter((x): x is { valor: string; texto: string } => x !== null);
}
