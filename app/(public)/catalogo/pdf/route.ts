import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { armarCatalogo, leerFilas } from "@/lib/catalogoPdf/datos";
import DocumentoCatalogo from "@/lib/catalogoPdf/Documento";
import { SITE_URL } from "@/lib/negocio";

export const dynamic = "force-dynamic";

// El PDF se arma de nuevo solo cuando cambia algo del catálogo en el panel; si no, se reusa.
let guardado: { clave: string; pdf: Buffer } | null = null;
let armando: Promise<Buffer> | null = null;

export async function GET(request: Request) {
  const filas = await leerFilas();
  const clave = createHash("sha1").update(JSON.stringify(filas)).digest("hex");

  if (guardado?.clave !== clave) {
    armando ??= (async () => {
      const datos = await armarCatalogo(filas);
      return renderToBuffer(createElement(DocumentoCatalogo, { datos, sitio: SITE_URL }) as Parameters<typeof renderToBuffer>[0]);
    })().finally(() => (armando = null));
    guardado = { clave, pdf: await armando };
  }

  const descargar = new URL(request.url).searchParams.has("descargar");
  return new Response(new Uint8Array(guardado.pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${descargar ? "attachment" : "inline"}; filename="Catalogo-Divertimania.pdf"`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
