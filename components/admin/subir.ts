/** Sube un archivo al servidor y devuelve su ruta /media/... (lanza un Error con el mensaje para mostrar). */
export async function subirArchivo(file: File): Promise<{ url: string; tipo: "FOTO" | "VIDEO" }> {
  const form = new FormData();
  form.append("archivo", file);
  let res: Response;
  try {
    res = await fetch("/api/subir", { method: "POST", body: form });
  } catch {
    throw new Error("Sin conexión. Intenta de nuevo.");
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) throw new Error("Tu sesión se cerró. Vuelve a entrar al panel.");
  if (!res.ok) throw new Error(data.error ?? "No se pudo subir el archivo.");
  return data;
}

/** fetch JSON para el panel: devuelve los datos o lanza un Error con el mensaje del servidor. */
export async function pedir<T = Record<string, unknown>>(url: string, method: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error("Sin conexión. Intenta de nuevo.");
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) throw new Error("Tu sesión se cerró. Vuelve a entrar al panel.");
  if (!res.ok) throw new Error(data.error ?? "No se pudo guardar.");
  return data as T;
}
