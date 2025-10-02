import { useState } from 'react';

interface DragItem {
  id: string;
  type: string;
  data: any;
}

export function useDragAndDrop() {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);

  const handleDragStart = (item: DragItem) => {
    setDraggedItem(item);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (targetZone: string, onDrop: (item: DragItem, target: string) => void) => {
    if (draggedItem) {
      onDrop(draggedItem, targetZone);
      setDraggedItem(null);
    }
  };

  return {
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDrop,
  };
}
