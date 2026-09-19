import { prisma } from "@/lib/db";
import NovedadesManager from "@/components/admin/NovedadesManager";

export default async function AdminNovedadesPage() {
  const novedades = await prisma.novedad.findMany({ orderBy: { orden: "asc" } });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Panel de novedades</h1>
      <p className="mb-6 text-sm text-muted">
        Lo que actives aquí aparece unos segundos en la animación del hero del home, antes de
        que se revele el título. Actívalo/desactívalo cuando cambie la temporada (Halloween,
        Navidad, giras, etc.) sin necesidad de tocar código.
      </p>
      <NovedadesManager initialNovedades={novedades} />
    </div>
  );
}
