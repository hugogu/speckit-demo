<script setup lang="ts">
import type { Board } from '~/types'
import { useDragAndDrop } from '~/composables/useDragAndDrop'

interface Props {
  board: Board
  selectedCell: { row: number; col: number } | null
  highlightedCells: Set<string>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectCell: [row: number, col: number]
  dropNumber: [row: number, col: number, value: number]
}>()

const { isDragOverCell, handleDragOver, handleDragLeave, dragOverCell } = useDragAndDrop()

const gridClasses = computed(() => {
  const size = props.board.size
  return [
    'grid gap-0 border-2 border-gray-800 rounded-lg overflow-hidden',
    size === 4 ? 'grid-cols-4' : size === 6 ? 'grid-cols-6' : 'grid-cols-9',
  ]
})

function isSelected(row: number, col: number): boolean {
  return props.selectedCell?.row === row && props.selectedCell?.col === col
}

function isHighlighted(row: number, col: number): boolean {
  return props.highlightedCells.has(`${row}-${col}`)
}

function handleCellSelect(row: number, col: number) {
  emit('selectCell', row, col)
}

function handleCellDrop(row: number, col: number, value: number) {
  emit('dropNumber', row, col, value)
}

// Calculate thick border positions for box boundaries
function getCellBorderClasses(row: number, col: number): string {
  const { boxWidth, boxHeight, size } = props.board
  const classes: string[] = []
  
  // Right border (thick if at box boundary, not at edge)
  if ((col + 1) % boxWidth === 0 && col < size - 1) {
    classes.push('border-r-2 border-gray-800')
  } else {
    classes.push('border-r border-gray-300')
  }
  
  // Bottom border (thick if at box boundary, not at edge)
  if ((row + 1) % boxHeight === 0 && row < size - 1) {
    classes.push('border-b-2 border-gray-800')
  } else {
    classes.push('border-b border-gray-300')
  }
  
  // Left and top borders (always thick)
  if (col === 0) classes.push('border-l-2 border-gray-800')
  if (row === 0) classes.push('border-t-2 border-gray-800')
  
  return classes.join(' ')
}
</script>

<template>
  <div :class="gridClasses">
    <template v-for="(row, rowIndex) in board.cells" :key="rowIndex">
      <GameSudokuCell
        v-for="(cell, colIndex) in row"
        :key="`${rowIndex}-${colIndex}`"
        :cell="cell"
        :board-size="board.size"
        :is-selected="isSelected(rowIndex, colIndex)"
        :is-highlighted="isHighlighted(rowIndex, colIndex)"
        @select="handleCellSelect(rowIndex, colIndex)"
        @drop="handleCellDrop(rowIndex, colIndex, $event)"
      />
    </template>
  </div>
</template>
