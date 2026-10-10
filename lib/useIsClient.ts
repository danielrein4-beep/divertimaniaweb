import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** true solo en el navegador (después de hidratar); false en el render del servidor. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
