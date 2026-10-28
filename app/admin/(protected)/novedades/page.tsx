import { prisma } from "@/lib/db";
import NovedadesManager from "@/components/admin/NovedadesManager";
import Encabezado from "@/components/admin/Encabezado";

export const dynamic = "force-dynamic";

export default async function AdminNovedadesPage() {
  const novedades = await prisma.novedad.findMany({ orderBy: { orden: "asc" } });

  return (
    <div>
      <Encabezado
        grupo="Sitio"
        titulo="Novedades"
        descripcion="El aviso de temporada que aparece en la portada del Inicio (Halloween, Navidad, giras). Se activa y desactiva sin tocar código."
      />
      <NovedadesManager iniciales={novedades} />
    </div>
  );
}
