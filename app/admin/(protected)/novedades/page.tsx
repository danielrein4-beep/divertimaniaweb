import { prisma } from "@/lib/db";
import NovedadesManager from "@/components/admin/NovedadesManager";
import Encabezado from "@/components/admin/Encabezado";

export const dynamic = "force-dynamic";

export default async function AdminNovedadesPage() {
  const [novedades, fichas] = await Promise.all([
    prisma.novedad.findMany({ orderBy: { orden: "asc" } }),
    prisma.servicio.findMany({ where: { activo: true }, orderBy: { orden: "asc" }, select: { id: true, nombre: true } }),
  ]);

  return (
    <div>
      <Encabezado
        grupo="Sitio"
        titulo="Novedades"
        descripcion="Las novedades de temporada que rotan en la portada del Inicio (Halloween, Navidad, Carnaval…). Eliges la foto, el texto, a dónde lleva el botón y entre qué fechas se muestra; entra y sale sola."
      />
      <NovedadesManager iniciales={novedades.map((n) => ({ ...n, fechaInicio: n.fechaInicio?.toISOString() ?? null, fechaFin: n.fechaFin?.toISOString() ?? null }))} fichas={fichas} />
    </div>
  );
}
