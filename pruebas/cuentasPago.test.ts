import { describe, expect, it } from "vitest";
import { cuentasActivas, cuentasSchema, leerCuentas, metodosDisponibles, TIPOS_CUENTA } from "@/lib/cuentasPago";

const POR_DEFECTO = ["Pago móvil", "Zelle"];
const guardar = (c: unknown) => JSON.stringify(cuentasSchema.parse(c));

describe("cuentas para cobrar", () => {
  it("sin nada guardado: todos los métodos apagados y los métodos por defecto", () => {
    const { cuentas, textoLibre } = leerCuentas(null);
    expect(cuentas.map((c) => c.tipo)).toEqual([...TIPOS_CUENTA]);
    expect(cuentas.every((c) => !c.activo)).toBe(true);
    expect(textoLibre).toBeNull();
    expect(metodosDisponibles(null, POR_DEFECTO)).toEqual(POR_DEFECTO);
  });

  it("los datos viejos escritos a mano se conservan como texto", () => {
    expect(leerCuentas("Pago móvil Banesco 0414").textoLibre).toBe("Pago móvil Banesco 0414");
  });

  it("solo se muestran los métodos encendidos que tienen datos (el efectivo no los necesita)", () => {
    const g = guardar([
      { tipo: "ZELLE", activo: true, datos: { correo: "pagos@correo.com", titular: "Ana" } },
      { tipo: "BINANCE", activo: true, datos: { payId: " " } },
      { tipo: "EFECTIVO", activo: true, datos: {} },
    ]);
    expect(cuentasActivas(g).map((c) => c.tipo)).toEqual(["ZELLE", "EFECTIVO"]);
    expect(metodosDisponibles(g, POR_DEFECTO)).toEqual(["Zelle", "Efectivo en dólares"]);
  });

  it("las cuentas en bolívares guardadas antes se ignoran sin romper nada", () => {
    const viejo = JSON.stringify([{ tipo: "PAGO_MOVIL", activo: true, datos: { banco: "Banesco" } }, { tipo: "EFECTIVO", activo: true, datos: {} }]);
    expect(leerCuentas(viejo).textoLibre).toBeNull();
    expect(cuentasActivas(viejo).map((c) => c.tipo)).toEqual(["EFECTIVO"]);
  });

  it("rechaza métodos que no existen y datos demasiado largos", () => {
    expect(cuentasSchema.safeParse([{ tipo: "PAYPAL", activo: true, datos: {} }]).success).toBe(false);
    expect(cuentasSchema.safeParse([{ tipo: "ZELLE", activo: true, datos: { correo: "x".repeat(200) } }]).success).toBe(false);
  });
});
