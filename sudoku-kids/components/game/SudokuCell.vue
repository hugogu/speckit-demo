<script setup lang="ts">
import type { Cell } from '~/types/sudoku';

interface Props {
  cell: Cell;
  isDropTarget?: boolean;
  boxBorderRight?: boolean;
  boxBorderBottom?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isDropTarget: false,
  boxBorderRight: false,
  boxBorderBottom: false,
});

const emit = defineEmits<{
  (e: 'click'): void;
  (e: 'drop', event: DragEvent): void;
  (e: 'dragover', event: DragEvent): void;
  (e: 'dragleave'): void;
}>();

const cellClasses = computed(() => {
  const classes = [
    'sudoku-cell',
    'flex items-center justify-center',
    'min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px]',
    'text-xl sm:text-2xl font-bold',
    'border border-gray-300',
    'transition-all duration-150',
    'select-none',
  ];

  if (props.cell.isPreFilled) {
    classes.push('bg-gray-100 text-gray-700 cursor-default');
  } else {
    classes.push('bg-white text-primary-600 cursor-pointer hover:bg-primary-50');
  }

  if (props.cell.isSelected) {
    classes.push('bg-primary-100 ring-2 ring-primary-500');
  }

  if (props.cell.isError) {
    classes.push('bg-error-50 text-error-600 ring-2 ring-error-500');
  }

  if (props.isDropTarget) {
    classes.push('bg-primary-200 ring-2 ring-primary-400');
  }

  if (props.boxBorderRight) {
    classes.push('border-r-2 border-r-gray-600');
  }

  if (props.boxBorderBottom) {
    classes.push('border-b-2 border-b-gray-600');
  }

  return classes;
});

function handleDragOver(event: DragEvent) {
  if (!props.cell.isPreFilled) {
    event.preventDefault();
    emit('dragover', event);
  }
}

function handleDrop(event: DragEvent) {
  if (!props.cell.isPreFilled) {
    event.preventDefault();
    emit('drop', event);
  }
}
</script>

<template>
  <button
    :class="cellClasses"
    :disabled="cell.isPreFilled"
    :aria-label="`行 ${cell.row + 1}, 列 ${cell.col + 1}, ${cell.value || '空'}`"
    role="gridcell"
    :tabindex="cell.isPreFilled ? -1 : 0"
    @click="emit('click')"
    @dragover="handleDragOver"
    @drop="handleDrop"
    @dragleave="emit('dragleave')"
  >
    {{ cell.value || '' }}
  </button>
</template>
