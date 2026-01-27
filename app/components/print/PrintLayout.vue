<script setup lang="ts">
import type { BoardSize } from '~/types'
import { BOX_DIMENSIONS } from '~/types'

interface Props {
  puzzle: number[][]
  boardSize: BoardSize
  puzzleNumber?: number
  showSolution?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  puzzleNumber: 1,
  showSolution: false,
})

const boxDimensions = computed(() => BOX_DIMENSIONS[props.boardSize])

function getCellBorderClasses(row: number, col: number): string {
  const { width: boxWidth, height: boxHeight } = boxDimensions.value
  const classes: string[] = []
  
  // Right border (thick if at box boundary, not at edge)
  if ((col + 1) % boxWidth === 0 && col < props.boardSize - 1) {
    classes.push('border-r-2 border-r-gray-800')
  }
  
  // Bottom border (thick if at box boundary, not at edge)
  if ((row + 1) % boxHeight === 0 && row < props.boardSize - 1) {
    classes.push('border-b-2 border-b-gray-800')
  }
  
  return classes.join(' ')
}

const gridColsClass = computed(() => {
  switch (props.boardSize) {
    case 4: return 'grid-cols-4'
    case 6: return 'grid-cols-6'
    case 9: return 'grid-cols-9'
    default: return 'grid-cols-9'
  }
})

const cellSizeClass = computed(() => {
  // Ensure minimum ~1cm cell size for printing (1cm ≈ 38px at 96dpi)
  switch (props.boardSize) {
    case 4: return 'w-14 h-14 text-lg'      // 56px ≈ 1.5cm
    case 6: return 'w-12 h-12 text-base'    // 48px ≈ 1.2cm
    case 9: return 'w-10 h-10 text-sm'      // 40px ≈ 1cm
    default: return 'w-10 h-10 text-sm'
  }
})
</script>

<template>
  <div class="print-puzzle inline-block">
    <div class="text-xs text-gray-500 mb-1">
      #{{ puzzleNumber }}
    </div>
    <div 
      v-if="puzzle && puzzle.length > 0"
      :class="[
        'grid gap-0 border-2 border-gray-800',
        gridColsClass
      ]"
    >
      <template v-for="(row, rowIndex) in puzzle" :key="rowIndex">
        <div
          v-for="(cell, colIndex) in row"
          :key="`${rowIndex}-${colIndex}`"
          :class="[
            'flex items-center justify-center border border-gray-300 font-medium',
            cellSizeClass,
            getCellBorderClasses(rowIndex, colIndex),
            cell === 0 ? 'bg-white' : 'bg-gray-50 text-gray-800'
          ]"
        >
          {{ cell === 0 ? '' : cell }}
        </div>
      </template>
    </div>
    <div v-else class="text-red-500 text-xs">
      No puzzle data
    </div>
  </div>
</template>

<style scoped>
@media print {
  .print-puzzle {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
</style>
