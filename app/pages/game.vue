<template>
  <div class="game-container">
    <div class="game-header">
      <h1>数独游戏</h1>
      <div class="controls">
        <div class="control-group">
          <label>难度:</label>
          <select v-model="difficulty" @change="newGame">
            <option value="easy">简单</option>
            <option value="medium">中等</option>
            <option value="hard">困难</option>
          </select>
        </div>
        
        <div class="control-group">
          <label>尺寸:</label>
          <select v-model="size" @change="newGame">
            <option value="4">4×4</option>
            <option value="9">9×9</option>
            <option value="16">16×16</option>
          </select>
        </div>
        
        <button @click="newGame">新游戏</button>
        <button @click="printGame">打印</button>
      </div>
      
      <div class="stats">
        <div class="timer">
          <span>用时:</span>
          <span>{{ formattedTime }}</span>
        </div>
        <div class="errors">
          <span>错误:</span>
          <span>{{ errorCount }}</span>
        </div>
      </div>
    </div>
    
    <SudokuBoard 
      :size="parseInt(size)" 
      :difficulty="difficulty"
      :initialBoard="currentBoard"
      @cell-selected="selectCell"
      @value-placed="placeValue"
    />
    
    <div class="number-pad">
      <div 
        v-for="num in parseInt(size)" 
        :key="num"
        class="number"
        draggable="true"
        @dragstart="dragStart($event, num)"
        @click="placeSelectedValue(num)"
      >
        {{ num }}
      </div>
    </div>
    
    <div v-if="showVictory" class="victory-overlay">
      <div class="victory-message">
        <h2>恭喜完成!</h2>
        <p>用时: {{ formattedTime }}</p>
        <p>错误次数: {{ errorCount }}</p>
        <button @click="newGame">再来一局</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import SudokuBoard from '@/components/game/SudokuBoard.vue';
import { generateSudoku, validateMove, isBoardComplete } from '@/utils/sudoku';

definePageMeta({
  layout: 'default'
});

// Game state
const size = ref('9');
const difficulty = ref('medium');
const currentBoard = ref([]);
const solutionBoard = ref([]);
const selectedCell = ref(null);
const startTime = ref(null);
const currentTime = ref(0);
const errorCount = ref(0);
const showVictory = ref(false);
const timerInterval = ref(null);

// Format time as MM:SS
const formattedTime = computed(() => {
  const minutes = Math.floor(currentTime.value / 60);
  const seconds = currentTime.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Initialize new game
function newGame() {
  // Reset game state
  currentTime.value = 0;
  errorCount.value = 0;
  showVictory.value = false;
  selectedCell.value = null;
  
  // Start timer
  startTimer();
  
  // Generate actual Sudoku board based on difficulty and size
  const boardSize = parseInt(size.value);
  const { board, solution } = generateSudoku(boardSize, difficulty.value);
  currentBoard.value = board;
  solutionBoard.value = solution;
}

// Start game timer
function startTimer() {
  startTime.value = Date.now();
  clearInterval(timerInterval.value);
  timerInterval.value = setInterval(() => {
    currentTime.value = Math.floor((Date.now() - startTime.value) / 1000);
  }, 1000);
}

// Handle cell selection
function selectCell(cell) {
  selectedCell.value = cell;
}

// Handle drag start for number pad
function dragStart(event, num) {
  event.dataTransfer.setData('text/plain', num.toString());
}

// Place value from number pad
function placeSelectedValue(value) {
  if (selectedCell.value) {
    const [row, col] = selectedCell.value;
    placeValue(row, col, value);
  }
}

// Place value on board
function placeValue(row, col, value) {
  // Skip if cell is prefilled
  if (currentBoard.value[row][col].prefilled) return;
  
  // Validate the move
  const isValid = validateMove(
    currentBoard.value.map(row => row.map(cell => cell.value)),
    solutionBoard.value,
    row,
    col,
    value
  );
  
  if (!isValid) {
    // Handle invalid move
    errorCount.value++;
    
    // Flash error and reset cell
    currentBoard.value[row][col] = { ...currentBoard.value[row][col], error: true };
    setTimeout(() => {
      currentBoard.value[row][col] = { 
        ...currentBoard.value[row][col], 
        value: 0, 
        error: false 
      };
    }, 500);
  } else {
    // Valid move
    currentBoard.value[row][col] = { 
      ...currentBoard.value[row][col], 
      value, 
      error: false 
    };
    
    // Check for victory
    const puzzleState = currentBoard.value.map(row => 
      row.map(cell => cell.value)
    );
    
    if (isBoardComplete(puzzleState, solutionBoard.value)) {
      showVictory.value = true;
      clearInterval(timerInterval.value);
      saveGameHistory();
    }
  }
}

function saveGameHistory() {
  const gameData = {
    date: new Date().toISOString(),
    size: parseInt(size.value),
    difficulty: difficulty.value,
    time: currentTime.value,
    errors: errorCount.value,
    board: currentBoard.value.map(row => 
      row.map(cell => ({
        value: cell.value,
        prefilled: cell.prefilled
      }))
    ),
    solution: solutionBoard.value
  };
  
  // Get existing history or initialize
  const history = JSON.parse(localStorage.getItem('sudokuHistory') || '[]');
  
  // Add new game and save
  history.push(gameData);
  localStorage.setItem('sudokuHistory', JSON.stringify(history));
}

// Print functionality
function printGame() {
  window.open('/print', '_blank');
}

// Initialize game on mount
onMounted(() => {
  newGame();
});

// Clean up timer on unmount
onUnmounted(() => {
  clearInterval(timerInterval.value);
});
</script>

<style scoped>
.game-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.game-header {
  margin-bottom: 20px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 5px;
}

select, button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

button {
  cursor: pointer;
  background-color: #1890ff;
  color: white;
  border: none;
}

.stats {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  font-size: 1.1rem;
}

.number-pad {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
}

.number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1.2rem;
  cursor: pointer;
  user-select: none;
  background-color: #f5f5f5;
}

.number:hover {
  background-color: #e6f7ff;
}

.victory-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.victory-message {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .number {
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }
}
</style>
