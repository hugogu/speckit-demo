<template>
  <div class="history-container">
    <h1>游戏历史记录</h1>
    
    <div v-if="games.length === 0" class="empty-history">
      暂无游戏记录
    </div>
    
    <div v-else>
      <div v-for="(game, index) in games" :key="index" class="game-record">
        <div class="game-meta">
          <span>{{ formatDate(game.date) }}</span>
          <span>尺寸: {{ game.size }}×{{ game.size }}</span>
          <span>难度: {{ formatDifficulty(game.difficulty) }}</span>
          <span>用时: {{ formatTime(game.time) }}</span>
          <span>错误: {{ game.errors }}</span>
        </div>
        
        <button @click="printGame(game)">打印</button>
      </div>
    </div>
    
    <button @click="$router.push('/game')">返回游戏</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'default'
});

const games = ref([]);

onMounted(() => {
  loadHistory();
});

function loadHistory() {
  const history = localStorage.getItem('sudokuHistory');
  if (history) {
    games.value = JSON.parse(history).reverse(); // Show latest first
  }
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString();
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function formatDifficulty(diff) {
  return {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }[diff] || diff;
}

function printGame(game) {
  // Encode game data for print view
  const encoded = btoa(JSON.stringify({
    puzzles: [{
      size: game.size,
      difficulty: game.difficulty,
      board: game.board,
      solution: game.solution
    }]
  }));
  window.open(`/print?data=${encoded}`, '_blank');
}
</script>

<style scoped>
.history-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.game-record {
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.game-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.empty-history {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>
