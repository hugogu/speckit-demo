<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value: number;
  isPrefilled: boolean;
  isCorrect: boolean;
  gameStatus: string;
  row: number;
  col: number;
}>();

const cellClass = computed(() => {
  const classes = ['cell'];

  if (props.isPrefilled) {
    classes.push('prefilled');
  } else if (props.value !== 0) {
    classes.push('user-filled');
    if (props.isCorrect) {
      classes.push('correct');
    }
  }

  return classes.join(' ');
});
</script>

<template>
  <div :class="cellClass">
    {{ value !== 0 ? value : '' }}
  </div>
</template>

<style scoped>
.cell {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(16px, 4vw, 28px);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.prefilled {
  background: var(--color-cell-prefilled);
  color: white;
  font-weight: 600;
}

.user-filled {
  background: var(--color-cell-user-filled);
  color: white;
}

.correct {
  background: var(--color-success);
}

@media (max-width: 400px) {
  .cell {
    font-size: 14px;
  }
}
</style>
