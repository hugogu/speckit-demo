<script setup lang="ts">
import { computed } from 'vue';
import type { BoardSize } from '../../types';

const props = defineProps<{
  boardSize: BoardSize;
}>();

const emit = defineEmits<{
  (e: 'select', number: number): void;
}>();

const numbers = computed(() =>
  Array.from({ length: props.boardSize }, (_, i) => i + 1)
);

function handleDragStart(event: DragEvent, number: number): void {
  if (event.dataTransfer) {
    event.dataTransfer.setData('number', String(number));
    event.dataTransfer.effectAllowed = 'copy';
  }
}

function handleClick(number: number): void {
  emit('select', number);
}
</script>

<template>
  <div class="number-selector">
    <button
      v-for="number in numbers"
      :key="number"
      class="number-btn"
      draggable="true"
      @dragstart="handleDragStart($event, number)"
      @click="handleClick(number)"
    >
      {{ number }}
    </button>
  </div>
</template>

<style scoped>
.number-selector {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  max-width: 500px;
  margin: 0 auto;
}

.number-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: white;
  font-size: var(--font-size-lg);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.number-btn:hover {
  background: var(--color-primary-dark);
  transform: scale(1.1);
}

.number-btn:active {
  transform: scale(0.95);
}

@media (max-width: 500px) {
  .number-btn {
    width: 36px;
    height: 36px;
    font-size: var(--font-size-md);
  }
}
</style>
