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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const TITULO = "Divertimania | Personajes, shows y animación en el Táchira";
const DESCRIPCION =
  "Arma tu fiesta en 2 minutos: personajes, shows, animación infantil, baby showers, 15 años y bodas. Te cotizamos por WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITULO,
  description: DESCRIPCION,
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    siteName: "Divertimania",
    locale: "es_VE",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Divertimania: arma tu fiesta en 2 minutos" }],
  },
  twitter: { card: "summary_large_image", title: TITULO, description: DESCRIPCION, images: ["/og.jpg"] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${baloo.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-radial-glow">{children}</body>
    </html>
  );
}
