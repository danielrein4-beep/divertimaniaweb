import { INSTAGRAM_URL } from "@/lib/site";
import { SITE_URL } from "@/lib/negocio";

/** Ficha del negocio para Google (schema.org): nombre, teléfono, zona y redes. */
export default function DatosNegocio({ whatsapp }: { whatsapp: string }) {
  const datos = {
    "@context": "https://schema.org",
    "@type": "EntertainmentBusiness",
    name: "Divertimania",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-square.png`,
    image: `${SITE_URL}/og.jpg`,
    telephone: `+${whatsapp}`,
    address: { "@type": "PostalAddress", addressLocality: "San Cristóbal", addressRegion: "Táchira", addressCountry: "VE" },
    areaServed: { "@type": "Country", name: "Venezuela" },
    sameAs: [INSTAGRAM_URL],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datos) }} />;
}
