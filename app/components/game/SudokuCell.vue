<script setup lang="ts">
import type { Cell } from '~/types'

interface Props {
  cell: Cell
  isSelected: boolean
  isHighlighted: boolean
  boardSize: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [row: number, col: number]
}>()

const cellClasses = computed(() => {
  const classes = [
    'flex items-center justify-center',
    'font-bold transition-all duration-200',
    'cursor-pointer select-none',
    'min-w-11 min-h-11', // 44px minimum touch target
  ]
  
  // Size based on board
  if (props.boardSize === 4) {
    classes.push('text-2xl w-14 h-14 sm:w-16 sm:h-16')
  } else if (props.boardSize === 6) {
    classes.push('text-xl w-12 h-12 sm:w-14 sm:h-14')
  } else {
    classes.push('text-lg w-10 h-10 sm:w-12 sm:h-12')
  }
  
  // Background colors
  if (props.isSelected) {
    classes.push('bg-indigo-200')
  } else if (props.isHighlighted) {
    classes.push('bg-indigo-50')
  } else {
    classes.push('bg-white')
  }
  
  // Text colors
  if (props.cell.isPrefilled) {
    classes.push('text-gray-800')
  } else if (props.cell.isCorrect === false) {
    classes.push('text-red-500 animate-shake')
  } else if (props.cell.value !== null) {
    classes.push('text-indigo-600')
  }
  
  // Border
  classes.push('border border-gray-300')
  
  return classes
})

function handleClick() {
  emit('select', props.cell.row, props.cell.col)
}
</script>

<template>
  <div
    :class="cellClasses"
    role="button"
    :aria-label="`单元格 ${cell.row + 1} 行 ${cell.col + 1} 列${cell.value ? '，值为 ' + cell.value : '，空'}`"
    :aria-selected="isSelected"
    tabindex="0"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <span v-if="cell.value" class="transition-transform duration-200">
      {{ cell.value }}
    </span>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>
