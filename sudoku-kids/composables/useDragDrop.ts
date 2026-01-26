import { ref, computed } from 'vue';

export interface DragState {
  isDragging: boolean;
  draggedNumber: number | null;
  dropTargetRow: number | null;
  dropTargetCol: number | null;
}

const dragState = ref<DragState>({
  isDragging: false,
  draggedNumber: null,
  dropTargetRow: null,
  dropTargetCol: null,
});

export function useDragDrop() {
  const isDragging = computed(() => dragState.value.isDragging);
  const draggedNumber = computed(() => dragState.value.draggedNumber);
  const dropTarget = computed(() => {
    if (dragState.value.dropTargetRow === null || dragState.value.dropTargetCol === null) {
      return null;
    }
    return {
      row: dragState.value.dropTargetRow,
      col: dragState.value.dropTargetCol,
    };
  });

  function startDrag(number: number, event: DragEvent | TouchEvent): void {
    dragState.value.isDragging = true;
    dragState.value.draggedNumber = number;

    if (event instanceof DragEvent && event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(number));
    }
  }

  function endDrag(): void {
    dragState.value.isDragging = false;
    dragState.value.draggedNumber = null;
    dragState.value.dropTargetRow = null;
    dragState.value.dropTargetCol = null;
  }

  function setDropTarget(row: number, col: number): void {
    dragState.value.dropTargetRow = row;
    dragState.value.dropTargetCol = col;
  }

  function clearDropTarget(): void {
    dragState.value.dropTargetRow = null;
    dragState.value.dropTargetCol = null;
  }

  function isDropTarget(row: number, col: number): boolean {
    return dragState.value.dropTargetRow === row && dragState.value.dropTargetCol === col;
  }

  function handleDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  function handleDrop(event: DragEvent, row: number, col: number): number | null {
    event.preventDefault();
    const number = dragState.value.draggedNumber;
    endDrag();
    return number;
  }

  const supportsTouch = computed(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });

  const supportsDragDrop = computed(() => {
    if (typeof window === 'undefined') return true;
    const div = document.createElement('div');
    return 'draggable' in div;
  });

  return {
    dragState,
    isDragging,
    draggedNumber,
    dropTarget,
    startDrag,
    endDrag,
    setDropTarget,
    clearDropTarget,
    isDropTarget,
    handleDragOver,
    handleDrop,
    supportsTouch,
    supportsDragDrop,
  };
}
