<!--
  Home Page - Sudoku Game
  Reference: tasks.md T016, T021
  Reference: spec.md §US1, §US2, §US6 - responsive layout
-->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGameState } from '~/composables/useGameState';
import type { BoardSize, Difficulty } from '~/types/sudoku';

const {
  gameState,
  hasActiveGame,
  currentBoard,
  selectedCell,
  startNewGame,
  selectCell,
  fillNumber,
  clearSelectedCell,
  checkAnswers,
  resetGame,
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

/**
 * Handle cell selection
 * Reference: spec.md §US2
 */
function handleCellSelect(row: number, col: number) {
  selectCell(row, col);
}

/**
 * Handle number selection from pad
 * Reference: spec.md §US2-2
 */
function handleNumberSelect(value: number) {
  fillNumber(value);
}

/**
 * Handle clear from number pad
 * Reference: spec.md §US2-3
 */
function handleClear() {
  clearSelectedCell();
}

// Celebration modal state
const showCelebration = ref(false);

/**
 * Handle check answers
 * Reference: spec.md §US4, §FR-006
 */
function handleCheck() {
  const result = checkAnswers();
  if (result.isComplete) {
    showCelebration.value = true;
  }
}

/**
 * Handle reset game
 */
function handleReset() {
  resetGame();
}

/**
 * Handle print - placeholder for Phase 8
 * Reference: spec.md §US5
 */
function handlePrint() {
  window.print();
}

function handleCloseCelebration() {
  showCelebration.value = false;
}

function handleNewGameFromCelebration() {
  showCelebration.value = false;
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

      <!-- Game Area - Reference: spec.md §US6 responsive layout -->
      <div v-else class="space-y-6">
        <!-- Game Controls - Reference: tasks.md T022, T025 -->
        <GameControls
          @check="handleCheck"
          @reset="handleReset"
          @new-game="handleNewGame"
          @print="handlePrint"
        />
        
        <!-- Game Layout: Board + NumberPad -->
        <!-- Reference: plan.md §响应式布局断点 -->
        <div 
          v-if="currentBoard" 
          class="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6"
        >
          <!-- Sudoku Board -->
          <SudokuBoard
            :board="currentBoard"
            @cell-select="handleCellSelect"
          />

          <!-- Number Pad - shown when cell is selected -->
          <div class="w-full max-w-[200px]">
            <NumberPad
              v-if="selectedCell"
              :size="currentBoard.size"
              @select="handleNumberSelect"
              @clear="handleClear"
            />
            <div v-else class="text-center text-gray-500 text-sm p-4">
              点击空白格子选择数字
            </div>
          </div>
        </div>
      </div>

      <!-- Celebration Modal - Reference: tasks.md T023, spec.md §FR-007 -->
      <CelebrationModal
        :show="showCelebration"
        @close="handleCloseCelebration"
        @new-game="handleNewGameFromCelebration"
      />
    </div>
  </div>
</template>
