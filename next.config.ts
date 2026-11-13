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
  serverExternalPackages: ["@react-pdf/renderer", "nodemailer"],
  images: {
    // Las fotos optimizadas quedan una semana en el caché del navegador (antes se pedían en cada visita).
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
  async headers() {
    // Fotos y videos de /public no tienen huella en el nombre: una semana en caché y, al vencer, se usa la
    // copia guardada mientras se revisa en segundo plano. Si se reemplaza un archivo, cambiarle el nombre.
    const cacheMedios = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }];
    return [
      { source: "/:path*", headers: CABECERAS_SEGURIDAD },
      ...["images", "reels", "videos"].map((carpeta) => ({
        source: `/${carpeta}/:path*`,
        headers: cacheMedios,
      })),
    ];
  },
};

export default nextConfig;
