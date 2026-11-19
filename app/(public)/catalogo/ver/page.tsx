import type { Metadata } from "next";
import VisorCatalogo from "@/components/site/VisorCatalogo";

export const metadata: Metadata = {
  title: "Catálogo completo | Divertimania",
  description: "Mira el catálogo completo de Divertimania: todos los personajes y servicios, una ficha por una, con su foto.",
};

export default function VerCatalogoPage() {
  return <VisorCatalogo />;
}
