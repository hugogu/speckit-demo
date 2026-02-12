<template>
  <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900">游戏历史</h1>
      <div class="flex gap-2">
        <BaseButton size="sm" variant="secondary" @click="exportHistory">
          导出记录
        </BaseButton>
        <BaseButton size="sm" @click="refreshHistory">刷新</BaseButton>
      </div>
    </div>

    <div v-if="isLoading" class="py-8 text-center">
      <p class="text-gray-500">加载中...</p>
    </div>

    <div v-else-if="sortedSessions.length === 0" class="py-8 text-center">
      <p class="text-gray-500">暂无游戏记录，去<NuxtLink to="/" class="text-primary-600 hover:underline">开始一局</NuxtLink>吧！</p>
    </div>

    <div v-else class="space-y-4">
      <BaseCard
        v-for="session in sortedSessions"
        :key="session.id"
        class="flex items-center justify-between"
      >
        <div class="flex items-center gap-4">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-lg font-bold"
            :class="difficultyClass(session.difficulty)"
          >
            {{ session.boardSize }}×{{ session.boardSize }}
          </div>
          <div>
            <div class="font-semibold text-gray-900">
              {{ difficultyLabel(session.difficulty) }} · {{ formatDate(session.startTime) }}
            </div>
            <div class="text-sm text-gray-500">
              用时 {{ formatTime(session.elapsedTime) }} · 错误 {{ session.errorCount }} 次
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span
            v-if="session.isCompleted"
            class="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
          >
            已完成
          </span>
          <button
            class="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
            @click="deleteSession(session.id)"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue';
import BaseCard from '~/components/ui/BaseCard.vue';
import type { Difficulty } from '~/types/sudoku';

const historyStore = useHistoryStore();
const { sortedSessions, isLoading } = storeToRefs(historyStore);

onMounted(() => {
  refreshHistory();
});

async function refreshHistory() {
  await historyStore.loadHistory();
}

async function deleteSession(id: string) {
  if (confirm('确定要删除这条记录吗？')) {
    await historyStore.deleteSession(id);
  }
}

async function exportHistory() {
  await historyStore.exportHistory();
}

function difficultyLabel(difficulty: Difficulty): string {
  const labels: Record<Difficulty, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  };
  return labels[difficulty];
}

function difficultyClass(difficulty: Difficulty): string {
  const classes: Record<Difficulty, string> = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };
  return classes[difficulty];
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('zh-CN');
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}分${secs}秒`;
}
</script>
