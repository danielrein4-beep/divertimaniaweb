"use client";

// Piezas para ordenar arrastrando (con mouse, dedo o teclado) usadas en el catálogo del panel.
import type { CSSProperties, ReactNode } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

const ANUNCIOS = {
  onDragStart: () => "Tomaste el elemento. Usa las flechas para moverlo y Enter para soltarlo.",
  onDragOver: () => "",
  onDragEnd: () => "Listo, quedó en su nuevo lugar.",
  onDragCancel: () => "Se canceló, quedó donde estaba.",
};

/** Lista que se reordena arrastrando; al soltar entrega el nuevo orden. */
export function ListaOrdenable<T extends { id: string }>({
  id,
  items,
  onOrden,
  children,
}: {
  id: string;
  items: T[];
  onOrden: (nuevos: T[]) => void;
  children: ReactNode;
}) {
  const sensores = useSensors(
    // Un pequeño movimiento antes de arrastrar, para que tocar la fila siga funcionando como clic.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function alSoltar({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const desde = items.findIndex((x) => x.id === active.id);
    const hasta = items.findIndex((x) => x.id === over.id);
    if (desde < 0 || hasta < 0) return;
    onOrden(arrayMove(items, desde, hasta));
  }

  return (
    <DndContext
      id={id}
      sensors={sensores}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={alSoltar}
      accessibility={{ announcements: ANUNCIOS, screenReaderInstructions: { draggable: "Presiona espacio para tomar el elemento." } }}
    >
      <SortableContext items={items.map((x) => x.id)} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

/** Conecta una fila a la lista: devuelve la referencia, su estilo mientras se mueve y la agarradera. */
export function useFilaOrdenable(id: string, desactivado = false) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: desactivado,
  });
  const estilo: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    position: "relative",
    zIndex: isDragging ? 20 : undefined,
  };
  const agarradera = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      disabled={desactivado}
      aria-label="Arrastrar para ordenar"
      title={desactivado ? "Borra la búsqueda para ordenar" : "Arrastrar para ordenar"}
      className="flex h-10 w-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-foreground/50 hover:bg-white/10 hover:text-neon-green active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-20"
    >
      <GripVertical className="h-5 w-5" aria-hidden />
    </button>
  );
  return { ref: setNodeRef, estilo, agarradera, arrastrando: isDragging };
}
