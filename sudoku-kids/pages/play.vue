<template>
  <div v-if="gameStore.currentSession" class="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="rounded-lg bg-primary-100 px-4 py-2">
          <span class="text-sm text-primary-700">难度:</span>
          <span class="ml-1 font-semibold text-primary-900">{{ difficultyLabel }}</span>
        </div>
        <div class="rounded-lg bg-gray-100 px-4 py-2">
          <span class="text-sm text-gray-700">错误:</span>
          <span class="ml-1 font-semibold text-gray-900">{{ gameStore.currentSession.errorCount }}</span>
        </div>
      </div>
      <Timer :is-running="true" />
    </div>

    <div class="mb-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <SudokuBoard
        :board="currentBoard"
        :selected-cell="selectedCell"
        @select-cell="selectCell"
        @input="handleCellInput"
      />
    </div>

    <div class="flex justify-center">
      <NumberPad
        :selected-number="selectedNumber"
        :board-size="gameStore.currentSession.boardSize"
        @select="selectNumber"
        @drag-start="onDragStart"
      />
    </div>
  </div>

  <div v-else class="flex h-64 items-center justify-center">
    <p class="text-lg text-gray-500">没有正在进行的游戏，<NuxtLink to="/" class="text-primary-600 hover:underline">返回首页开始</NuxtLink></p>
  </div>
</template>

<script setup lang="ts">
import type { Cell } from '~/types/sudoku';

const gameStore = useGameStore();

const selectedCell = ref<{ row: number; col: number } | null>(null);
const selectedNumber = ref<number | null>(null);
const draggedNumber = ref<number | null>(null);

const difficultyLabel = computed(() => {
  const labels: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  };
  return labels[gameStore.currentSession?.difficulty ?? 'easy'];
});

const currentBoard = computed(() => {
  if (!gameStore.currentSession) return [];

  const board = gameStore.currentSession.initialBoard.map((row, rowIndex) =>
    row.map((value, colIndex) => ({
      row: rowIndex,
      col: colIndex,
      value: value || getInputValue(rowIndex, colIndex),
      isFixed: value !== 0,
      isValid: null
    }))
  );

  return board;
});

function getInputValue(row: number, col: number): number | null {
  const input = gameStore.currentSession?.userInputs.find(
    i => i.row === row && i.col === col && i.isCorrect
  );
  return input?.value ?? null;
}

function selectCell(row: number, col: number) {
  selectedCell.value = { row, col };

  if (selectedNumber.value !== null) {
    handleCellInput(row, col, selectedNumber.value);
  }
}

function selectNumber(num: number) {
  selectedNumber.value = num;
}

function onDragStart(num: number) {
  draggedNumber.value = num;
}

function handleCellInput(row: number, col: number, value: number) {
  if (!gameStore.currentSession) return;

  const { validateInput } = useSudoku();
  const result = validateInput(gameStore.currentSession, row, col, value);

  gameStore.updateCell(row, col, result.isCorrect ? value : null);

  if (!result.isCorrect) {
    gameStore.incrementError();
    playBounceAnimation(row, col);
  }

  if (result.isCompleted) {
    gameStore.completeGame(0);
    navigateTo('/history');
  }

  selectedNumber.value = null;
}

function playBounceAnimation(row: number, col: number) {
  const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  if (cell) {
    cell.classList.add('animate-bounce-short');
    setTimeout(() => cell.classList.remove('animate-bounce-short'), 800);
  }
}
</script>
