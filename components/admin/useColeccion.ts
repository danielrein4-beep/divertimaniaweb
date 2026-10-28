"use client";

import { useState } from "react";
import { pedir } from "@/lib/servidor";

/**
 * Lista editable del panel (equipo, novedades, inventario…) contra una ruta REST:
 * POST ruta, PUT ruta/id y DELETE ruta/id. Los cambios se ven al instante y, si el servidor
 * falla, la lista vuelve a como estaba y queda el mensaje en `error`.
 */
export function useColeccion<T extends { id: string }>(iniciales: T[], ruta: string, clave: string) {
  const [items, setItems] = useState(iniciales);
  const [error, setError] = useState("");

  /** Crea y devuelve el registro nuevo (o null si falló). */
  async function crear(datos: Record<string, unknown>, ordenar?: (a: T, b: T) => number): Promise<T | null> {
    setError("");
    try {
      const respuesta = await pedir<Record<string, T>>(ruta, "POST", datos);
      const nuevo = respuesta[clave];
      setItems((prev) => (ordenar ? [...prev, nuevo].sort(ordenar) : [...prev, nuevo]));
      return nuevo;
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear.");
      return null;
    }
  }

  /** Guarda el registro completo con el cambio aplicado. Devuelve true si se guardó. */
  async function actualizar(item: T, cambio: Partial<T>): Promise<boolean> {
    const anterior = items;
    const nuevo = { ...item, ...cambio };
    setItems((prev) => prev.map((x) => (x.id === item.id ? nuevo : x)));
    setError("");
    try {
      await pedir(`${ruta}/${item.id}`, "PUT", nuevo);
      return true;
    } catch (e) {
      setItems(anterior);
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
      return false;
    }
  }

  /** Pide confirmación y borra. */
  async function borrar(item: T, pregunta: string) {
    if (!confirm(pregunta)) return;
    const anterior = items;
    setItems((prev) => prev.filter((x) => x.id !== item.id));
    setError("");
    try {
      await pedir(`${ruta}/${item.id}`, "DELETE");
    } catch (e) {
      setItems(anterior);
      setError(e instanceof Error ? e.message : "No se pudo borrar.");
    }
  }

  return { items, setItems, error, crear, actualizar, borrar };
}
