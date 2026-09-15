import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { ESTADOS_EVENTO } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const fecha = request.nextUrl.searchParams.get("fecha") ?? undefined;

  const eventos = await prisma.evento.findMany({
    where: fecha ? { fecha } : undefined,
    include: {
      cliente: true,
      servicios: { include: { servicio: true } },
      recursos: { include: { recurso: true } },
    },
    orderBy: [{ fecha: "asc" }, { horaInicio: "asc" }],
  });

  return NextResponse.json({ eventos });
}

const eventoSchema = z.object({
  clienteNombre: z.string().trim().min(2),
  clienteTelefono: z.string().trim().min(6),
  clienteEmail: z.string().trim().email().optional().or(z.literal("")),
  fecha: z.string().trim().min(8),
  horaInicio: z.string().trim().min(4),
  horaFin: z.string().trim().min(4),
  tipo: z.string().trim().min(2),
  ubicacion: z.string().trim().optional().or(z.literal("")),
  estado: z.enum(ESTADOS_EVENTO).default("COTIZACION"),
  notas: z.string().trim().optional().or(z.literal("")),
  servicioIds: z.array(z.string()).default([]),
  recursos: z.array(z.object({ recursoId: z.string(), cantidadUsada: z.number().int().min(1) })).default([]),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = eventoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }

  const data = parsed.data;

  let cliente = await prisma.cliente.findFirst({ where: { telefono: data.clienteTelefono } });
  if (!cliente) {
    cliente = await prisma.cliente.create({
      data: { nombre: data.clienteNombre, telefono: data.clienteTelefono, email: data.clienteEmail || null },
    });
  }

  const evento = await prisma.evento.create({
    data: {
      fecha: data.fecha,
      horaInicio: data.horaInicio,
      horaFin: data.horaFin,
      tipo: data.tipo,
      ubicacion: data.ubicacion || null,
      estado: data.estado,
      notas: data.notas || null,
      clienteId: cliente.id,
      servicios: { create: data.servicioIds.map((servicioId) => ({ servicioId })) },
      recursos: { create: data.recursos.map((r) => ({ recursoId: r.recursoId, cantidadUsada: r.cantidadUsada })) },
    },
    include: { cliente: true, servicios: { include: { servicio: true } }, recursos: { include: { recurso: true } } },
  });

  return NextResponse.json({ evento }, { status: 201 });
}
