<script setup lang="ts">
import { onMounted, ref } from 'vue';
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
const showCelebration = ref(false);
const selectedSize = ref<BoardSize>(9);
const selectedDifficulty = ref<Difficulty>('easy');

const sizeOptions: { value: BoardSize; label: string }[] = [
  { value: 4, label: '4×4 (入门)' },
  { value: 6, label: '6×6 (简单)' },
  { value: 9, label: '9×9 (标准)' },
];

const difficultyOptions: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' },
];

onMounted(() => {
  const hasGame = loadFromStorage();
  if (hasGame && hasActiveGame.value) {
    showSetup.value = false;
  }
});

function handleStartGame() {
  startNewGame(selectedSize.value, selectedDifficulty.value);
  showSetup.value = false;
}

function handleNewGame() {
  showSetup.value = true;
  showCelebration.value = false;
}

function handleCellClick(row: number, col: number) {
  selectCell(row, col);
}

function handleNumberSelect(num: number) {
  fillNumber(num);
}

function handleClear() {
  clearSelectedCell();
}

function handleCheck() {
  const result = checkAnswers();
  if (result.isComplete) {
    showCelebration.value = true;
  }
}

function handleReset() {
  resetGame();
}

function getBoxBorderClasses(row: number, col: number, size: BoardSize): string {
  const classes: string[] = [];
  const boxRows = size === 6 ? 2 : size === 4 ? 2 : 3;
  const boxCols = size === 6 ? 3 : size === 4 ? 2 : 3;
  
  if ((col + 1) % boxCols === 0 && col < size - 1) {
    classes.push('border-r-2 border-r-gray-600');
  }
  if ((row + 1) % boxRows === 0 && row < size - 1) {
    classes.push('border-b-2 border-b-gray-600');
  }
  
  return classes.join(' ');
}

function getCellClasses(row: number, col: number): string {
  if (!currentBoard.value) return 'sudoku-cell';
  
  const cell = currentBoard.value.cells[row][col];
  const classes = ['sudoku-cell'];
  
  if (cell.isPreFilled) {
    classes.push('sudoku-cell--prefilled');
  } else {
    classes.push('sudoku-cell--user');
  }
  
  if (cell.isSelected) {
    classes.push('sudoku-cell--selected');
  }
  
  if (cell.isError) {
    classes.push('sudoku-cell--error');
  }
  
  classes.push(getBoxBorderClasses(row, col, currentBoard.value.size));
  
  return classes.join(' ');
}

function getNumbers(): number[] {
  if (!currentBoard.value) return [];
  return Array.from({ length: currentBoard.value.size }, (_, i) => i + 1);
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <header class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-primary-700 mb-2">
          🎮 数独游戏
        </h1>
        <p class="text-gray-600">适合小学生的数独练习</p>
      </header>

      <!-- 游戏设置 -->
      <div v-if="showSetup" class="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-md mx-auto">
        <h2 class="text-xl font-semibold text-gray-800 mb-6 text-center">选择游戏设置</h2>
        
        <div class="space-y-6">
          <!-- 棋盘大小 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">棋盘大小</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="option in sizeOptions"
                :key="option.value"
                :class="[
                  'btn',
                  selectedSize === option.value ? 'btn-primary' : 'btn-secondary'
                ]"
                @click="selectedSize = option.value"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
          
          <!-- 难度 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">难度</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="option in difficultyOptions"
                :key="option.value"
                :class="[
                  'btn',
                  selectedDifficulty === option.value ? 'btn-primary' : 'btn-secondary'
                ]"
                @click="selectedDifficulty = option.value"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
          
          <!-- 开始按钮 -->
          <button
            class="btn-success w-full text-lg py-3"
            @click="handleStartGame"
          >
            开始游戏 🎯
          </button>
        </div>
      </div>

      <!-- 游戏界面 -->
      <div v-else class="space-y-6">
        <!-- 控制按钮 -->
        <div class="flex flex-wrap justify-center gap-3 no-print">
          <button class="btn-secondary" @click="handleNewGame">新游戏</button>
          <button class="btn-primary" @click="handleCheck">检查答案</button>
          <button class="btn-secondary" @click="handleReset">重置</button>
          <button class="btn-secondary" @click="window.print()">打印</button>
        </div>

        <!-- 数独棋盘 -->
        <div v-if="currentBoard" class="flex justify-center">
          <div
            class="grid bg-white rounded-lg shadow-lg border-2 border-gray-600 overflow-hidden"
            :style="{ 
              gridTemplateColumns: `repeat(${currentBoard.size}, minmax(0, 1fr))`,
              width: currentBoard.size === 4 ? '200px' : currentBoard.size === 6 ? '280px' : '360px'
            }"
          >
            <template v-for="(row, rowIdx) in currentBoard.cells" :key="rowIdx">
              <button
                v-for="(cell, colIdx) in row"
                :key="`${rowIdx}-${colIdx}`"
                :class="getCellClasses(rowIdx, colIdx)"
                :aria-label="`行 ${Number(rowIdx) + 1}, 列 ${Number(colIdx) + 1}, ${cell.value || '空'}`"
                :disabled="cell.isPreFilled"
                @click="handleCellClick(rowIdx, colIdx)"
              >
                {{ cell.value || '' }}
              </button>
            </template>
          </div>
        </div>

        <!-- 数字选择面板 -->
        <div v-if="selectedCell" class="flex justify-center no-print">
          <div class="bg-white rounded-lg shadow-lg p-4">
            <p class="text-sm text-gray-600 mb-3 text-center">选择数字</p>
            <div class="flex flex-wrap justify-center gap-2">
              <button
                v-for="num in getNumbers()"
                :key="num"
                class="btn-primary w-12 h-12 text-xl"
                @click="handleNumberSelect(num)"
              >
                {{ num }}
              </button>
              <button
                class="btn-secondary w-12 h-12 text-xl"
                @click="handleClear"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 庆祝弹窗 -->
      <div
        v-if="showCelebration"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 text-center">
          <div class="text-6xl mb-4">🎉</div>
          <h2 class="text-2xl font-bold text-primary-700 mb-2">太棒了！</h2>
          <p class="text-gray-600 mb-6">你成功完成了这个数独游戏！</p>
          <button class="btn-success w-full" @click="handleNewGame">
            再来一局
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
