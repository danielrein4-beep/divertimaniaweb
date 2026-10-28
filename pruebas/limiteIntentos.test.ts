import { describe, expect, it } from "vitest";
import { ipDelVisitante, permitirIntento, reiniciarIntentos } from "@/lib/limiteIntentos";

const pedido = (cabeceras: Record<string, string>) => new Request("http://localhost/api/auth/login", { headers: cabeceras });

describe("tope de intentos", () => {
  it("deja pasar hasta el tope y bloquea el siguiente", () => {
    const clave = "login:prueba-tope";
    const resultados = Array.from({ length: 6 }, () => permitirIntento(clave, 5, 60_000));
    expect(resultados).toEqual([true, true, true, true, true, false]);
  });

  it("cada IP lleva su propia cuenta", () => {
    for (let i = 0; i < 5; i++) permitirIntento("login:ip-a", 5, 60_000);
    expect(permitirIntento("login:ip-a", 5, 60_000)).toBe(false);
    expect(permitirIntento("login:ip-b", 5, 60_000)).toBe(true);
  });

  it("después de entrar bien, la cuenta vuelve a cero", () => {
    const clave = "login:prueba-reinicio";
    for (let i = 0; i < 5; i++) permitirIntento(clave, 5, 60_000);
    reiniciarIntentos(clave);
    expect(permitirIntento(clave, 5, 60_000)).toBe(true);
  });

  it("al vencer la ventana se puede volver a intentar", () => {
    const clave = "login:prueba-ventana";
    expect(permitirIntento(clave, 1, -1)).toBe(true);
    expect(permitirIntento(clave, 1, 60_000)).toBe(true);
  });
});

describe("IP del visitante", () => {
  it("usa X-Real-Ip, que escribe el proxy del servidor", () => {
    expect(ipDelVisitante(pedido({ "x-real-ip": "200.1.1.1", "x-forwarded-for": "10.0.0.1" }))).toBe("200.1.1.1");
  });

  it("sin X-Real-Ip toma la última IP de X-Forwarded-For, no la primera que inventa el cliente", () => {
    expect(ipDelVisitante(pedido({ "x-forwarded-for": "1.2.3.4, 200.1.1.1" }))).toBe("200.1.1.1");
  });

  it("sin cabeceras no falla", () => {
    expect(ipDelVisitante(pedido({}))).toBe("desconocida");
  });
});
