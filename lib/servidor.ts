// Cliente del panel para hablar con el servidor: un solo lugar que arma la petición, entiende
// los errores (sin conexión, sesión vencida, mensaje del servidor) y los convierte en un Error legible.

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

type Opciones = {
  /** Para cancelar la petición (por ejemplo, si el usuario sigue escribiendo). */
  signal?: AbortSignal;
  /** En el login un 401 es «clave incorrecta», no «sesión vencida»: se muestra el mensaje del servidor. */
  sinSesion?: boolean;
};

/** fetch JSON para el panel: devuelve los datos o lanza un Error con el mensaje del servidor. */
export async function pedir<T = Record<string, unknown>>(url: string, method: string, body?: unknown, opciones: Opciones = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      signal: opciones.signal,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw new Error("Sin conexión. Intenta de nuevo.");
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && !opciones.sinSesion) throw new Error("Tu sesión se cerró. Vuelve a entrar al panel.");
  if (!res.ok) throw new Error(data.error ?? "No se pudo guardar.");
  return data as T;
}
