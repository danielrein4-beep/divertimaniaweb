"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { buildWhatsAppLink } from "@/lib/site";
import { useToast } from "@/components/ui/Toast";
import {
  buildMensajeCotizacion,
  itemId,
  miFiestaStore,
  type EventoFormData,
  type MiFiestaItem,
} from "@/lib/miFiesta";

export type { EventoFormData, MiFiestaItem } from "@/lib/miFiesta";

type NuevoItem = Omit<MiFiestaItem, "id">;

interface MiFiestaContextValue {
  items: MiFiestaItem[];
  /** Agrega el ítem, o lo reemplaza si ya existe (por ejemplo, para actualizar las dinámicas). */
  addItem: (item: NuevoItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: NuevoItem) => void;
  isInFiesta: (servicioId: string, variante?: string | null) => boolean;
  getItem: (servicioId: string, variante?: string | null) => MiFiestaItem | undefined;
  clearFiesta: () => void;
  isPanelOpen: boolean;
  openPanel: (step?: 1 | 2) => void;
  closePanel: () => void;
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
  formData: EventoFormData;
  updateFormData: (data: Partial<EventoFormData>) => void;
  sendWhatsAppCotizacion: () => void;
  isEnviado: boolean;
}

const MiFiestaContext = createContext<MiFiestaContextValue | null>(null);

export function MiFiestaProvider({ children }: { children: ReactNode }) {
  const { items, form } = useSyncExternalStore(
    miFiestaStore.subscribe,
    miFiestaStore.getSnapshot,
    miFiestaStore.getServerSnapshot
  );
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [isEnviado, setIsEnviado] = useState(false);
  const { showToast } = useToast();

  const getItem = useCallback(
    (servicioId: string, variante?: string | null) =>
      variante === undefined
        ? items.find((i) => i.servicioId === servicioId)
        : items.find((i) => i.servicioId === servicioId && (i.variante ?? null) === variante),
    [items]
  );

  const isInFiesta = useCallback(
    (servicioId: string, variante?: string | null) => Boolean(getItem(servicioId, variante)),
    [getItem]
  );

  const addItem = useCallback(
    (item: NuevoItem) => {
      const id = itemId(item);
      const existia = miFiestaStore.getSnapshot().items.some((i) => i.id === id);
      miFiestaStore.update((s) => ({
        ...s,
        items: existia
          ? s.items.map((i) => (i.id === id ? { ...item, id } : i))
          : [...s.items, { ...item, id }],
      }));
      showToast(existia ? `${item.nombre} actualizado en tu fiesta` : `${item.nombre} agregado a tu fiesta`);
    },
    [showToast]
  );

  const removeItem = useCallback((id: string) => {
    miFiestaStore.update((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) }));
  }, []);

  const toggleItem = useCallback(
    (item: NuevoItem) => {
      const id = itemId(item);
      if (miFiestaStore.getSnapshot().items.some((i) => i.id === id)) removeItem(id);
      else addItem(item);
    },
    [addItem, removeItem]
  );

  const clearFiesta = useCallback(() => {
    miFiestaStore.update((s) => ({ ...s, items: [] }));
    setIsEnviado(false);
    setStep(1);
  }, []);

  const openPanel = useCallback((initialStep: 1 | 2 = 1) => {
    setStep(initialStep);
    setIsEnviado(false);
    setIsPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  const updateFormData = useCallback((data: Partial<EventoFormData>) => {
    miFiestaStore.update((s) => ({ ...s, form: { ...s.form, ...data } }));
  }, []);

  const sendWhatsAppCotizacion = useCallback(() => {
    const { items: actuales, form: datos } = miFiestaStore.getSnapshot();
    const mensaje = buildMensajeCotizacion(actuales, datos);

    // Se abre en el mismo clic (sin await antes) para que el navegador no lo bloquee.
    const link = buildWhatsAppLink(mensaje);
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = link;
    } else {
      window.open(link, "_blank", "noopener,noreferrer");
    }

    // Copia para la bandeja del admin, sin bloquear la apertura de WhatsApp.
    const payload = JSON.stringify({
      nombre: datos.nombre.trim().slice(0, 120),
      telefono: "Por WhatsApp",
      mensaje: mensaje.slice(0, 2000),
      fechaDeseada: datos.fecha,
    });
    const enviado =
      typeof navigator.sendBeacon === "function" &&
      navigator.sendBeacon("/api/contacto", new Blob([payload], { type: "application/json" }));
    if (!enviado) {
      fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }

    setIsEnviado(true);
  }, []);

  const value = useMemo<MiFiestaContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      toggleItem,
      isInFiesta,
      getItem,
      clearFiesta,
      isPanelOpen,
      openPanel,
      closePanel,
      step,
      setStep,
      formData: form,
      updateFormData,
      sendWhatsAppCotizacion,
      isEnviado,
    }),
    [items, addItem, removeItem, toggleItem, isInFiesta, getItem, clearFiesta, isPanelOpen, openPanel, closePanel, step, form, updateFormData, sendWhatsAppCotizacion, isEnviado]
  );

  return <MiFiestaContext.Provider value={value}>{children}</MiFiestaContext.Provider>;
}

export function useMiFiesta() {
  const ctx = useContext(MiFiestaContext);
  if (!ctx) throw new Error("useMiFiesta debe usarse dentro de MiFiestaProvider");
  return ctx;
}
