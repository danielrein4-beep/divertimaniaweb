// Reservas contra la SQLite temporal (ver pruebas/preparar-base.ts).
import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import { clasificar, disponibilidad } from "@/lib/reservas/disponibilidad";
import { confirmarReserva, sumarHoras } from "@/lib/reservas/confirmar";
import { generarCodigo, generarToken, leerServicios } from "@/lib/reservas/estados";
import { mensajeAnticipo } from "@/lib/reservas/avisos";

const FECHA = "2099-07-15";

async function reserva(datos: Partial<{ estado: string; fecha: string; servicios: string; horaInicio: string }> = {}) {
  return prisma.reserva.create({
    data: {
      codigo: generarCodigo() + Math.random().toString(36).slice(2, 5),
      token: generarToken(),
      fecha: FECHA,
      tipoEvento: "Cumpleaños",
      zona: "San Cristóbal",
      nombre: "Ana Pérez",
      telefono: "0414-728-6881",
      ...datos,
    },
  });
}

beforeEach(async () => {
  await prisma.reserva.deleteMany();
  await prisma.eventoServicio.deleteMany();
  await prisma.eventoRecurso.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.servicio.deleteMany();
  await prisma.configuracionSitio.upsert({ where: { id: "principal" }, update: { eventosPorDia: 2 }, create: { id: "principal", whatsapp: "584147286881", eventosPorDia: 2 } });
});

describe("disponibilidad de una fecha", () => {
  it("libre, con un cupo o completa según el tope diario", () => {
    expect(clasificar(0, 3)).toBe("libre");
    expect(clasificar(2, 3)).toBe("pocas");
    expect(clasificar(3, 3)).toBe("completa");
  });

  it("cuenta reservas en curso y eventos, no las rechazadas", async () => {
    await reserva();
    await reserva({ estado: "RECHAZADA" });
    expect(await disponibilidad(FECHA)).toMatchObject({ estado: "pocas", ocupadas: 1, tope: 2 });
    await reserva({ estado: "PAGO_REPORTADO" });
    expect((await disponibilidad(FECHA)).estado).toBe("completa");
  });

  it("una fecha pasada no se puede apartar", async () => {
    expect((await disponibilidad("2000-01-01")).estado).toBe("pasada");
  });
});

describe("confirmar una reserva", () => {
  it("crea el cliente y el evento en el calendario con los servicios que existen", async () => {
    const show = await prisma.servicio.create({ data: { nombre: "Show LED", categoria: "Shows", descripcion: "" } });
    const r = await reserva({
      horaInicio: "16:00",
      servicios: JSON.stringify([
        { servicioId: show.id, nombre: "Show LED", variante: "Astronautas" },
        { servicioId: "borrado", nombre: "Servicio que ya no existe" },
      ]),
    });
    const confirmada = await confirmarReserva(r.id);
    expect(confirmada.estado).toBe("CONFIRMADA");

    const evento = await prisma.evento.findUnique({ where: { id: confirmada.eventoId! }, include: { cliente: true, servicios: true } });
    expect(evento).toMatchObject({ fecha: FECHA, horaInicio: "16:00", horaFin: "19:00", estado: "CONFIRMADO", tipo: "Cumpleaños" });
    expect(evento?.cliente.nombre).toBe("Ana Pérez");
    expect(evento?.servicios.map((s) => s.servicioId)).toEqual([show.id]);
    expect(evento?.notas).toContain("Show LED: Astronautas");
  });

  it("confirmar dos veces no duplica el evento", async () => {
    const r = await reserva();
    await confirmarReserva(r.id);
    await confirmarReserva(r.id);
    expect(await prisma.evento.count()).toBe(1);
  });

  it("una reserva marcada como no realizada no se confirma", async () => {
    const r = await reserva({ estado: "RECHAZADA" });
    await expect(confirmarReserva(r.id)).rejects.toThrow();
  });
});

describe("piezas sueltas", () => {
  it("suma horas sin pasar de las 23", () => {
    expect(sumarHoras("15:00", 3)).toBe("18:00");
    expect(sumarHoras("22:30", 3)).toBe("23:30");
  });

  it("los servicios guardados dañados se leen como lista vacía", () => {
    expect(leerServicios("{no es json")).toEqual([]);
    expect(leerServicios(null)).toEqual([]);
  });

  it("el WhatsApp del anticipo lleva el monto y el enlace privado", () => {
    const m = mensajeAnticipo({
      id: "x", codigo: "DV-1234", token: "abc", fecha: FECHA, horaInicio: null, tipoEvento: "Cumpleaños",
      zona: "San Cristóbal", nombre: "Ana", telefono: "0414-728-6881", email: null, servicios: null, montoAnticipo: 50,
    });
    expect(m.numero).toBe("584147286881");
    expect(m.texto).toContain("US$ 50");
    expect(m.texto).toContain("/reserva/abc");
    expect(m.texto).toContain("DV-1234");
  });
});
