<script setup lang="ts">
import type { PrintPuzzle } from '~/utils/print'
import { getPrintGridLayout, getDifficultyLabel } from '~/utils/print'

interface Props {
  puzzles: PrintPuzzle[]
  showSolutions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSolutions: false,
})

const gridLayout = computed(() => {
  if (props.puzzles.length === 0) return { cols: 2, rows: 2 }
  return getPrintGridLayout(props.puzzles[0].boardSize)
})

const gridClass = computed(() => {
  return `grid-cols-${gridLayout.value.cols}`
})

const difficultyLabel = computed(() => {
  if (props.puzzles.length === 0) return ''
  return getDifficultyLabel(props.puzzles[0].difficulty)
})

const boardSizeLabel = computed(() => {
  if (props.puzzles.length === 0) return ''
  const size = props.puzzles[0].boardSize
  return `${size}×${size}`
})
</script>

<template>
  <div class="print-preview">
    <!-- Print Header (visible only when printing) -->
    <div class="hidden print:block print:mb-4">
      <h1 class="text-xl font-bold text-center">
        数独练习题 - {{ boardSizeLabel }} {{ difficultyLabel }}
      </h1>
      <p class="text-sm text-center text-gray-500">
        共 {{ puzzles.length }} 题
      </p>
    </div>

    <!-- Puzzles Grid -->
    <div 
      :class="[
        'grid gap-6 print:gap-4 justify-items-center',
        gridClass
      ]"
    >
      <PrintPrintLayout
        v-for="(puzzle, index) in puzzles"
        :key="puzzle.id"
        :puzzle="showSolutions ? puzzle.solution : puzzle.puzzle"
        :board-size="puzzle.boardSize"
        :puzzle-number="index + 1"
        :show-solution="showSolutions"
      />
    </div>

    <!-- Solutions Section (if showing solutions) -->
    <div v-if="showSolutions" class="mt-8 print:mt-4 print:break-before-page">
      <h2 class="text-lg font-semibold text-center mb-4 print:text-base">
        答案
      </h2>
    </div>
  </div>
</template>

<style scoped>
@media print {
  .print-preview {
    padding: 0;
    margin: 0;
  }
}
</style>
