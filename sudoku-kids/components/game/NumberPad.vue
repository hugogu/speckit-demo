<script setup lang="ts">
import type { BoardSize } from '~/types/sudoku';

interface Props {
  size: BoardSize;
  enableDrag?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  enableDrag: true,
});

const emit = defineEmits<{
  (e: 'select', value: number): void;
  (e: 'clear'): void;
  (e: 'dragStart', value: number, event: DragEvent): void;
  (e: 'dragEnd'): void;
}>();

const numbers = computed(() => 
  Array.from({ length: props.size }, (_, i) => i + 1)
);

function handleDragStart(num: number, event: DragEvent) {
  if (props.enableDrag) {
    emit('dragStart', num, event);
  }
}

function handleDragEnd() {
  emit('dragEnd');
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg p-4">
    <p class="text-sm text-gray-600 mb-3 text-center">选择数字</p>
    <div class="flex flex-wrap justify-center gap-2">
      <button
        v-for="num in numbers"
        :key="num"
        class="btn-primary w-12 h-12 text-xl cursor-pointer"
        :draggable="enableDrag"
        @click="emit('select', num)"
        @dragstart="handleDragStart(num, $event)"
        @dragend="handleDragEnd"
      >
        {{ num }}
      </button>
      <button
        class="btn-secondary w-12 h-12 text-xl"
        @click="emit('clear')"
      >
        ✕
      </button>
    </div>
    <p v-if="enableDrag" class="text-xs text-gray-400 mt-3 text-center">
      点击或拖拽数字到格子
    </p>
  </div>
</template>
