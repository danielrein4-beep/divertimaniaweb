import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { ESTADOS_EVENTO } from "@/lib/validation";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const evento = await prisma.evento.findUnique({
    where: { id },
    include: {
      cliente: true,
      servicios: { include: { servicio: true } },
      recursos: { include: { recurso: true } },
    },
  });

  if (!evento) return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
  return NextResponse.json({ evento });
}

const updateSchema = z.object({
  clienteNombre: z.string().trim().min(2),
  clienteTelefono: z.string().trim().min(6),
  clienteEmail: z.string().trim().email().optional().or(z.literal("")),
  fecha: z.string().trim().min(8),
  horaInicio: z.string().trim().min(4),
  horaFin: z.string().trim().min(4),
  tipo: z.string().trim().min(2),
  ubicacion: z.string().trim().optional().or(z.literal("")),
  estado: z.enum(ESTADOS_EVENTO),
  notas: z.string().trim().optional().or(z.literal("")),
  servicioIds: z.array(z.string()).default([]),
  recursos: z.array(z.object({ recursoId: z.string(), cantidadUsada: z.number().int().min(1) })).default([]),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }
  const data = parsed.data;

  const existing = await prisma.evento.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });

  await prisma.cliente.update({
    where: { id: existing.clienteId },
    data: { nombre: data.clienteNombre, telefono: data.clienteTelefono, email: data.clienteEmail || null },
  });

  await prisma.eventoServicio.deleteMany({ where: { eventoId: id } });
  await prisma.eventoRecurso.deleteMany({ where: { eventoId: id } });

  const evento = await prisma.evento.update({
    where: { id },
    data: {
      fecha: data.fecha,
      horaInicio: data.horaInicio,
      horaFin: data.horaFin,
      tipo: data.tipo,
      ubicacion: data.ubicacion || null,
      estado: data.estado,
      notas: data.notas || null,
      servicios: { create: data.servicioIds.map((servicioId) => ({ servicioId })) },
      recursos: { create: data.recursos.map((r) => ({ recursoId: r.recursoId, cantidadUsada: r.cantidadUsada })) },
    },
    include: { cliente: true, servicios: { include: { servicio: true } }, recursos: { include: { recurso: true } } },
  });

  return NextResponse.json({ evento });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.evento.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
