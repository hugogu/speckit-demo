<!--
  Sudoku Cell Component
  Reference: tasks.md T017
  Reference: spec.md §US2 - click to fill, §FR-005 - distinguish pre-filled
  Reference: spec.md §FR-011 - keyboard accessible
  Reference: spec.md §NFR-004 - touch target ≥44×44px
-->
<script setup lang="ts">
import type { Cell } from '~/types/sudoku';

interface Props {
  cell: Cell;
  boxBorderRight?: boolean;
  boxBorderBottom?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  boxBorderRight: false,
  boxBorderBottom: false,
});

const emit = defineEmits<{
  (e: 'select'): void;
}>();

/**
 * Cell styling based on state
 * Reference: spec.md §FR-005 - visual distinction
 * Reference: spec.md §US4-1 - error marking with friendly visual hint
 */
const cellClasses = computed(() => {
  const classes = [
    'flex items-center justify-center',
    'min-w-[36px] min-h-[36px]',
    'sm:min-w-[40px] sm:min-h-[40px]',
    'md:min-w-[44px] md:min-h-[44px]',
    'text-lg sm:text-xl md:text-2xl font-bold',
    'border border-gray-300',
    'transition-all duration-150',
    'select-none',
  ];

  // Pre-filled vs user-filled per spec.md §FR-005
  if (props.cell.isPreFilled) {
    classes.push('bg-gray-100 text-gray-700 cursor-default');
  } else {
    classes.push('bg-white text-primary-600 cursor-pointer hover:bg-primary-50');
  }

  // Selected state
  if (props.cell.isSelected) {
    classes.push('ring-2 ring-primary-500 bg-primary-100');
  }

  // Error state per spec.md §US4-1 - friendly visual hint
  if (props.cell.isError) {
    classes.push('bg-red-50 text-red-600 ring-2 ring-red-400');
  }

  // Box borders for sudoku grid structure
  if (props.boxBorderRight) {
    classes.push('border-r-2 border-r-gray-600');
  }
  if (props.boxBorderBottom) {
    classes.push('border-b-2 border-b-gray-600');
  }

  return classes;
});

function handleClick() {
  // Pre-filled cells cannot be edited per spec.md §US2-4
  if (!props.cell.isPreFilled) {
    emit('select');
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
}
</script>

<template>
  <button
    type="button"
    :class="cellClasses"
    :disabled="cell.isPreFilled"
    :aria-label="`行 ${cell.row + 1}, 列 ${cell.col + 1}, ${cell.value || '空'}`"
    :aria-pressed="cell.isSelected"
    role="gridcell"
    :tabindex="cell.isPreFilled ? -1 : 0"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    {{ cell.value || '' }}
  </button>
</template>
