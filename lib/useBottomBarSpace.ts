import { useEffect } from "react";

/** Reserva espacio al final de la página mientras hay una barra fija abajo, para que no tape el footer. */
export function useBottomBarSpace(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.paddingBottom;
    document.body.style.paddingBottom = "6rem";
    return () => {
      document.body.style.paddingBottom = previous;
    };
  }, [active]);
}
