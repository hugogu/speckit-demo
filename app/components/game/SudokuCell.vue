<script setup lang="ts">
import type { Cell, BoardSize } from '~/types'

interface Props {
  cell: Cell
  boardSize: BoardSize
  isSelected: boolean
  isHighlighted: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: []
  drop: [value: number]
}>()

// Calculate cell size based on board size
const cellSizeClass = computed(() => {
  switch (props.boardSize) {
    case 4: return 'w-12 h-12 text-xl'
    case 6: return 'w-10 h-10 text-lg'
    case 9: return 'w-8 h-8 text-base'
    default: return 'w-8 h-8 text-base'
  }
})

// Calculate border classes for box boundaries
const borderClasses = computed(() => {
  const { row, col } = props.cell
  const size = props.boardSize
  const classes: string[] = []
  
  // Right border (thick if at box boundary)
  if ((col + 1) % (size === 6 ? 3 : 3) === 0 && col < size - 1) {
    classes.push('border-r-2 border-gray-800')
  } else {
    classes.push('border-r border-gray-300')
  }
  
  // Bottom border (thick if at box boundary)
  if ((row + 1) % (size === 6 ? 2 : 3) === 0 && row < size - 1) {
    classes.push('border-b-2 border-gray-800')
  } else {
    classes.push('border-b border-gray-300')
  }
  
  // Left and top borders (always thin)
  if (col === 0) classes.push('border-l border-gray-800')
  if (row === 0) classes.push('border-t border-gray-800')
  
  return classes
})

function handleClick() {
  emit('select')
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  const data = event.dataTransfer?.getData('text/plain')
  if (data) {
    const value = parseInt(data)
    if (!isNaN(value) && value >= 1 && value <= props.boardSize) {
      emit('drop', value)
    }
  }
}
</script>

<template>
  <div
    :class="[
      'flex items-center justify-center font-bold transition-colors',
      'cursor-pointer select-none',
      cellSizeClass,
      borderClasses,
      {
        'bg-indigo-100': isSelected,
        'bg-yellow-100': isHighlighted,
        'text-gray-900': cell.value !== null,
        'text-gray-400': cell.isPrefilled,
        'text-red-500': cell.isCorrect === false,
        'bg-gray-50': cell.value === null && !isSelected && !isHighlighted,
      }
    ]"
    @click="handleClick"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    {{ cell.value }}
  </div>
</template>
