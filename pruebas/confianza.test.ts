import { describe, expect, it } from "vitest";
import { cifrasParaMostrar, clavePaquete, leerCifras, leerPrecios, paquetesConPrecio } from "@/lib/confianza";
import { testimonioSchema } from "@/lib/testimonios";
import { fiestaPorRuta } from "@/lib/fiestas";

describe("cifras del Inicio", () => {
  it("muestra solo las cargadas, con su formato", () => {
    expect(cifrasParaMostrar({ fiestas: 1200, anios: 8, ciudades: null })).toEqual([
      { valor: "+1.200", texto: "fiestas realizadas" },
      { valor: "8", texto: "años animando" },
    ]);
    expect(cifrasParaMostrar({})).toEqual([]);
  });

  it("un dato guardado dañado no rompe la página", () => {
    expect(leerCifras("{roto")).toEqual({});
    expect(leerPrecios(null)).toEqual({});
  });
});

describe("precios «desde» de los paquetes", () => {
  it("usa el precio cargado en el panel y deja los demás como estaban", () => {
    const quince = fiestaPorRuta("15-anos")!;
    const precios = { [clavePaquete("15-anos", "Show")]: 250, [clavePaquete("15-anos", "Hora loca")]: null };
    const paquetes = paquetesConPrecio(quince, precios);
    expect(paquetes.find((p) => p.nombre === "Show")?.desde).toBe(250);
    expect(paquetes.find((p) => p.nombre === "Hora loca")?.desde).toBeNull();
  });
});

describe("testimonios", () => {
  const base = { nombre: "María", evento: "Cumpleaños de Sofía", texto: "Todo salió perfecto, los niños felices." };

  it("acepta uno completo con foto propia del sitio", () => {
    expect(testimonioSchema.safeParse({ ...base, fotoUrl: "/media/abc.jpg" }).success).toBe(true);
  });

  it("no acepta fotos de otros sitios ni textos vacíos", () => {
    expect(testimonioSchema.safeParse({ ...base, fotoUrl: "https://otro.com/x.jpg" }).success).toBe(false);
    expect(testimonioSchema.safeParse({ ...base, texto: "ok" }).success).toBe(false);
  });
});
