import { ref } from 'vue'

export interface DragData {
  value: number
  source: 'numberpad'
}

/**
 * Drag and Drop composable for sudoku number placement
 */
export function useDragAndDrop() {
  const isDragging = ref(false)
  const dragData = ref<DragData | null>(null)
  const dragOverCell = ref<{ row: number; col: number } | null>(null)

  /**
   * Start dragging a number from the number pad
   */
  function startDrag(event: DragEvent | TouchEvent, value: number) {
    isDragging.value = true
    dragData.value = { value, source: 'numberpad' }

    if (event instanceof DragEvent && event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(value))
    }
  }

  /**
   * Handle drag over a cell
   */
  function handleDragOver(event: DragEvent | TouchEvent, row: number, col: number) {
    if (event instanceof DragEvent) {
      event.preventDefault()
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
    }
    dragOverCell.value = { row, col }
  }

  /**
   * Handle drag leave from a cell
   */
  function handleDragLeave() {
    dragOverCell.value = null
  }

  /**
   * Handle drop on a cell
   */
  function handleDrop(event: DragEvent | TouchEvent, row: number, col: number): number | null {
    if (event instanceof DragEvent) {
      event.preventDefault()
    }

    const value = dragData.value?.value ?? null
    endDrag()
    return value
  }

  /**
   * End dragging
   */
  function endDrag() {
    isDragging.value = false
    dragData.value = null
    dragOverCell.value = null
  }

  /**
   * Check if a cell is being dragged over
   */
  function isDragOverCell(row: number, col: number): boolean {
    return dragOverCell.value?.row === row && dragOverCell.value?.col === col
  }

  // Touch event handlers for mobile support
  let touchStartPos = { x: 0, y: 0 }
  let touchCurrentElement: Element | null = null

  function handleTouchStart(event: TouchEvent, value: number) {
    const touch = event.touches[0]
    touchStartPos = { x: touch.clientX, y: touch.clientY }
    startDrag(event, value)
  }

  function handleTouchMove(event: TouchEvent) {
    if (!isDragging.value) return

    const touch = event.touches[0]
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    
    if (element !== touchCurrentElement) {
      touchCurrentElement = element
      
      // Find the cell element
      const cellElement = element?.closest('[data-cell]')
      if (cellElement) {
        const row = parseInt(cellElement.getAttribute('data-row') || '-1')
        const col = parseInt(cellElement.getAttribute('data-col') || '-1')
        if (row >= 0 && col >= 0) {
          dragOverCell.value = { row, col }
        }
      } else {
        dragOverCell.value = null
      }
    }
  }

  function handleTouchEnd(event: TouchEvent): { row: number; col: number; value: number } | null {
    if (!isDragging.value || !dragData.value) {
      endDrag()
      return null
    }

    const touch = event.changedTouches[0]
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    const cellElement = element?.closest('[data-cell]')
    
    if (cellElement) {
      const row = parseInt(cellElement.getAttribute('data-row') || '-1')
      const col = parseInt(cellElement.getAttribute('data-col') || '-1')
      const value = dragData.value.value
      
      endDrag()
      
      if (row >= 0 && col >= 0) {
        return { row, col, value }
      }
    }

    endDrag()
    return null
  }

  return {
    isDragging,
    dragData,
    dragOverCell,
    startDrag,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    endDrag,
    isDragOverCell,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
