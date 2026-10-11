import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import WhatsAppButton from "@/components/site/WhatsAppButton";
import PublicProviders from "@/components/mifiesta/PublicProviders";
import { getConfigSitio } from "@/lib/configSitio";

// Lee los ajustes del sitio (número de WhatsApp) en cada request para reflejar los cambios del admin.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const config = await getConfigSitio();
  return (
    <PublicProviders config={config}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </PublicProviders>
  );
}
