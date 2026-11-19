import type { PrismaClient } from "@prisma/client";

// Tarjetas que se quitaron del sitio (siguen guardadas, ocultas). Se pueden volver a mostrar
// desde el panel o quitándolas de esta lista y poniendo activo = 1.
export const TARJETAS_OCULTAS = ["Trampolines", "Monsters Inc.", "El Payaso", "Show LED", "Show según temática", "Robots", "Conejo de Pascua"];

export async function ocultarTarjetas(prisma: PrismaClient) {
  const r = await prisma.servicio.updateMany({ where: { nombre: { in: TARJETAS_OCULTAS } }, data: { activo: false } });
  return r.count;
}
