<!--
  Number Pad Component
  Reference: tasks.md T018
  Reference: spec.md §US2-1 - show number selection panel (1-9 or 1-4/1-6)
  Reference: spec.md §NFR-004 - touch-friendly layout
-->
<script setup lang="ts">
import type { BoardSize } from '~/types/sudoku';
import { getNumberRange } from '~/types/sudoku';

interface Props {
  size: BoardSize;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'select', value: number): void;
  (e: 'clear'): void;
}>();

/**
 * Generate number options based on board size
 * Reference: spec.md §FR-001 Clarification
 * - 4×4: 1-4
 * - 6×6: 1-6
 * - 9×9: 1-9
 */
const numbers = computed(() => getNumberRange(props.size));

/**
 * Grid columns based on board size for optimal layout
 */
const gridCols = computed(() => {
  switch (props.size) {
    case 4: return 'grid-cols-4';
    case 6: return 'grid-cols-3';
    case 9: return 'grid-cols-5';
  }
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-4">
    <p class="text-sm text-gray-600 mb-3 text-center font-medium">
      选择数字
    </p>
    <div :class="['grid gap-2', gridCols]">
      <button
        v-for="num in numbers"
        :key="num"
        type="button"
        class="btn-primary aspect-square text-xl font-bold"
        :aria-label="`填入数字 ${num}`"
        @click="emit('select', num)"
      >
        {{ num }}
      </button>
      <!-- Clear button -->
      <button
        type="button"
        class="btn-secondary aspect-square text-xl"
        aria-label="清除数字"
        @click="emit('clear')"
      >
        ✕
      </button>
    </div>
  </div>
</template>
