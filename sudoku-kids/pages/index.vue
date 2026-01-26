<!--
  Home Page - Sudoku Game
  Reference: tasks.md T016
  Reference: spec.md §US1, §US6 - responsive layout
-->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGameState } from '~/composables/useGameState';
import type { BoardSize, Difficulty } from '~/types/sudoku';

const {
  hasActiveGame,
  currentBoard,
  startNewGame,
  loadFromStorage,
} = useGameState();

const showSetup = ref(true);

// Load saved game on mount per spec.md §FR-014
onMounted(() => {
  const hasGame = loadFromStorage();
  if (hasGame && hasActiveGame.value) {
    showSetup.value = false;
  }
});

function handleStartGame(size: BoardSize, difficulty: Difficulty) {
  startNewGame(size, difficulty);
  showSetup.value = false;
}

function handleNewGame() {
  showSetup.value = true;
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <header class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-primary-700 mb-2">
          🎮 数独游戏
        </h1>
        <p class="text-gray-600">适合小学生的数独练习</p>
      </header>

      <!-- Game Setup - shown when no active game -->
      <GameSetup 
        v-if="showSetup" 
        @start="handleStartGame" 
      />

      <!-- Game Board placeholder - will be implemented in Phase 4 -->
      <div v-else class="space-y-6">
        <div class="flex justify-center gap-3 no-print">
          <button class="btn-secondary" @click="handleNewGame">
            新游戏
          </button>
        </div>
        
        <div v-if="currentBoard" class="bg-white rounded-2xl shadow-lg p-6 text-center">
          <p class="text-gray-600 mb-4">
            棋盘大小: {{ currentBoard.size }}×{{ currentBoard.size }} | 
            游戏已生成
          </p>
          <p class="text-sm text-gray-400">
            棋盘 UI 将在 Phase 4 (US2) 中实现...
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
