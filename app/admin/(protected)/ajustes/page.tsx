import AjustesForm from "@/components/admin/AjustesForm";
import CambiarClave from "@/components/admin/CambiarClave";
import Encabezado from "@/components/admin/Encabezado";
import EstadoAvisoCorreo from "@/components/admin/EstadoAvisoCorreo";
import { getConfigSitio } from "@/lib/configSitio";
import { prisma } from "@/lib/db";
import AjustesReservas from "@/components/admin/AjustesReservas";
import { leerCuentas } from "@/lib/cuentasPago";

export const dynamic = "force-dynamic";

export default async function AjustesPage() {
  const [config, reservas] = await Promise.all([
    getConfigSitio(),
    prisma.configuracionSitio.findUnique({ where: { id: "principal" }, select: { datosPago: true, eventosPorDia: true } }),
  ]);
  const cuentas = leerCuentas(reservas?.datosPago);

  return (
    <div>
      <Encabezado grupo="Sitio" titulo="Ajustes" descripcion="Datos de contacto del sitio y acceso al panel. Los cambios se ven apenas guardas." />
      <div className="flex max-w-2xl flex-col gap-6">
        <AjustesForm whatsappInicial={config.whatsapp} />
        <AjustesReservas cuentasIniciales={cuentas.cuentas} textoAnterior={cuentas.textoLibre} eventosPorDiaInicial={reservas?.eventosPorDia ?? 3} />
        <EstadoAvisoCorreo />
        <CambiarClave />
      </div>
    </div>
  );
}
