import AjustesForm from "@/components/admin/AjustesForm";
import CambiarClave from "@/components/admin/CambiarClave";
import Encabezado from "@/components/admin/Encabezado";
import { getConfigSitio } from "@/lib/configSitio";

export const dynamic = "force-dynamic";

export default async function AjustesPage() {
  const config = await getConfigSitio();

  return (
    <div>
      <Encabezado grupo="Sitio" titulo="Ajustes" descripcion="Datos de contacto del sitio y acceso al panel. Los cambios se ven apenas guardas." />
      <div className="flex max-w-2xl flex-col gap-6">
        <AjustesForm whatsappInicial={config.whatsapp} />
        <CambiarClave />
      </div>
    </div>
  );
}
