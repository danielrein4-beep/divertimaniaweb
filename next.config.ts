import type { NextConfig } from "next";

// Cabeceras de seguridad para todas las páginas: nadie puede meter el sitio (ni el panel) dentro de
// un iframe ajeno, el navegador no adivina tipos de archivo y no se anuncia la tecnología.
const CABECERAS_SEGURIDAD = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: CABECERAS_SEGURIDAD }];
  },
};

export default nextConfig;
