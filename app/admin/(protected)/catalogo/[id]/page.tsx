import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCategorias } from "@/lib/categorias";
import OpcionesManager from "@/components/admin/OpcionesManager";
import ServicioEditor from "@/components/admin/ServicioEditor";
import { type TipoOpcion, type TipoServicioMedia } from "@/lib/validation";

export const dynamic = "force-dynamic";

export default async function AdminServicioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [servicio, categorias, otros] = await Promise.all([
    prisma.servicio.findUnique({
      where: { id },
      include: {
        opciones: { orderBy: { orden: "asc" } },
        media: { orderBy: { orden: "asc" } },
      },
    }),
    getCategorias(),
    prisma.servicio.findMany({
      where: { id: { not: id } },
      orderBy: [{ categoria: "asc" }, { orden: "asc" }],
      select: { id: true, nombre: true, categoria: true },
    }),
  ]);

  if (!servicio) notFound();
  const { opciones, media, ...campos } = servicio;

  return (
    <div className="mx-auto max-w-6xl">
      <ServicioEditor
        servicio={campos}
        categorias={categorias.map((c) => c.nombre)}
        otros={otros}
        media={media.map((m) => ({ ...m, tipo: m.tipo as TipoServicioMedia }))}
        extra={
          <section className="card-glass flex flex-col gap-4 rounded-2xl p-5">
            <div>
              <h2 className="text-lg font-bold">Variantes y dinámicas</h2>
              <p className="mt-0.5 text-sm text-muted">
                Opciones que el cliente elige al cotizar: por ejemplo “Rapunzel sola” o “con el príncipe”, o los juegos de
                un baby shower. Se guardan al momento.
              </p>
            </div>
            <OpcionesManager
              servicioId={servicio.id}
              initialOpciones={opciones.map((o) => ({ ...o, tipo: o.tipo as TipoOpcion }))}
            />
          </section>
        }
      />
    </div>
  );
}
