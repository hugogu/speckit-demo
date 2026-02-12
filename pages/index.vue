<script setup lang="ts">
import type { BoardSize, Difficulty } from '~/types'
import { useGameStore } from '~/stores/game'
import { useSettingsStore } from '~/stores/settings'
import { onMounted } from 'vue'

const gameStore = useGameStore()
const settingsStore = useSettingsStore()

// Game setup state
const showSetup = ref(true)
const showVictory = ref(false)
const selectedSize = ref<BoardSize>(4)
const selectedDifficulty = ref<Difficulty>('easy')

// Load settings on mount
onMounted(() => {
  settingsStore.loadSettings()
  // Set default values from settings
  selectedSize.value = settingsStore.settings.defaultBoardSize
  selectedDifficulty.value = settingsStore.settings.defaultDifficulty
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
          
          <div class="flex gap-3">
            <UiButton
              variant="primary"
              size="lg"
              class="flex-1"
              @click="startGame"
            >
              开始游戏
            </UiButton>
            
            <UiButton
              variant="outline"
              size="lg"
              @click="$router.push('/settings')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </UiButton>
            
            <UiButton
              variant="outline"
              size="lg"
              @click="$router.push('/print')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </UiButton>
            
            <UiButton
              variant="outline"
              size="lg"
              @click="$router.push('/history')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </UiButton>
          </div>
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
        <GameControls
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
