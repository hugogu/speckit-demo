<!--
  Difficulty Selector Component
  Reference: tasks.md T012
  Reference: spec.md §FR-002 - 3 difficulty levels
  Reference: spec.md §NFR-004 - touch target ≥44×44px
-->
<script setup lang="ts">
import type { Difficulty } from '~/types/sudoku';

interface Props {
  modelValue: Difficulty;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Difficulty): void;
}>();

const options: { value: Difficulty; label: string; description: string }[] = [
  { value: 'easy', label: '简单', description: '适合初学者' },
  { value: 'medium', label: '中等', description: '有一定挑战' },
  { value: 'hard', label: '困难', description: '高手挑战' },
];
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-3">
      选择难度
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
