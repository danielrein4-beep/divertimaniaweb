import type { NextConfig } from "next";

// Cabeceras de seguridad para todas las páginas: ningún sitio ajeno puede meter este (ni el panel) dentro de
// un iframe (el propio sí, para la vista previa del PDF), el navegador no adivina tipos de archivo y no
// se anuncia la tecnología.
const CABECERAS_SEGURIDAD = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // El PDF del catálogo se arma en el servidor con react-pdf; va fuera del empaquetado.
  serverExternalPackages: ["@react-pdf/renderer"],
  async headers() {
    return [{ source: "/:path*", headers: CABECERAS_SEGURIDAD }];
  },
};

export default nextConfig;
