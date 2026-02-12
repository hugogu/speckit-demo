<script setup lang="ts">
import type { BoardSize } from '~/types'

interface Props {
  boardSize: BoardSize
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  selectNumber: [value: number]
  clear: []
}>()

// Generate number buttons based on board size
const numbers = computed(() => 
  Array.from({ length: props.boardSize }, (_, i) => i + 1)
)

function handleNumberClick(value: number) {
  if (props.disabled) return
  emit('selectNumber', value)
}

function handleClearClick() {
  if (props.disabled) return
  emit('clear')
}

function handleDragStart(event: DragEvent, value: number) {
  if (props.disabled) return
  event.dataTransfer?.setData('text/plain', value.toString())
}
</script>

<template>
  <div class="grid gap-2" :class="[
    boardSize === 4 ? 'grid-cols-3' : 
    boardSize === 6 ? 'grid-cols-4' : 'grid-cols-5'
  ]">
    <UiButton
      v-for="number in numbers"
      :key="number"
      :disabled="disabled"
      variant="outline"
      size="md"
      class="aspect-square flex items-center justify-center font-bold"
      @click="handleNumberClick(number)"
      @dragstart="handleDragStart($event, number)"
      draggable
    >
      {{ number }}
    </UiButton>
    
    <UiButton
      :disabled="disabled"
      variant="secondary"
      size="md"
      class="aspect-square flex items-center justify-center"
      @click="handleClearClick"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </UiButton>
  </div>
</template>
