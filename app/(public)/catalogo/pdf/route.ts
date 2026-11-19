import { obtenerPdf } from "@/lib/catalogoPdf/generar";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Catálogo completo armado con lo que hay en el panel (todas las fichas, una por una, con su foto).
// Las visitas solo lo VEN en /catalogo/ver (visor propio, sin botón de descargar): abrir esta dirección directamente
// en el navegador las lleva al visor. El equipo (con sesión del panel) sí puede abrirlo y guardarlo.
export async function GET(request: Request) {
  const esEquipo = (await requireAdmin()) === null;
  // Solo el visor de la página lo pide (fetch desde el mismo sitio); abrirlo como documento, en un marco o desde
  // otro sitio no entrega el archivo.
  const sitio = request.headers.get("sec-fetch-site");
  const destino = request.headers.get("sec-fetch-dest");
  const desdeElVisor = sitio === "same-origin" && destino === "empty";
  if (!esEquipo && !desdeElVisor) {
    return new Response(null, { status: 302, headers: { Location: "/catalogo/ver", "Cache-Control": "no-store" } });
  }
  const pdf = await obtenerPdf();
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Catalogo-Divertimania-2026.pdf"',
      "Cache-Control": "private, no-store",
    },
  });
}
