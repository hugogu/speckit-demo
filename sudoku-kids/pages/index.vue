<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <div class="max-w-4xl w-full">
      <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">Sudoku Kids</h1>
      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="mb-6">
          <h2 class="text-2xl font-semibold mb-4">Select Difficulty</h2>
          <div class="grid grid-cols-3 gap-4">
            <button
              v-for="level in ['easy', 'medium', 'hard']"
              :key="level"
              @click="selectDifficulty(level)"
              class="p-4 rounded-lg border-2 border-blue-500 hover:bg-blue-50 transition-colors"
              :class="{ 'bg-blue-500 text-white': selectedDifficulty === level }"
            >
              {{ level.charAt(0).toUpperCase() + level.slice(1) }}
            </button>
          </div>
        </div>

        <div class="mb-6">
          <h2 class="text-2xl font-semibold mb-4">Select Board Size</h2>
          <div class="grid grid-cols-3 gap-4">
            <button
              v-for="size in [4, 6, 9]"
              :key="size"
              @click="selectSize(size)"
              class="p-4 rounded-lg border-2 border-blue-500 hover:bg-blue-50 transition-colors"
              :class="{ 'bg-blue-500 text-white': selectedSize === size }"
            >
              {{ size }}×{{ size }}
            </button>
          </div>
        </div>

        <div class="text-center">
          <button
            @click="startGame"
            :disabled="!selectedDifficulty || !selectedSize"
            class="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedDifficulty = ref<'easy' | 'medium' | 'hard' | null>(null)
const selectedSize = ref<4 | 6 | 9 | null>(null)

function selectDifficulty(level: string) {
  if (level === 'easy' || level === 'medium' || level === 'hard') {
    selectedDifficulty.value = level
  }
}

function selectSize(size: number) {
  if (size === 4 || size === 6 || size === 9) {
    selectedSize.value = size
  }
}

function startGame() {
  if (!selectedDifficulty.value || !selectedSize.value) return
  // TODO: Navigate to play page with selected difficulty and size
  console.log('Starting game:', { difficulty: selectedDifficulty.value, size: selectedSize.value })
}
</script>
