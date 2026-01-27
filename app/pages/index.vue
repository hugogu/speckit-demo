<script setup lang="ts">
import type { BoardSize, Difficulty } from '~/types'
import { useGameStore } from '~/stores/game'

const gameStore = useGameStore()

// Game setup state
const showSetup = ref(true)
const selectedSize = ref<BoardSize>(4)
const selectedDifficulty = ref<Difficulty>('easy')

// Victory modal
const showVictory = ref(false)

// Resume game modal
const showResumePrompt = ref(false)

// Options for selects
const sizeOptions = [
  { value: 4, label: '4×4 (入门)' },
  { value: 6, label: '6×6 (进阶)' },
  { value: 9, label: '9×9 (标准)' },
]

const difficultyOptions = [
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' },
  { value: 'expert', label: '专家' },
]

// Check for saved game on mount
onMounted(() => {
  const hasSavedGame = gameStore.loadSavedGame()
  if (hasSavedGame) {
    showResumePrompt.value = true
    showSetup.value = false
  }
})

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

function resumeSavedGame() {
  showResumePrompt.value = false
  // Game is already loaded
}

function startNewInsteadOfResume() {
  showResumePrompt.value = false
  gameStore.abandonGame()
  showSetup.value = true
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
    <div class="container mx-auto px-4 py-8 max-w-2xl">
      <!-- Header -->
      <header class="text-center mb-8">
        <div class="flex justify-end mb-2">
          <NuxtLink 
            to="/history" 
            class="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            游戏记录
          </NuxtLink>
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold text-indigo-600 mb-2">
          🎮 数独学习游戏
        </h1>
        <p class="text-gray-600">
          选择难度，开始挑战吧！
        </p>
      </header>

      <!-- Setup Screen -->
      <div v-if="showSetup" class="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-6 text-center">
          开始新游戏
        </h2>
        
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              棋盘大小
            </label>
            <UiSelect
              v-model="selectedSize"
              :options="sizeOptions"
              size="lg"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              难度级别
            </label>
            <UiSelect
              v-model="selectedDifficulty"
              :options="difficultyOptions"
              size="lg"
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
          <GameGameTimer
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

      <!-- Resume Prompt Modal -->
      <UiModal
        v-model="showResumePrompt"
        title="发现未完成的游戏"
        size="sm"
        :closable="false"
      >
        <p class="text-gray-600 text-center">
          你有一局未完成的游戏，要继续吗？
        </p>
        
        <template #footer>
          <div class="flex justify-center gap-3">
            <UiButton variant="outline" @click="startNewInsteadOfResume">
              开始新游戏
            </UiButton>
            <UiButton variant="primary" @click="resumeSavedGame">
              继续游戏
            </UiButton>
          </div>
        </template>
      </UiModal>
    </div>
  </div>
</template>
