import type { Metadata } from "next";
import VisorCatalogo from "@/components/site/VisorCatalogo";
import { obtenerPdf } from "@/lib/catalogoPdf/generar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo completo | Divertimania",
  description: "Mira el catálogo completo de Divertimania: todos los personajes y servicios, una ficha por una, con su foto.",
};

export default function VerCatalogoPage() {
  // Se empieza a armar el catálogo mientras la página carga (la primera vez tarda unos segundos), sin esperar.
  void obtenerPdf().catch(() => {});
  return <VisorCatalogo />;
}
