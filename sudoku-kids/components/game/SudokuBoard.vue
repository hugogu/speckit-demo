<template>
  <div
    class="inline-grid gap-0.5 rounded-lg bg-gray-400 p-0.5"
    :style="gridStyle"
  >
    <div
      v-for="(cell, index) in flatCells"
      :key="index"
      :data-row="cell.row"
      :data-col="cell.col"
      :class="[
        'flex h-10 w-10 cursor-pointer items-center justify-center text-lg font-bold transition-all sm:h-12 sm:w-12 sm:text-xl',
        getCellClass(cell)
      ]"
      @click="$emit('select-cell', cell.row, cell.col)"
    >
      {{ cell.value || '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Cell } from '~/types/sudoku';

interface Props {
  board: Cell[][];
  selectedCell: { row: number; col: number } | null;
}

const props = defineProps<Props>();

defineEmits<{
  'select-cell': [row: number, col: number];
  input: [row: number, col: number, value: number];
}>();

const flatCells = computed(() => {
  return props.board.flat();
});

const gridStyle = computed(() => {
  const size = props.board.length;
  return {
    gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`
  };
});

function getCellClass(cell: Cell): string {
  const isSelected = props.selectedCell?.row === cell.row && props.selectedCell?.col === cell.col;
  const baseClasses = 'bg-white border border-gray-300';
  
  if (cell.isFixed) {
    return `${baseClasses} bg-gray-100 text-gray-800`;
  }
  
  if (isSelected) {
    return `${baseClasses} border-2 border-primary-500 bg-primary-50`;
  }
  
  return `${baseClasses} hover:bg-gray-50`;
}
</script>
