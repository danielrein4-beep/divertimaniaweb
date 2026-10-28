// Pruebas contra una base SQLite temporal (ver pruebas/preparar-base.ts).
import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import { detectarConflictos } from "@/lib/conflicts";
import { armarCatalogo, leerFilas } from "@/lib/catalogoPdf/datos";

async function vaciar() {
  await prisma.eventoRecurso.deleteMany();
  await prisma.eventoServicio.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.recurso.deleteMany();
  await prisma.servicio.deleteMany();
  await prisma.categoria.deleteMany();
}

beforeEach(vaciar);

describe("cruces de inventario entre eventos", () => {
  async function eventoCon(recursoId: string, cantidad: number, horaInicio: string, horaFin: string, estado = "CONFIRMADO") {
    const cliente = await prisma.cliente.create({ data: { nombre: "Cliente", telefono: "04140000000" } });
    return prisma.evento.create({
      data: {
        clienteId: cliente.id,
        fecha: "2099-06-01",
        horaInicio,
        horaFin,
        tipo: "Cumpleaños",
        estado,
        recursos: { create: [{ recursoId, cantidadUsada: cantidad }] },
      },
    });
  }

  it("avisa si dos eventos a la misma hora piden más de lo que hay", async () => {
    const cañon = await prisma.recurso.create({ data: { nombre: "Cañón de espuma", tipo: "EQUIPO", cantidadTotal: 1 } });
    await eventoCon(cañon.id, 1, "14:00", "17:00");
    const conflictos = await detectarConflictos(null, "2099-06-01", "16:00", "18:00", [{ recursoId: cañon.id, cantidadUsada: 1 }]);
    expect(conflictos).toHaveLength(1);
    expect(conflictos[0]).toMatchObject({ recursoNombre: "Cañón de espuma", cantidadTotal: 1, cantidadAsignada: 2 });
  });

  it("no avisa si los horarios no se tocan", async () => {
    const cañon = await prisma.recurso.create({ data: { nombre: "Cañón de espuma", tipo: "EQUIPO", cantidadTotal: 1 } });
    await eventoCon(cañon.id, 1, "10:00", "12:00");
    expect(await detectarConflictos(null, "2099-06-01", "12:00", "14:00", [{ recursoId: cañon.id, cantidadUsada: 1 }])).toEqual([]);
  });

  it("no cuenta los eventos cancelados ni al mismo evento que se está editando", async () => {
    const animadores = await prisma.recurso.create({ data: { nombre: "Animador", tipo: "PERSONAL", cantidadTotal: 2 } });
    await eventoCon(animadores.id, 2, "14:00", "17:00", "CANCELADO");
    const propio = await eventoCon(animadores.id, 2, "14:00", "17:00");
    expect(await detectarConflictos(propio.id, "2099-06-01", "14:00", "17:00", [{ recursoId: animadores.id, cantidadUsada: 2 }])).toEqual([]);
  });

  it("alcanza si la suma no pasa del total", async () => {
    const animadores = await prisma.recurso.create({ data: { nombre: "Animador", tipo: "PERSONAL", cantidadTotal: 3 } });
    await eventoCon(animadores.id, 2, "14:00", "17:00");
    expect(await detectarConflictos(null, "2099-06-01", "15:00", "16:00", [{ recursoId: animadores.id, cantidadUsada: 1 }])).toEqual([]);
  });
});

describe("catálogo PDF", () => {
  async function servicio(nombre: string, categoria: string, orden: number, extra: { activo?: boolean; enPdf?: boolean } = {}) {
    return prisma.servicio.create({ data: { nombre, categoria, descripcion: "", orden, ...extra } });
  }

  it("sigue el orden del panel y deja fuera lo oculto o marcado «no en el PDF»", async () => {
    await prisma.categoria.createMany({
      data: [
        { nombre: "Personajes", color: "#00e5ff", orden: 0 },
        { nombre: "Shows", color: "#ffd166", orden: 1 },
        { nombre: "Vacía", color: "#ff5a5f", orden: 2 },
      ],
    });
    await servicio("Show LED", "Shows", 0);
    await servicio("Bluey", "Personajes", 1);
    await servicio("Mickey", "Personajes", 0);
    await servicio("Oculto", "Personajes", 2, { activo: false });
    await servicio("Solo web", "Shows", 1, { enPdf: false });

    const catalogo = await armarCatalogo(await leerFilas());
    expect(catalogo.secciones.map((s) => [s.nombre, s.color, s.servicios.map((x) => x.nombre)])).toEqual([
      ["Personajes", "#00e5ff", ["Mickey", "Bluey"]],
      ["Shows", "#ffd166", ["Show LED"]],
    ]);
  });

  it("trae el QR de WhatsApp y el logo listos para el PDF", async () => {
    const catalogo = await armarCatalogo(await leerFilas());
    expect(catalogo.whatsappTexto).toMatch(/^\+58 \d{3}-\d{3}-\d{4}$/);
    expect(catalogo.whatsappQr.subarray(1, 4).toString()).toBe("PNG");
    expect(catalogo.logo.length).toBeGreaterThan(1000);
  });
});
