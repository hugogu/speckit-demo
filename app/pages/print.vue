<template>
  <div class="print-container">
    <div v-for="(puzzle, index) in puzzles" :key="index" class="puzzle-page">
      <h2>数独游戏 #{{ index + 1 }}</h2>
      <div class="puzzle-info">
        <span>尺寸: {{ puzzle.size }}×{{ puzzle.size }}</span>
        <span>难度: {{ formatDifficulty(puzzle.difficulty) }}</span>
      </div>
      
      <div class="sudoku-grid">
        <div v-for="(row, rowIndex) in puzzle.board" :key="rowIndex" class="grid-row">
          <div 
            v-for="(cell, colIndex) in row" 
            :key="colIndex"
            class="grid-cell"
            :class="{ 'prefilled': cell.prefilled }"
          >
            {{ cell.value || '' }}
          </div>
        </div>
      </div>
      
      <div class="solution-link">
        答案: {{ puzzle.solutionUrl }}
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
});

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { generateSudoku } from '@/utils/sudoku';

const route = useRoute();
const puzzles = ref([]);

onMounted(() => {
  if (route.query.data) {
    try {
      const data = JSON.parse(atob(route.query.data));
      puzzles.value = data.puzzles;
    } catch (e) {
      console.error('Error parsing print data:', e);
      generatePrintPuzzles();
    }
  } else {
    generatePrintPuzzles();
  }
  
  // Auto-print when component is mounted
  setTimeout(() => {
    window.print();
  }, 500);
});

function generatePrintPuzzles() {
  const count = 4; // Number of puzzles to generate
  const puzzlesList = [];
  
  for (let i = 0; i < count; i++) {
    const size = [4, 9, 9, 16][i % 4];
    const difficulty = ['easy', 'medium', 'hard', 'medium'][i % 4];
    
    const { solution, puzzle } = generateSudoku(size, difficulty);
    
    puzzlesList.push({
      size,
      difficulty,
      board: puzzle.map(row => 
        row.map(value => ({
          value: value !== 0 ? value : null,
          prefilled: value !== 0
        }))
      ),
      solution,
      solutionUrl: `https://sudoku-solver.example.com/?puzzle=${btoa(JSON.stringify(puzzle))}`
    });
  }
  
  puzzles.value = puzzlesList;
}

function formatDifficulty(diff) {
  return {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }[diff] || diff;
}
</script>

<style>
@media print {
  body {
    margin: 0;
    padding: 0;
    background: white;
    color: black;
  }
  
  .print-container {
    width: 100%;
  }
  
  .puzzle-page {
    page-break-after: always;
    padding: 20px;
  }
}

.sudoku-grid {
  display: inline-block;
  border: 2px solid #000;
  margin: 20px 0;
}

.grid-row {
  display: flex;
}

.grid-cell {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  font-size: 16px;
}

.grid-cell.prefilled {
  font-weight: bold;
}

.grid-cell:nth-child(3n) {
  border-right: 2px solid #000;
}

.grid-row:nth-child(3n) {
  border-bottom: 2px solid #000;
}

.puzzle-info {
  margin: 10px 0;
}

.solution-link {
  margin-top: 10px;
  font-size: 12px;
}
</style>
