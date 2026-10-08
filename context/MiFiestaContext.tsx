"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { buildWhatsAppLink } from "@/lib/site";
import { useToast } from "@/components/ui/Toast";

export interface MiFiestaItem {
  id: string; // unique item id (servicioId + variant/dynamics signature)
  servicioId: string;
  nombre: string;
  categoria: string;
  fotoUrl?: string | null;
  variante?: string | null;
  dinamicas?: string[];
}

export interface EventoFormData {
  nombre: string;
  tipoEvento: string;
  fecha: string;
  horaInicio?: string;
  zona: string;
  lugar: string;
  invitados: string;
  cumpleaneroNombre?: string;
  cumpleaneroEdad?: string;
  comentarios?: string;
}

interface MiFiestaContextValue {
  items: MiFiestaItem[];
  addItem: (item: Omit<MiFiestaItem, "id">) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: Omit<MiFiestaItem, "id">) => void;
  isInFiesta: (servicioId: string, variante?: string | null) => boolean;
  clearFiesta: () => void;
  isPanelOpen: boolean;
  openPanel: (step?: 1 | 2) => void;
  openSheet: (step?: 1 | 2) => void;
  closePanel: () => void;
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
  formData: EventoFormData;
  updateFormData: (data: Partial<EventoFormData>) => void;
  sendWhatsAppCotizacion: () => void;
  isEnviado: boolean;
  setIsEnviado: (val: boolean) => void;
}

const STORAGE_KEY_ITEMS = "divertimania_mifiesta_items";
const STORAGE_KEY_FORM = "divertimania_mifiesta_form";

const initialForm: EventoFormData = {
  nombre: "",
  tipoEvento: "Cumpleaños",
  fecha: "",
  horaInicio: "",
  zona: "San Cristóbal",
  lugar: "Casa",
  invitados: "15-30",
  cumpleaneroNombre: "",
  cumpleaneroEdad: "",
  comentarios: "",
};

const MiFiestaContext = createContext<MiFiestaContextValue | null>(null);

