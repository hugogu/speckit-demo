<!--
  Game Setup Panel
  Reference: tasks.md T014
  Reference: spec.md §US1 - select difficulty and size, start game
-->
<script setup lang="ts">
import { ref } from 'vue';
import type { BoardSize, Difficulty } from '~/types/sudoku';

const emit = defineEmits<{
  (e: 'start', size: BoardSize, difficulty: Difficulty): void;
}>();

const selectedSize = ref<BoardSize>(9);
const selectedDifficulty = ref<Difficulty>('easy');

function handleStart() {
  emit('start', selectedSize.value, selectedDifficulty.value);
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-md mx-auto">
    <h2 class="text-xl font-semibold text-gray-800 mb-6 text-center">
      选择游戏设置
    </h2>
    
    <div class="space-y-6">
      <SizeSelector v-model="selectedSize" />
      <DifficultySelector v-model="selectedDifficulty" />
      
      <button
        type="button"
        class="btn-success w-full text-lg py-3"
        @click="handleStart"
      >
        开始游戏 🎯
      </button>
    </div>
  </div>
</template>
