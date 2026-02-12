<template>
  <div class="flex flex-wrap justify-center gap-2">
    <button
      v-for="num in numbers"
      :key="num"
      :class="[
        'flex h-12 w-12 items-center justify-center rounded-lg text-xl font-bold shadow-md transition-all sm:h-14 sm:w-14 sm:text-2xl',
        selectedNumber === num
          ? 'bg-primary-500 text-white'
          : 'bg-white text-gray-800 hover:bg-gray-50'
      ]"
      draggable="true"
      @click="$emit('select', num)"
      @dragstart="$emit('drag-start', num)"
    >
      {{ num }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  selectedNumber: number | null;
  boardSize: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  select: [num: number];
  'drag-start': [num: number];
}>();

const numbers = computed(() => {
  return Array.from({ length: props.boardSize }, (_, i) => i + 1);
});
</script>
