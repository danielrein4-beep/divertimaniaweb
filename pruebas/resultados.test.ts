import { describe, expect, it } from "vitest";
import { contarPersonas, resumenReservas } from "@/lib/resultados";

describe("fiestas por la web", () => {
  it("cuenta cada paso y suma solo el dinero de las confirmadas", () => {
    const r = resumenReservas([
      { estado: "SOLICITADA", montoTotal: null, montoAnticipo: null },
      { estado: "ESPERANDO_PAGO", montoTotal: 300, montoAnticipo: 150 },
      { estado: "CONFIRMADA", montoTotal: 400, montoAnticipo: 200 },
      { estado: "CONFIRMADA", montoTotal: 250, montoAnticipo: null },
      { estado: "RECHAZADA", montoTotal: 500, montoAnticipo: 250 },
    ]);
    expect(r).toMatchObject({ apartadas: 5, porCotizar: 1, esperandoAnticipo: 1, confirmadas: 2, noRealizadas: 1 });
    expect(r.vendidoConfirmado).toBe(650);
    expect(r.anticiposConfirmados).toBe(200);
  });
});

describe("servicios más vistos", () => {
  it("una persona que abre el mismo servicio varias veces cuenta una sola vez", () => {
    const d = new Date();
    const filas = contarPersonas(
      [
        { visitante: "a", createdAt: d, pagina: "/catalogo/1" },
        { visitante: "a", createdAt: d, pagina: "/catalogo/1" },
        { visitante: "b", createdAt: d, pagina: "/catalogo/1" },
        { visitante: "a", createdAt: d, pagina: "/catalogo/2" },
      ],
      (m) => m.pagina
    );
    expect(filas).toEqual([["/catalogo/1", 2], ["/catalogo/2", 1]]);
  });
});
