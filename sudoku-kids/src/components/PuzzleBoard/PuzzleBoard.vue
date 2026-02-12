<script setup lang="ts">
import { computed } from 'vue';
import type { Puzzle, GameStatus } from '../../types';
import Cell from '../Cell/Cell.vue';

const props = defineProps<{
  puzzle: Puzzle;
  gameStatus: GameStatus;
}>();

const emit = defineEmits<{
  (e: 'cell-click', row: number, col: number): void;
  (e: 'cell-drop', row: number, col: number, number: number): void;
}>();

const boardStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.puzzle.boardSize}, 1fr)`,
  gridTemplateRows: `repeat(${props.puzzle.boardSize}, 1fr)`,
}));

function getCellClass(row: number, col: number): string {
  const classes = ['cell-container'];

  const boxSize = Math.sqrt(props.puzzle.boardSize);

  if (col < props.puzzle.boardSize - 1) {
    if ((col + 1) % boxSize === 0 && col !== props.puzzle.boardSize - 1) {
      classes.push('border-right-thick');
    } else {
      classes.push('border-right');
    }
  }

  if (row < props.puzzle.boardSize - 1) {
    if ((row + 1) % boxSize === 0 && row !== props.puzzle.boardSize - 1) {
      classes.push('border-bottom-thick');
    } else {
      classes.push('border-bottom');
    }
  }

  return classes.join(' ');
}

function handleCellClick(row: number, col: number): void {
  if (props.gameStatus === 'playing') {
    emit('cell-click', row, col);
  }
}

function handleCellDrop(row: number, col: number, number: number): void {
  if (props.gameStatus === 'playing') {
    emit('cell-drop', row, col, number);
  }
}
</script>

<template>
  <div class="puzzle-board" :style="boardStyle">
    <template v-for="(row, rowIndex) in puzzle.currentBoard" :key="rowIndex">
      <div
        v-for="(cellValue, colIndex) in row"
        :key="`${rowIndex}-${colIndex}`"
        :class="getCellClass(rowIndex, colIndex)"
        @click="handleCellClick(rowIndex, colIndex)"
        @dragover.prevent
        @drop="handleCellDrop(rowIndex, colIndex, Number($event.dataTransfer?.getData('number')) || 0)"
      >
        <Cell
          :value="cellValue"
          :is-prefilled="puzzle.initialBoard[rowIndex][colIndex] !== 0"
          :is-correct="cellValue === puzzle.solution[rowIndex][colIndex]"
          :game-status="gameStatus"
          :row="rowIndex"
          :col="colIndex"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.puzzle-board {
  display: grid;
  gap: 1px;
  background: var(--color-border);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  aspect-ratio: 1;
  max-width: 500px;
  margin: 0 auto;
}

.cell-container {
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.cell-container:hover {
  background: var(--color-cell-selected);
}

.border-right {
  border-right: 1px solid var(--color-border);
}

.border-right-thick {
  border-right: 2px solid var(--color-primary-dark);
}

.border-bottom {
  border-bottom: 1px solid var(--color-border);
}

.border-bottom-thick {
  border-bottom: 2px solid var(--color-primary-dark);
}

@media (max-width: 500px) {
  .puzzle-board {
    max-width: 100%;
  }
}
</style>
