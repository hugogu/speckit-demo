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
    classes.push('border-r-2 border-r-gray-800')
  }
  
  // Bottom border (thick if at box boundary, not at edge)
  if ((row + 1) % boxHeight === 0 && row < size - 1) {
    classes.push('border-b-2 border-b-gray-800')
  }
  
  return classes.join(' ')
}
</script>

<template>
  <div :class="gridClasses" role="grid" aria-label="数独棋盘">
    <template v-for="(rowCells, rowIndex) in board.cells" :key="rowIndex">
      <div
        v-for="cell in rowCells"
        :key="`${rowIndex}-${cell.col}`"
        :class="getCellBorderClasses(rowIndex, cell.col)"
      >
        <GameSudokuCell
          :cell="cell"
          :is-selected="isSelected(rowIndex, cell.col)"
          :is-highlighted="isHighlighted(rowIndex, cell.col)"
          :is-drag-over="isDragOverCell(rowIndex, cell.col)"
          :board-size="board.size"
          @select="handleCellSelect"
          @drop="handleCellDrop"
        />
      </div>
    </template>
  </div>
</template>
