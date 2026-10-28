import { describe, expect, it } from "vitest";
import { buildWhatsAppLink, esTelefonoValido, formatTelefono, normalizarTelefono } from "@/lib/telefono";
import { buildMensajeCotizacion, FORM_VACIO, primerCampoFaltante, type EventoFormData } from "@/lib/miFiesta";
import { alternarEnLista, leerLista } from "@/components/admin/servicio/lista";

describe("número de WhatsApp", () => {
  it("convierte el formato local venezolano al internacional", () => {
    expect(normalizarTelefono("0414-728.6881")).toBe("584147286881");
    expect(normalizarTelefono("+58 414 728 6881")).toBe("584147286881");
  });

  it("valida y muestra el número", () => {
    expect(esTelefonoValido("584147286881")).toBe(true);
    expect(esTelefonoValido("0414")).toBe(false);
    expect(formatTelefono("584147286881")).toBe("+58 414-728-6881");
    expect(formatTelefono("573001234567")).toBe("+573001234567");
  });

  it("arma el enlace con el mensaje codificado", () => {
    expect(buildWhatsAppLink("584147286881", "Hola & chao")).toBe("https://wa.me/584147286881?text=Hola%20%26%20chao");
  });
});

describe("cotización por WhatsApp («Mi fiesta»)", () => {
  const form: EventoFormData = {
    ...FORM_VACIO,
    nombre: "Ana",
    tipoEvento: "Cumpleaños",
    fecha: "2099-05-10",
    horaInicio: "15:30",
    zona: "San Cristóbal",
    lugar: "Salón de fiestas",
    invitados: "30 a 50",
    cumpleaneroNombre: "Sofía",
    cumpleaneroEdad: "6",
  };

  it("pide el primer dato que falta, en orden", () => {
    expect(primerCampoFaltante({ ...form, nombre: " " }, "2026-01-01")).toBe("Escribe tu nombre");
    expect(primerCampoFaltante({ ...form, zona: "" }, "2026-01-01")).toBe("Indica el municipio o zona");
    expect(primerCampoFaltante(form, "2026-01-01")).toBeNull();
  });

  it("no acepta una fecha que ya pasó", () => {
    expect(primerCampoFaltante({ ...form, fecha: "2020-01-01" }, "2026-01-01")).toBe("La fecha ya pasó, elige otra");
  });

  it("el mensaje lleva servicios, variantes, datos del evento y el nombre", () => {
    const mensaje = buildMensajeCotizacion(
      [{ id: "1", servicioId: "s1", nombre: "Princesas Disney", categoria: "Personajes", variante: "Rapunzel con el príncipe" }],
      form
    );
    expect(mensaje).toContain("• Princesas Disney – Rapunzel con el príncipe");
    expect(mensaje).toContain("• Fecha: domingo 10/05/2099 – 3:30 pm");
    expect(mensaje).toContain("• Cumpleañero: Sofía, 6 años");
    expect(mensaje).toContain("Mi nombre es Ana.");
  });

  it("sin servicios elegidos pide recomendaciones", () => {
    expect(buildMensajeCotizacion([], form)).toContain("• Aún no sé, quiero recomendaciones");
  });
});

describe("listas separadas por comas del editor de servicio", () => {
  it("agrega y quita elementos", () => {
    expect(alternarEnLista(null, "boda")).toBe("boda");
    expect(alternarEnLista("boda,quince", "boda")).toBe("quince");
    expect(alternarEnLista("boda", "boda")).toBeNull();
    expect(leerLista(" boda , quince ,")).toEqual(["boda", "quince"]);
  });
});
