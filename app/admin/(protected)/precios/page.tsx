import { prisma } from "@/lib/db";
import Encabezado from "@/components/admin/Encabezado";
import PreciosYCifras from "@/components/admin/PreciosYCifras";
import { FIESTAS } from "@/lib/fiestas";
import { getOcasion } from "@/lib/ocasiones";
import { leerCifras, leerPrecios } from "@/lib/confianza";

export const dynamic = "force-dynamic";

export default async function PreciosPage() {
  const config = await prisma.configuracionSitio.findUnique({ where: { id: "principal" }, select: { cifras: true, preciosPaquetes: true } });
  const fiestas = FIESTAS.map((f) => ({ ruta: f.ruta, nombre: getOcasion(f.ocasion)?.nombre ?? f.ruta, paquetes: f.paquetes.map((p) => p.nombre) }));
  return (
    <div>
      <Encabezado
        grupo="Sitio"
        titulo="Precios y cifras"
        descripcion="Lo que da confianza a quien visita: cuántas fiestas han hecho y desde cuánto cuesta cada paquete de las páginas de celebración."
      />
      <PreciosYCifras fiestas={fiestas} cifrasIniciales={leerCifras(config?.cifras)} preciosIniciales={leerPrecios(config?.preciosPaquetes)} />
    </div>
  );
}
