// Testimonios de clientes: los cargan los dueños en el panel (con permiso de quien opina).
import { z } from "zod";
import { prisma } from "@/lib/db";
import { rutaLocalSchema } from "@/lib/validation";

export const testimonioSchema = z.object({
  nombre: z.string().trim().min(2, "Escribe el nombre").max(80),
  evento: z.string().trim().min(2, "Escribe qué celebró").max(100),
  ciudad: z.string().trim().max(60).nullable().optional().or(z.literal("")),
  texto: z.string().trim().min(10, "El testimonio es muy corto").max(600),
  fotoUrl: rutaLocalSchema.nullable().optional().or(z.literal("")),
  orden: z.number().int().default(0),
  activo: z.boolean().default(true),
});

/** Los que se muestran en el sitio, en el orden del panel. */
export function testimoniosVisibles(limite = 6) {
  return prisma.testimonio.findMany({ where: { activo: true }, orderBy: [{ orden: "asc" }, { createdAt: "desc" }], take: limite });
}
