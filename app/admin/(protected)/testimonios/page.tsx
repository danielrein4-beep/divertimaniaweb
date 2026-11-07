import { prisma } from "@/lib/db";
import Encabezado from "@/components/admin/Encabezado";
import TestimoniosManager from "@/components/admin/TestimoniosManager";

export const dynamic = "force-dynamic";

export default async function TestimoniosPage() {
  const testimonios = await prisma.testimonio.findMany({ orderBy: [{ orden: "asc" }, { createdAt: "desc" }] });
  return (
    <div>
      <Encabezado
        grupo="Sitio"
        titulo="Testimonios"
        descripcion="Lo que dicen sus clientes. Aparece en el Inicio y en cada página de celebración; ocultar uno no lo borra."
      />
      <TestimoniosManager iniciales={testimonios} />
    </div>
  );
}
