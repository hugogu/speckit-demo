<template>
  <div class="sudoku-board" :class="`size-${size}`">
    <div 
      v-for="(row, rowIndex) in board" 
      :key="rowIndex" 
      class="board-row"
    >
      <div 
        v-for="(cell, colIndex) in row" 
        :key="colIndex"
        class="board-cell"
        :class="{
          'highlighted': isHighlighted(rowIndex, colIndex),
          'user-input': !cell.prefilled,
          'error': cell.error
        }"
        @click="selectCell(rowIndex, colIndex)"
        @dragover.prevent
        @drop="handleDrop($event, rowIndex, colIndex)"
      >
        {{ cell.value || '' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits, defineProps } from 'vue';

const props = defineProps({
  size: {
    type: Number,
    default: 9
  },
  difficulty: {
    type: String,
    default: 'medium'
  },
  initialBoard: Array
});

const emit = defineEmits(['cell-selected', 'value-placed']);

const board = ref(initializeBoard());
const selectedCell = ref(null);

function initializeBoard() {
  // Board initialization logic will be added later
  return Array(props.size).fill().map(() => 
    Array(props.size).fill({ value: 0, prefilled: false, error: false })
  );
}

function isHighlighted(row, col) {
  if (!selectedCell.value) return false;
  const [selRow, selCol] = selectedCell.value;
  return row === selRow || col === selCol || 
    (Math.floor(row/3) === Math.floor(selRow/3) && 
     Math.floor(col/3) === Math.floor(selCol/3));
}

function selectCell(row, col) {
  selectedCell.value = [row, col];
  emit('cell-selected', [row, col]);
}

function handleDrop(event, row, col) {
  const value = event.dataTransfer.getData('text/plain');
  placeValue(row, col, parseInt(value));
}

function placeValue(row, col, value) {
  // Validation and placement logic will be added later
  board.value[row][col] = { 
    ...board.value[row][col], 
    value,
    prefilled: false
  };
  emit('value-placed', row, col, value);
}
</script>

<style scoped>
.sudoku-board {
  display: inline-block;
  border: 2px solid #333;
}

.board-row {
  display: flex;
}

.board-cell {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  font-size: 1.2rem;
  cursor: pointer;
  user-select: none;
}

.board-cell:nth-child(3n) {
  border-right: 2px solid #333;
}

.board-row:nth-child(3n) {
  border-bottom: 2px solid #333;
}

.highlighted {
  background-color: #e6f7ff;
}

.user-input {
  color: #1890ff;
  font-weight: bold;
}

.error {
  background-color: #fff2f0;
  color: #f5222d;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .board-cell {
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }
}
</style>
