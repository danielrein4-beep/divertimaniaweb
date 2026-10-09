import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { guardarArchivo } from "@/lib/uploads";

/** Sube una foto o video del panel. Devuelve la ruta /media/... para guardarla en el servicio. */
export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await request.formData().catch(() => null);
  const file = form?.get("archivo");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No llegó ningún archivo." }, { status: 400 });
  }

  try {
    const guardado = await guardarArchivo(file);
    return NextResponse.json(guardado, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo subir." }, { status: 400 });
  }
}
