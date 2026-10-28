// Número de WhatsApp: se guarda solo con dígitos (código de país incluido) y se muestra formateado.

export const WHATSAPP_POR_DEFECTO = "584147286881";

/** "+58 414-728.6881" -> "584147286881"; convierte "0414..." al formato internacional de Venezuela. */
export function normalizarTelefono(valor: string): string {
  const digitos = valor.replace(/\D/g, "");
  if (digitos.startsWith("0") && digitos.length === 11) return `58${digitos.slice(1)}`;
  return digitos;
}

export function esTelefonoValido(digitos: string): boolean {
  return /^[1-9]\d{9,14}$/.test(digitos);
}

/** "584147286881" -> "+58 414-728-6881". Otros países: "+" y los dígitos. */
export function formatTelefono(digitos: string): string {
  const m = digitos.match(/^58(\d{3})(\d{3})(\d{4})$/);
  return m ? `+58 ${m[1]}-${m[2]}-${m[3]}` : `+${digitos}`;
}

export function buildWhatsAppLink(numero: string, mensaje: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
