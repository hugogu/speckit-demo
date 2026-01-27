<script setup lang="ts">
import type { Cell } from '~/types'

interface Props {
  cell: Cell
  isSelected: boolean
  isHighlighted: boolean
  isDragOver: boolean
  boardSize: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [row: number, col: number]
  drop: [row: number, col: number, value: number]
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
  
  // Background colors - drag over takes priority
  if (props.isDragOver && !props.cell.isPrefilled) {
    classes.push('bg-indigo-300 ring-2 ring-indigo-500')
  } else if (props.isSelected) {
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

function handleDragOver(event: DragEvent) {
  if (!props.cell.isPrefilled) {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }
}

function handleDrop(event: DragEvent) {
  if (props.cell.isPrefilled) return
  
  event.preventDefault()
  const value = event.dataTransfer?.getData('text/plain')
  if (value) {
    emit('drop', props.cell.row, props.cell.col, parseInt(value))
  }
}
</script>

<template>
  <div
    :class="cellClasses"
    :data-cell="true"
    :data-row="cell.row"
    :data-col="cell.col"
    role="button"
    :aria-label="`单元格 ${cell.row + 1} 行 ${cell.col + 1} 列${cell.value ? '，值为 ' + cell.value : '，空'}`"
    :aria-selected="isSelected"
    tabindex="0"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
    @dragover="handleDragOver"
    @drop="handleDrop"
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
