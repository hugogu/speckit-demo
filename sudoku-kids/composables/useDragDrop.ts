/**
 * Drag and Drop Composable
 * Reference: tasks.md T031
 * Reference: spec.md §US3 - drag to fill numbers
 * Reference: spec.md Edge Case - fallback for unsupported browsers
 */

import { ref, computed } from 'vue';

export interface DragState {
  isDragging: boolean;
  dragValue: number | null;
  dropTargetRow: number | null;
  dropTargetCol: number | null;
}

const dragState = ref<DragState>({
  isDragging: false,
  dragValue: null,
  dropTargetRow: null,
  dropTargetCol: null,
});

export function useDragDrop() {
  const isDragging = computed(() => dragState.value.isDragging);
  const dragValue = computed(() => dragState.value.dragValue);

  /**
   * Check if drag and drop is supported
   * Reference: spec.md Edge Case - unsupported browsers fallback
   */
  const isDragDropSupported = computed(() => {
    if (typeof window === 'undefined') return false;
    const div = document.createElement('div');
    return 'draggable' in div && 'ondragstart' in div && 'ondrop' in div;
  });

  /**
   * Start dragging a number
   * Reference: spec.md §US3-1
   */
  function startDrag(value: number, event: DragEvent): void {
    dragState.value.isDragging = true;
    dragState.value.dragValue = value;
    
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(value));
    }
  }

  /**
   * End drag operation
   */
  function endDrag(): void {
    dragState.value.isDragging = false;
    dragState.value.dragValue = null;
    dragState.value.dropTargetRow = null;
    dragState.value.dropTargetCol = null;
  }

  /**
   * Set drop target for visual feedback
   * Reference: spec.md §US3-1 - highlight droppable cells
   */
  function setDropTarget(row: number | null, col: number | null): void {
    dragState.value.dropTargetRow = row;
    dragState.value.dropTargetCol = col;
  }

  /**
   * Check if cell is current drop target
   */
  function isDropTarget(row: number, col: number): boolean {
    return dragState.value.dropTargetRow === row && dragState.value.dropTargetCol === col;
  }

  /**
   * Handle drag over a cell
   * Reference: spec.md §US3-3 - prevent drop on pre-filled
   */
  function handleDragOver(event: DragEvent, row: number, col: number, isPreFilled: boolean): void {
    if (isPreFilled) {
      event.dataTransfer!.dropEffect = 'none';
      return;
    }
    
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
    setDropTarget(row, col);
  }

  /**
   * Handle drop on a cell
   * Reference: spec.md §US3-2
   */
  function handleDrop(event: DragEvent): number | null {
    event.preventDefault();
    const value = dragState.value.dragValue;
    endDrag();
    return value;
  }

  return {
    dragState,
    isDragging,
    dragValue,
    isDragDropSupported,
    startDrag,
    endDrag,
    setDropTarget,
    isDropTarget,
    handleDragOver,
    handleDrop,
  };
}
