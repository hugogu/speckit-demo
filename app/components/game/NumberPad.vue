<script setup lang="ts">
import type { BoardSize } from '~/types'
import { useDragAndDrop } from '~/composables/useDragAndDrop'

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

const { startDrag, handleTouchStart, handleTouchMove, handleTouchEnd, endDrag } = useDragAndDrop()

const numbers = computed(() => {
  return Array.from({ length: props.boardSize }, (_, i) => i + 1)
})

function handleNumberClick(num: number) {
  if (!props.disabled) {
    emit('selectNumber', num)
  }
}

function handleClear() {
  if (!props.disabled) {
    emit('clear')
  }
}

function handleDragStart(event: DragEvent, num: number) {
  if (!props.disabled) {
    startDrag(event, num)
  }
}

function handleDragEnd() {
  endDrag()
}

function onTouchStart(event: TouchEvent, num: number) {
  if (!props.disabled) {
    handleTouchStart(event, num)
  }
}

function onTouchMove(event: TouchEvent) {
  handleTouchMove(event)
}

function onTouchEnd(event: TouchEvent) {
  const result = handleTouchEnd(event)
  if (result) {
    // Emit event for parent to handle
    emit('selectNumber', result.value)
  }
}
</script>

<template>
  <div class="flex flex-wrap justify-center gap-2">
    <button
      v-for="num in numbers"
      :key="num"
      :disabled="disabled"
      draggable="true"
      class="w-12 h-12 sm:w-14 sm:h-14 min-w-11 min-h-11 flex items-center justify-center
             text-xl font-bold rounded-lg
             bg-indigo-100 text-indigo-700 
             hover:bg-indigo-200 active:bg-indigo-300
             disabled:opacity-50 disabled:cursor-not-allowed
             transition-colors duration-150 cursor-grab active:cursor-grabbing"
      @click="handleNumberClick(num)"
      @dragstart="handleDragStart($event, num)"
      @dragend="handleDragEnd"
      @touchstart.passive="onTouchStart($event, num)"
      @touchmove.passive="onTouchMove"
      @touchend="onTouchEnd"
    >
      {{ num }}
    </button>
    <button
      :disabled="disabled"
      class="w-12 h-12 sm:w-14 sm:h-14 min-w-11 min-h-11 flex items-center justify-center
             text-lg font-medium rounded-lg
             bg-gray-100 text-gray-600
             hover:bg-gray-200 active:bg-gray-300
             disabled:opacity-50 disabled:cursor-not-allowed
             transition-colors duration-150"
      aria-label="清除"
      @click="handleClear"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
      </svg>
    </button>
  </div>
</template>
