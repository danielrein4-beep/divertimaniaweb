// Estados de una reserva, cómo se llaman para el cliente y para el equipo, y los datos que se piden.
import { randomBytes, randomInt } from "node:crypto";
import { z } from "zod";

export const ESTADOS_RESERVA = ["SOLICITADA", "ESPERANDO_PAGO", "PAGO_REPORTADO", "CONFIRMADA", "RECHAZADA"] as const;
export type EstadoReserva = (typeof ESTADOS_RESERVA)[number];

/** Estados en los que la fecha cuenta como ocupada aunque todavía no haya evento. */
export const ESTADOS_ABIERTOS: EstadoReserva[] = ["SOLICITADA", "ESPERANDO_PAGO", "PAGO_REPORTADO"];

export const ESTADO_RESERVA_LABEL: Record<EstadoReserva, string> = {
  SOLICITADA: "Por cotizar",
  ESPERANDO_PAGO: "Esperando anticipo",
  PAGO_REPORTADO: "Pago por revisar",
  CONFIRMADA: "Confirmada",
  RECHAZADA: "No realizada",
};

/** Lo que ve el cliente en su enlace, paso por paso. */
export const PASOS_CLIENTE = [
  { estado: "SOLICITADA", titulo: "Solicitud recibida", texto: "Revisamos tu fecha y te enviamos la cotización con el monto del anticipo." },
  { estado: "ESPERANDO_PAGO", titulo: "Anticipo", texto: "Paga el anticipo y sube el comprobante aquí mismo." },
  { estado: "PAGO_REPORTADO", titulo: "Pago en revisión", texto: "Estamos verificando tu pago; te avisamos apenas quede confirmado." },
  { estado: "CONFIRMADA", titulo: "¡Fecha confirmada!", texto: "Tu fiesta está en nuestro calendario. Te escribimos días antes para los detalles." },
] as const;

/** DV-4821: corto para dictarlo por teléfono o WhatsApp. */
export const generarCodigo = () => `DV-${randomInt(1000, 10000)}`;
/** Enlace privado del cliente: imposible de adivinar. */
export const generarToken = () => randomBytes(18).toString("base64url");

export const servicioReservaSchema = z.object({
  servicioId: z.string().max(40),
  nombre: z.string().max(120),
  variante: z.string().max(120).nullable().optional(),
});

export const nuevaReservaSchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Elige una fecha"),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal("")),
  tipoEvento: z.string().trim().min(2, "Elige el tipo de evento").max(60),
  zona: z.string().trim().min(2, "Indica la ciudad o zona").max(120),
  lugar: z.string().trim().max(120).optional().or(z.literal("")),
  invitados: z.string().trim().max(40).optional().or(z.literal("")),
  nombre: z.string().trim().min(2, "Escribe tu nombre").max(120),
  telefono: z.string().trim().min(7, "Escribe un teléfono válido").max(30),
  email: z.string().trim().email("Correo inválido").optional().or(z.literal("")),
  comentarios: z.string().trim().max(1500).optional().or(z.literal("")),
  servicios: z.array(servicioReservaSchema).max(30).optional(),
});

export type NuevaReserva = z.infer<typeof nuevaReservaSchema>;
export type ServicioReserva = z.infer<typeof servicioReservaSchema>;

/** Los servicios guardados como JSON; si el texto está dañado, lista vacía. */
export function leerServicios(json: string | null): ServicioReserva[] {
  if (!json) return [];
  try {
    const datos = z.array(servicioReservaSchema).safeParse(JSON.parse(json));
    return datos.success ? datos.data : [];
  } catch {
    return [];
  }
}
