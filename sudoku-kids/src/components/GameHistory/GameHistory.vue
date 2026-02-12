<script setup lang="ts">
import { computed } from 'vue';
import { useHistoryStore } from '../../stores/historyStore';
import type { GameSession } from '../../types';

const historyStore = useHistoryStore();

const recentSessions = computed(() => historyStore.getRecentSessions(10));

function formatDuration(seconds: number | undefined): string {
  if (!seconds) return '-';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}分${secs}秒`;
  }
  return `${secs}秒`;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    beginner: '入门',
    easy: '简单',
    medium: '中等',
    hard: '困难',
  };
  return labels[difficulty] || difficulty;
}

function getBoardSizeLabel(size: number): string {
  return `${size}×${size}`;
}
</script>

<template>
  <div class="game-history">
    <h3>📊 游戏历史</h3>

    <div v-if="recentSessions.length === 0" class="empty-state">
      <p>还没有游戏记录</p>
      <p class="hint">完成游戏后会显示在这里</p>
    </div>

    <div v-else class="history-list">
      <div
        v-for="session in recentSessions"
        :key="session.id"
        class="history-item"
      >
        <div class="session-header">
          <span class="difficulty">{{ getDifficultyLabel(session.difficulty) }}</span>
          <span class="board-size">{{ getBoardSizeLabel(session.boardSize) }}</span>
          <span class="date">{{ formatDate(session.startTime) }}</span>
        </div>

        <div class="session-stats">
          <span class="stat">
            ⏱️ {{ formatDuration(session.duration) }}
          </span>
          <span class="stat" :class="{ error: session.errorCount > 0 }">
            ❌ {{ session.errorCount }}
          </span>
          <span class="stat result" :class="{ success: session.completed }">
            {{ session.completed ? '✅ 完成' : '⏸️ 未完成' }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="historyStore.totalGames > 0" class="summary">
      <p>总计: {{ historyStore.totalGames }} 场游戏</p>
      <p>完成: {{ historyStore.totalCompleted }} 场</p>
      <p v-if="historyStore.averageDuration">
        平均用时: {{ formatDuration(historyStore.averageDuration) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.game-history {
  padding: 16px;
}

.game-history h3 {
  margin-bottom: 16px;
  color: var(--color-text);
  font-size: var(--font-size-lg);
}

.empty-state {
  text-align: center;
  padding: 24px;
  color: var(--color-text-secondary);
}

.empty-state .hint {
  font-size: 12px;
  margin-top: 8px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  background: var(--color-bg);
  border-radius: var(--radius-md);
  padding: 12px;
}

.session-header {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.session-header span {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  background: var(--color-surface);
}

.difficulty {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.date {
  color: var(--color-text-secondary);
}

.session-stats {
  display: flex;
  gap: 16px;
  font-size: 13px;
}

.stat.error {
  color: var(--color-error);
}

.stat.result.success {
  color: var(--color-success);
}

.summary {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
  font-size: 13px;
  color: var(--color-text-secondary);
}

.summary p {
  margin: 4px 0;
}
</style>
