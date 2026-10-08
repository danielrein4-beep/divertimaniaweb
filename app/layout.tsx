import type { Metadata } from "next";
import { Baloo_2, Inter } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://divertimaniashow.com"),
  title: {
    default: "Divertimania | Tu fiesta armada en 2 minutos | Táchira",
    template: "%s | Divertimania Táchira",
  },
  description:
    "Shows en vivo, personajes, hora loca, baby showers y fiestas infantiles en San Cristóbal y todo el Estado Táchira, Venezuela. Cotiza tu fiesta por WhatsApp en 2 minutos.",
  keywords: [
    "Divertimania",
    "fiestas infantiles tachira",
    "animacion san cristobal",
    "personajes tachira",
    "baby shower san cristobal",
    "hora loca tachira",
    "shows en vivo venezuela",
  ],
  openGraph: {
    title: "Divertimania | Tu fiesta armada en 2 minutos",
    description:
      "Shows en vivo, personajes, hora loca y fiestas infantiles en todo el Estado Táchira.",
    url: "https://divertimaniashow.com",
    siteName: "Divertimania Show",
    images: [
      {
        url: "/images/rapunzel-cumpleanos.png",
        width: 1200,
        height: 630,
        alt: "Divertimania - Animación de eventos en Táchira",
      },
    ],
    locale: "es_VE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Divertimania | Tu fiesta armada en 2 minutos",
    description:
      "Shows en vivo, personajes y animación de eventos en el Estado Táchira.",
    images: ["/images/rapunzel-cumpleanos.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${baloo.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-radial-glow">{children}</body>
    </html>
  );
}
