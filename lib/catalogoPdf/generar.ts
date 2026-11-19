import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { armarCatalogo, leerFilas } from "./datos";
import DocumentoCatalogo from "./Documento";
import { SITE_URL } from "@/lib/negocio";

// Subir este número cuando cambie el diseño del documento (el PDF guardado en memoria se renueva solo si cambian los datos).
const VERSION_DISENO = 6;

let guardado: { clave: string; pdf: Buffer } | null = null;
let armando: Promise<Buffer> | null = null;

/** El catálogo en PDF, armado con lo que hay en el panel. Se guarda en memoria mientras los datos no cambien. */
export async function obtenerPdf(): Promise<Buffer> {
  const filas = await leerFilas();
  const clave = createHash("sha1").update(`${VERSION_DISENO}:${JSON.stringify(filas)}`).digest("hex");
  if (guardado?.clave !== clave) {
    armando ??= (async () => {
      const datos = await armarCatalogo(filas);
      return renderToBuffer(createElement(DocumentoCatalogo, { datos, sitio: SITE_URL }) as Parameters<typeof renderToBuffer>[0]);
    })().finally(() => (armando = null));
    guardado = { clave, pdf: await armando };
  }
  return guardado.pdf;
}
