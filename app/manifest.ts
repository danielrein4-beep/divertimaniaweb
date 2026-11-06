import type { MetadataRoute } from "next";

/** Permite «Agregar a pantalla de inicio» en el teléfono con nombre, ícono y colores de la marca. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Divertimania",
    short_name: "Divertimania",
    description: "Personajes, shows y animación para fiestas en toda Venezuela.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0b",
    theme_color: "#0b0b0b",
    lang: "es-VE",
    icons: [{ src: "/logo-square.png", sizes: "512x512", type: "image/png" }],
  };
}
