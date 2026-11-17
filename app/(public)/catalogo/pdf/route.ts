import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { armarCatalogo, leerFilas } from "@/lib/catalogoPdf/datos";
import DocumentoCatalogo from "@/lib/catalogoPdf/Documento";
import { SITE_URL } from "@/lib/negocio";

export const dynamic = "force-dynamic";

// Catálogo diseñado (estilo póster, 2026) que escogieron los dueños. Si el archivo no está,
// se arma el PDF automático con lo que hay en el panel, como antes.
const CATALOGO_DISENADO = path.join(process.cwd(), "public", "pdf", "catalogo-divertimania-2026.pdf");

let disenado: Buffer | null | undefined;
let guardado: { clave: string; pdf: Buffer } | null = null;
let armando: Promise<Buffer> | null = null;

async function leerDisenado(): Promise<Buffer | null> {
  if (disenado === undefined) disenado = await readFile(CATALOGO_DISENADO).catch(() => null);
  return disenado;
}

async function pdfAutomatico(): Promise<Buffer> {
  const filas = await leerFilas();
  const clave = createHash("sha1").update(JSON.stringify(filas)).digest("hex");
  if (guardado?.clave !== clave) {
    armando ??= (async () => {
      const datos = await armarCatalogo(filas);
      return renderToBuffer(createElement(DocumentoCatalogo, { datos, sitio: SITE_URL }) as Parameters<typeof renderToBuffer>[0]);
    })().finally(() => (armando = null));
    guardado = { clave, pdf: await armando };
  }
  return guardado.pdf;
}

export async function GET(request: Request) {
  const pdf = (await leerDisenado()) ?? (await pdfAutomatico());
  const descargar = new URL(request.url).searchParams.has("descargar");
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${descargar ? "attachment" : "inline"}; filename="Catalogo-Divertimania-2026.pdf"`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
