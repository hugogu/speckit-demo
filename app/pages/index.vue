<script setup lang="ts">
import type { BoardSize, Difficulty } from '~/types'
import { useGameStore } from '~/stores/game'

const gameStore = useGameStore()

// Game setup state
const showSetup = ref(true)
const showVictory = ref(false)
const selectedSize = ref<BoardSize>(4)
const selectedDifficulty = ref<Difficulty>('easy')

// Watch for game completion
watch(() => gameStore.isCompleted, (completed) => {
  if (completed) {
    showVictory.value = true
  }
})

function startGame() {
  gameStore.startNewGame(selectedSize.value, selectedDifficulty.value)
  showSetup.value = false
}

function handleNewGame() {
  showSetup.value = true
  showVictory.value = false
  gameStore.abandonGame()
}

function handleCellSelect(row: number, col: number) {
  gameStore.selectCell(row, col)
}

function handleNumberSelect(value: number) {
  gameStore.placeNumber(value)
}

function handleDropNumber(row: number, col: number, value: number) {
  // Select the cell first, then place the number
  gameStore.selectCell(row, col)
  gameStore.placeNumber(value)
}

function handleClear() {
  gameStore.clearCell()
}

function handlePause() {
  gameStore.pauseGame()
}

function handleResume() {
  gameStore.resumeGame()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <header class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">数独学习游戏</h1>
        <p class="text-gray-600">选择棋盘大小和难度开始游戏</p>
      </header>
      
      <!-- Game Setup -->
      <div v-if="showSetup" class="bg-white rounded-xl shadow p-6 mb-8">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">棋盘大小</label>
            <UiSelect
              v-model="selectedSize"
              :options="[
                { value: 4, label: '4×4 (入门)' },
                { value: 6, label: '6×6 (进阶)' },
                { value: 9, label: '9×9 (标准)' }
              ]"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">难度级别</label>
            <UiSelect
              v-model="selectedDifficulty"
              :options="[
                { value: 'easy', label: '简单' },
                { value: 'medium', label: '中等' },
                { value: 'hard', label: '困难' },
                { value: 'expert', label: '专家' }
              ]"
            />
          </div>
          
          <UiButton
            variant="primary"
            size="lg"
            class="w-full"
            @click="startGame"
          >
            开始游戏
          </UiButton>
        </div>
      </div>
      
      <!-- Game Screen -->
      <div v-else-if="gameStore.board" class="space-y-6">
        <!-- Game Info Bar -->
        <div class="bg-white rounded-xl shadow p-4 flex flex-wrap items-center justify-between gap-4">
          <GameTimer
            :time="gameStore.formattedTime"
            :is-paused="gameStore.isPaused"
          />
          
          <div class="flex items-center gap-4 text-sm">
            <span class="text-gray-600">
              错误: <span class="font-bold text-orange-500">{{ gameStore.errorCount }}</span>
            </span>
            <span class="text-gray-600">
              步数: <span class="font-bold text-indigo-600">{{ gameStore.moveCount }}</span>
            </span>
          </div>
        </div>
        
        <!-- Game Board -->
        <div class="flex justify-center">
          <GameSudokuBoard
            :board="gameStore.board"
            :selected-cell="gameStore.selectedCell"
            :highlighted-cells="gameStore.highlightedCells"
            @select-cell="handleCellSelect"
            @drop-number="handleDropNumber"
          />
        </div>
        
        <!-- Number Pad -->
        <div class="bg-white rounded-xl shadow p-4">
          <GameNumberPad
            :board-size="gameStore.boardSize!"
            :disabled="gameStore.isPaused || !gameStore.selectedCell || gameStore.selectedCellData?.isPrefilled"
            @select-number="handleNumberSelect"
            @clear="handleClear"
          />
        </div>
        
        <!-- Game Controls -->
        <GameGameControls
          :is-playing="gameStore.isPlaying"
          :is-paused="gameStore.isPaused"
          @new-game="handleNewGame"
          @pause="handlePause"
          @resume="handleResume"
        />
      </div>
      
      <!-- Victory Modal -->
      <GameVictoryModal
        v-model="showVictory"
        :time="gameStore.formattedTime"
        :error-count="gameStore.errorCount"
        :move-count="gameStore.moveCount"
        :difficulty="gameStore.difficulty || 'easy'"
        :board-size="gameStore.boardSize || 4"
        @new-game="handleNewGame"
      />
    </div>
  </div>
</template>
