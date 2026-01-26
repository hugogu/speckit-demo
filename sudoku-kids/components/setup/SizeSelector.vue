<!--
  Board Size Selector Component
  Reference: tasks.md T013
  Reference: spec.md §FR-001 - 4×4, 6×6, 9×9 board sizes
  Reference: spec.md §FR-001 Clarification - box dimensions
-->
<script setup lang="ts">
import type { BoardSize } from '~/types/sudoku';

interface Props {
  modelValue: BoardSize;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: BoardSize): void;
}>();

const options: { value: BoardSize; label: string; description: string }[] = [
  { value: 4, label: '4×4', description: '入门级' },
  { value: 6, label: '6×6', description: '简单版' },
  { value: 9, label: '9×9', description: '标准版' },
];
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-3">
      棋盘大小
    </label>
    <div class="grid grid-cols-3 gap-3">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        :class="[
          'btn',
          'flex flex-col items-center justify-center py-3',
          modelValue === option.value 
            ? 'btn-primary' 
            : 'btn-secondary'
        ]"
        :aria-pressed="modelValue === option.value"
        @click="emit('update:modelValue', option.value)"
      >
        <span class="font-semibold">{{ option.label }}</span>
        <span class="text-xs opacity-75 mt-1">{{ option.description }}</span>
      </button>
    </div>
  </div>
</template>
