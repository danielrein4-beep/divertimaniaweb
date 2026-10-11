import AjustesForm from "@/components/admin/AjustesForm";
import CambiarClave from "@/components/admin/CambiarClave";
import { getConfigSitio } from "@/lib/configSitio";

export const dynamic = "force-dynamic";

export default async function AjustesPage() {
  const config = await getConfigSitio();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Ajustes del sitio</h1>
        <p className="mt-1 text-sm text-muted">Los cambios se ven en el sitio público apenas guardas.</p>
      </div>
      <AjustesForm initialWhatsapp={config.whatsapp} />
      <CambiarClave />
    </div>
  );
}
