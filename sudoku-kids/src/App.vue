<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { BoardSize, Difficulty } from './types';
import { useGameStore } from './stores/gameStore';
import { useHistoryStore } from './stores/historyStore';
import { generatePuzzle } from './utils/sudokuGenerator';
import PuzzleBoard from './components/PuzzleBoard/PuzzleBoard.vue';
import NumberSelector from './components/NumberSelector/NumberSelector.vue';
import Timer from './components/Timer/Timer.vue';
import GameHistory from './components/GameHistory/GameHistory.vue';
import VictoryModal from './components/VictoryModal/VictoryModal.vue';

const gameStore = useGameStore();
const historyStore = useHistoryStore();

const selectedBoardSize = ref<BoardSize>(9);
const selectedDifficulty = ref<Difficulty>('easy');
const showHistory = ref(false);

const boardSizes: { value: BoardSize; label: string }[] = [
  { value: 4, label: '4×4 (入门)' },
  { value: 6, label: '6×6 (简单)' },
  { value: 9, label: '9×9 (标准)' },
];

const difficulties: { value: Difficulty; label: string }[] = [
  { value: 'beginner', label: '入门' },
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' },
];

function startNewGame(): void {
  const puzzle = generatePuzzle(selectedBoardSize.value, selectedDifficulty.value);
  gameStore.startNewGame(puzzle);
}

function toggleHistory(): void {
  showHistory.value = !showHistory.value;
}

onMounted(() => {
  const savedSession = localStorage.getItem('sudoku-current-game');
  if (savedSession) {
    try {
      const session = JSON.parse(savedSession);
      if (!session.completed) {
        const puzzle = generatePuzzle(session.boardSize, session.difficulty);
        gameStore.loadSavedGame(session, puzzle);
      }
    } catch (e) {
      console.error('Failed to restore saved game', e);
    }
  }
});
</script>

<template>
  <div class="app-container">
    <header class="header">
      <h1>🎮 儿童数独游戏</h1>
      <p class="subtitle">适合小学生的数独学习游戏</p>
    </header>

    <main class="main-content">
      <section v-if="gameStore.gameStatus === 'idle'" class="game-setup card">
        <div class="setup-group">
          <label>棋盘大小</label>
          <select v-model="selectedBoardSize">
            <option v-for="size in boardSizes" :key="size.value" :value="size.value">
              {{ size.label }}
            </option>
          </select>
        </div>

        <div class="setup-group">
          <label>难度级别</label>
          <select v-model="selectedDifficulty">
            <option v-for="diff in difficulties" :key="diff.value" :value="diff.value">
              {{ diff.label }}
            </option>
          </select>
        </div>

        <button class="btn btn-success" @click="startNewGame">
          开始新游戏
        </button>

        <div class="stats-preview">
          <p>已完成的游戏: {{ historyStore.totalCompleted }}</p>
          <p>平均用时: {{ historyStore.averageDuration ? `${historyStore.averageDuration}秒` : '-' }}</p>
        </div>
      </section>

      <section v-else class="game-play">
        <div class="game-controls">
          <Timer />
          <div class="control-buttons">
            <button class="btn btn-secondary" @click="gameStore.resetGame">
              重新开始
            </button>
            <button class="btn btn-secondary" @click="toggleHistory">
              {{ showHistory ? '隐藏历史' : '查看历史' }}
            </button>
          </div>
        </div>

        <PuzzleBoard
          v-if="gameStore.currentPuzzle"
          :puzzle="gameStore.currentPuzzle"
          :game-status="gameStore.gameStatus"
        />

        <NumberSelector
          v-if="gameStore.gameStatus === 'playing'"
          :board-size="gameStore.boardSize"
        />

        <VictoryModal
          v-if="gameStore.gameStatus === 'victory'"
          :duration="gameStore.gameSession?.duration || 0"
          :error-count="gameStore.errorCount"
          @play-again="startNewGame"
        />
      </section>

      <aside v-if="showHistory" class="history-panel card">
        <GameHistory />
      </aside>
    </main>

    <footer class="footer">
      <p>适合 6-12 岁小学生 | 无需网络 | 离线可用</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  text-align: center;
  padding: 24px 0;
}

.header h1 {
  font-size: 28px;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.subtitle {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.game-setup {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  padding: 24px;
}

.setup-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 300px;
}

.setup-group label {
  font-weight: 500;
  color: var(--color-text);
}

.setup-group select {
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
}

.stats-preview {
  margin-top: 16px;
  padding: 16px;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  text-align: center;
}

.stats-preview p {
  margin: 4px 0;
  color: var(--color-text-secondary);
}

.game-play {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.game-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.control-buttons {
  display: flex;
  gap: 8px;
}

.history-panel {
  margin-top: 16px;
}

.footer {
  text-align: center;
  padding: 24px 0;
  color: var(--color-text-secondary);
  font-size: 12px;
}

@media (max-width: 600px) {
  .header h1 {
    font-size: 24px;
  }

  .game-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .control-buttons {
    justify-content: center;
  }
}
</style>
