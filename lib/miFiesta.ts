// Estado de "Mi fiesta" (lista de cotización) y armado del mensaje de WhatsApp.
// El estado vive fuera de React y se lee con useSyncExternalStore, así el render del
// servidor siempre parte vacío y el navegador carga lo guardado sin desajustes de hidratación.

export interface MiFiestaItem {
  id: string;
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
  horaInicio: string;
  zona: string;
  lugar: string;
  invitados: string;
  cumpleaneroNombre: string;
  cumpleaneroEdad: string;
  comentarios: string;
}

export interface MiFiestaState {
  items: MiFiestaItem[];
  form: EventoFormData;
}

export const FORM_VACIO: EventoFormData = {
  nombre: "",
  tipoEvento: "",
  fecha: "",
  horaInicio: "",
  zona: "",
  lugar: "",
  invitados: "",
  cumpleaneroNombre: "",
  cumpleaneroEdad: "",
  comentarios: "",
};

const STORAGE_KEY_ITEMS = "divertimania_mifiesta_items";
const STORAGE_KEY_FORM = "divertimania_mifiesta_form";

const SERVER_STATE: MiFiestaState = { items: [], form: FORM_VACIO };
let state: MiFiestaState | null = null;
const listeners = new Set<() => void>();

function load(): MiFiestaState {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY_ITEMS) ?? "[]");
    const form = JSON.parse(localStorage.getItem(STORAGE_KEY_FORM) ?? "{}");
    return {
      items: Array.isArray(items) ? items : [],
      form: { ...FORM_VACIO, ...(form && typeof form === "object" ? form : {}) },
    };
  } catch {
    return SERVER_STATE;
  }
}

function persist(next: MiFiestaState) {
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(next.items));
    localStorage.setItem(STORAGE_KEY_FORM, JSON.stringify(next.form));
  } catch {
    // modo privado o almacenamiento bloqueado: la fiesta vive solo en memoria
  }
}

export const miFiestaStore = {
  getSnapshot(): MiFiestaState {
    if (!state) state = load();
    return state;
  },
  getServerSnapshot(): MiFiestaState {
    return SERVER_STATE;
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_ITEMS || e.key === STORAGE_KEY_FORM) {
        state = load();
        listeners.forEach((l) => l());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
  update(updater: (prev: MiFiestaState) => MiFiestaState) {
    const next = updater(miFiestaStore.getSnapshot());
    state = next;
    persist(next);
    listeners.forEach((l) => l());
  },
};

export function itemId(item: Omit<MiFiestaItem, "id">): string {
  return `${item.servicioId}::${item.variante ?? ""}`;
}

export const CAMPOS_OBLIGATORIOS: { campo: keyof EventoFormData; falta: string }[] = [
  { campo: "nombre", falta: "Escribe tu nombre" },
  { campo: "tipoEvento", falta: "Elige el tipo de evento" },
  { campo: "fecha", falta: "Elige la fecha" },
  { campo: "zona", falta: "Indica el municipio o zona" },
  { campo: "lugar", falta: "Elige el lugar" },
  { campo: "invitados", falta: "Elige cuántos invitados" },
];

export function primerCampoFaltante(form: EventoFormData): string | null {
  const faltante = CAMPOS_OBLIGATORIOS.find(({ campo }) => !form[campo].trim());
  return faltante ? faltante.falta : null;
}

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export function formatFechaAmigable(fecha: string): string {
  const [y, m, d] = fecha.split("-").map(Number);
  if (!y || !m || !d) return fecha;
  const dia = DIAS[new Date(y, m - 1, d).getDay()];
  return `${dia} ${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}

function formatHora(hora: string): string {
  const [h, min] = hora.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(min)) return hora;
  const sufijo = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(min).padStart(2, "0")} ${sufijo}`;
}

export function buildMensajeCotizacion(items: MiFiestaItem[], form: EventoFormData): string {
  const servicios =
    items.length > 0
      ? items
          .map((item) => {
            let linea = `• ${item.nombre}`;
            if (item.variante) linea += ` – ${item.variante}`;
            if (item.dinamicas?.length) linea += ` – dinámicas: ${item.dinamicas.join(", ")}`;
            return linea;
          })
          .join("\n")
      : "• Aún no sé, quiero recomendaciones";

  const fecha = formatFechaAmigable(form.fecha);
  const lineas = [
    `• Tipo: ${form.tipoEvento}`,
    `• Fecha: ${form.horaInicio ? `${fecha} – ${formatHora(form.horaInicio)}` : fecha}`,
    `• Zona: ${form.zona.trim()}`,
    `• Lugar: ${form.lugar}`,
    `• Invitados: ${form.invitados}`,
  ];
  if (form.tipoEvento === "Cumpleaños" && form.cumpleaneroNombre.trim()) {
    const edad = form.cumpleaneroEdad.trim() ? `, ${form.cumpleaneroEdad.trim()} años` : "";
    lineas.push(`• Cumpleañero: ${form.cumpleaneroNombre.trim()}${edad}`);
  }
  if (form.comentarios.trim()) lineas.push(`• Comentarios: ${form.comentarios.trim()}`);

  return `Hola Divertimania 👋 Vengo de la página web y quiero una cotización:

🎉 Servicios:
${servicios}

📋 Datos del evento:
${lineas.join("\n")}

Mi nombre es ${form.nombre.trim()}.`;
}
