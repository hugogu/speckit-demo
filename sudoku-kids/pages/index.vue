<template>
  <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8 text-center">
      <h1 class="mb-4 text-4xl font-bold text-gray-900">数独学习游戏</h1>
      <p class="text-lg text-gray-600">选择难度和面板大小，开始你的数独之旅！</p>
    </div>

    <BaseCard class="mb-6">
      <h2 class="mb-4 text-2xl font-bold text-gray-900">选择难度</h2>
      <div class="grid grid-cols-3 gap-4">
        <button
          v-for="diff in difficulties"
          :key="diff.value"
          :class="[
            'rounded-lg border-2 px-4 py-4 text-lg font-semibold transition-all',
            selectedDifficulty === diff.value
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-gray-50'
          ]"
          @click="gameStore.setDifficulty(diff.value)"
        >
          <div class="mb-1">{{ diff.label }}</div>
          <div class="text-sm font-normal text-gray-500">{{ diff.description }}</div>
        </button>
      </div>
    </BaseCard>

    <BaseCard class="mb-6">
      <h2 class="mb-4 text-2xl font-bold text-gray-900">选择面板大小</h2>
      <div class="grid grid-cols-3 gap-4">
        <button
          v-for="size in sizes"
          :key="size.value"
          :class="[
            'rounded-lg border-2 px-4 py-4 text-lg font-semibold transition-all',
            selectedSize === size.value
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-gray-50'
          ]"
          @click="gameStore.setBoardSize(size.value)"
        >
          <div class="mb-1">{{ size.label }}</div>
          <div class="text-sm font-normal text-gray-500">{{ size.description }}</div>
        </button>
      </div>
    </BaseCard>

    <div class="flex justify-center">
      <BaseButton size="lg" :disabled="gameStore.isLoading" @click="startGame">
        <span v-if="gameStore.isLoading">生成游戏中...</span>
        <span v-else>开始游戏</span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Difficulty, BoardSize } from '~/types/sudoku';

const gameStore = useGameStore();

const { selectedDifficulty, selectedSize, isLoading } = storeToRefs(gameStore);

const difficulties = [
  { value: 'easy' as Difficulty, label: '简单', description: '预填50%以上，轻松入门' },
  { value: 'medium' as Difficulty, label: '中等', description: '预填35-50%，适度挑战' },
  { value: 'hard' as Difficulty, label: '困难', description: '预填35%以下，考验技巧' }
];

const sizes = [
  { value: 4 as BoardSize, label: '4×4', description: '2×2宫格，简单入门' },
  { value: 6 as BoardSize, label: '6×6', description: '2×3宫格，进阶练习' },
  { value: 9 as BoardSize, label: '9×9', description: '3×3宫格，经典挑战' }
];

async function startGame() {
  await gameStore.startNewGame();
}
</script>
