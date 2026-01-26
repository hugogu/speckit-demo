<!--
  Sudoku Board Component
  Reference: tasks.md T019
  Reference: spec.md §FR-001 - 4×4, 6×6, 9×9 with different box dimensions
  Reference: plan.md §响应式布局断点
-->
<script setup lang="ts">
import type { SudokuBoard } from '~/types/sudoku';
import { getBoxDimensions } from '~/types/sudoku';

interface Props {
  board: SudokuBoard;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'cellSelect', row: number, col: number): void;
}>();

/**
 * Get box dimensions for border styling
 * Reference: spec.md §FR-001 Clarification
 */
const boxDimensions = computed(() => getBoxDimensions(props.board.size));

/**
 * Check if cell needs right box border
 */
function needsBoxBorderRight(col: number): boolean {
  return (col + 1) % boxDimensions.value.cols === 0 && col < props.board.size - 1;
}

/**
 * Check if cell needs bottom box border
 */
function needsBoxBorderBottom(row: number): boolean {
  return (row + 1) % boxDimensions.value.rows === 0 && row < props.board.size - 1;
}

/**
 * Board width based on size for responsive scaling
 * Reference: spec.md §US6 - responsive layout
 */
const boardStyle = computed(() => {
  const cellSize = props.board.size === 4 ? 48 : props.board.size === 6 ? 44 : 40;
  const width = props.board.size * cellSize;
  return {
    gridTemplateColumns: `repeat(${props.board.size}, minmax(0, 1fr))`,
    maxWidth: `${width}px`,
  };
});

function handleCellSelect(row: number, col: number) {
  emit('cellSelect', row, col);
}
</script>

<template>
  <div class="flex justify-center">
    <div
      class="grid bg-white rounded-lg shadow-lg border-2 border-gray-700 overflow-hidden w-full"
      :style="boardStyle"
      role="grid"
      :aria-label="`${board.size}×${board.size} 数独棋盘`"
    >
      <template v-for="(row, rowIdx) in board.cells" :key="rowIdx">
        <SudokuCell
          v-for="(cell, colIdx) in row"
          :key="`${rowIdx}-${colIdx}`"
          :cell="cell"
          :box-border-right="needsBoxBorderRight(colIdx)"
          :box-border-bottom="needsBoxBorderBottom(rowIdx)"
          @select="handleCellSelect(rowIdx, colIdx)"
        />
      </template>
    </div>
  </div>
</template>