export function MiFiestaProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MiFiestaItem[]>([]);
  const [formData, setFormData] = useState<EventoFormData>(initialForm);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [isEnviado, setIsEnviado] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { showToast } = useToast();

  // Load from localStorage
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
      const storedForm = localStorage.getItem(STORAGE_KEY_FORM);
      if (storedForm) {
        setFormData({ ...initialForm, ...JSON.parse(storedForm) });
      }
    } catch {
      // localStorage disabled or private browsing
    }
    setLoaded(true);
  }, []);

  // Save items to localStorage
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, loaded]);

  // Save formData to localStorage
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_FORM, JSON.stringify(formData));
    } catch {
      // ignore
    }
  }, [formData, loaded]);

  const generateItemId = (item: Omit<MiFiestaItem, "id">) => {
    return `${item.servicioId}_${item.variante || "default"}_${(item.dinamicas || []).sort().join(",")}`;
  };

  const isInFiesta = useCallback(
    (servicioId: string, variante?: string | null) => {
      if (variante !== undefined) {
        return items.some((i) => i.servicioId === servicioId && i.variante === variante);
      }
      return items.some((i) => i.servicioId === servicioId);
    },
    [items]
  );

  const addItem = useCallback(
    (item: Omit<MiFiestaItem, "id">) => {
      const id = generateItemId(item);
      setItems((prev) => {
        const exists = prev.find((i) => i.id === id);
        if (exists) return prev;
        return [...prev, { ...item, id }];
      });
      showToast(`${item.nombre} agregado a tu fiesta 🎉`);
    },
    [showToast]
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const toggleItem = useCallback(
    (item: Omit<MiFiestaItem, "id">) => {
      const id = generateItemId(item);
      setItems((prev) => {
        const exists = prev.find((i) => i.id === id);
        if (exists) {
          return prev.filter((i) => i.id !== id);
        } else {
          showToast(`${item.nombre} agregado a tu fiesta 🎉`);
          return [...prev, { ...item, id }];
        }
      });
    },
    [showToast]
  );

  const clearFiesta = useCallback(() => {
    setItems([]);
    setIsEnviado(false);
  }, []);

  const openPanel = useCallback((initialStep: 1 | 2 = 1) => {
    setStep(initialStep);
    setIsEnviado(false);
    setIsPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  const updateFormData = useCallback((data: Partial<EventoFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  // Format date helper: "viernes 15/11/2026"
  const formatDateFriendly = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      if (!year || !month || !day) return dateStr;
      const d = new Date(year, month - 1, day);
      const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
      const diaSemana = dias[d.getDay()];
      const dd = String(day).padStart(2, "0");
      const mm = String(month).padStart(2, "0");
      return `${diaSemana} ${dd}/${mm}/${year}`;
    } catch {
      return dateStr;
    }
  };

  const sendWhatsAppCotizacion = () => {
    // 1. Build Services Block
    const serviciosBlock = items
      .map((item) => {
        let line = `• ${item.nombre}`;
        if (item.variante) line += ` – ${item.variante}`;
        if (item.dinamicas && item.dinamicas.length > 0) {
          line += ` – dinámicas: ${item.dinamicas.join(", ")}`;
        }
        return line;
      })
      .join("\n");

    // 2. Build Event Data Block
    const fechaTexto = formatDateFriendly(formData.fecha);
    const fechaHora = formData.horaInicio
      ? `${fechaTexto} – ${formData.horaInicio}`
      : fechaTexto;

    const lineasEvento = [
      `• Tipo: ${formData.tipoEvento}`,
      `• Fecha: ${fechaHora}`,
      `• Zona: ${formData.zona}`,
      `• Lugar: ${formData.lugar}`,
      `• Invitados: ${formData.invitados}`,
    ];

    if (
      formData.tipoEvento.toLowerCase().includes("cumple") &&
      formData.cumpleaneroNombre?.trim()
    ) {
      const edadTexto = formData.cumpleaneroEdad ? `, ${formData.cumpleaneroEdad} años` : "";
      lineasEvento.push(`• Cumpleañero: ${formData.cumpleaneroNombre.trim()}${edadTexto}`);
    }

    if (formData.comentarios?.trim()) {
      lineasEvento.push(`• Comentarios: ${formData.comentarios.trim()}`);
    }

    const mensaje = `Hola Divertimania 👋 Vengo de la página web y quiero una cotización:

🎉 Servicios:
${serviciosBlock}

📋 Datos del evento:
${lineasEvento.join("\n")}

Mi nombre es ${formData.nombre.trim()}.`;

    const waLink = buildWhatsAppLink(mensaje);

    // CRITICAL REQUIREMENT:
    // Open WhatsApp SYNCHRONOUSLY on the click event to avoid browser popup blockers on mobile
    if (typeof window !== "undefined") {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = waLink;
      } else {
        window.open(waLink, "_blank", "noopener,noreferrer");
      }
    }

    // In parallel and non-blocking, send lead copy to admin via /api/contacto
    const payload = JSON.stringify({
      nombre: formData.nombre.trim(),
      telefono: "WhatsApp Lead",
      mensaje: mensaje,
      fechaDeseada: formData.fecha,
    });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/contacto", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }

    setIsEnviado(true);
  };

  return (
    <MiFiestaContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleItem,
        isInFiesta,
        clearFiesta,
        isPanelOpen,
        openPanel,
        openSheet: openPanel,
        closePanel,
        step,
        setStep,
        formData,
        updateFormData,
        sendWhatsAppCotizacion,
        isEnviado,
        setIsEnviado,
      }}
    >
      {children}
    </MiFiestaContext.Provider>
  );
}

export function useMiFiesta() {
  const ctx = useContext(MiFiestaContext);
  if (!ctx) {
    throw new Error("useMiFiesta must be used within a MiFiestaProvider");
  }
  return ctx;
}
