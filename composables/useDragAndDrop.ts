import { ref } from 'vue'

export function useDragAndDrop() {
  const isDragOverCell = ref(false)
  const dragOverCell = ref<{ row: number; col: number } | null>(null)
  
  function handleDragOver(row: number, col: number) {
    isDragOverCell.value = true
    dragOverCell.value = { row, col }
  }
  
  function handleDragLeave() {
    isDragOverCell.value = false
    dragOverCell.value = null
  }
  
  return {
    isDragOverCell,
    dragOverCell,
    handleDragOver,
    handleDragLeave
  }
}
