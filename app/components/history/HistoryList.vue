<script setup lang="ts">
import type { GameRecord } from '~/types'

interface Props {
  records: GameRecord[]
  isLoading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  delete: [id: string]
  view: [record: GameRecord]
}>()

const difficultyLabels: Record<string, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
  expert: '专家',
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="space-y-3">
    <div v-if="isLoading" class="text-center py-8 text-gray-500">
      加载中...
    </div>
    
    <div v-else-if="records.length === 0" class="text-center py-8 text-gray-500">
      <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p>暂无游戏记录</p>
      <p class="text-sm mt-1">完成一局游戏后会自动保存</p>
    </div>
    
    <template v-else>
      <HistoryHistoryItem
        v-for="record in records"
        :key="record.id"
        :record="record"
        :difficulty-label="difficultyLabels[record.difficulty] || record.difficulty"
        :formatted-duration="formatDuration(record.duration)"
        :formatted-date="formatDate(record.completedAt)"
        @delete="emit('delete', record.id)"
        @view="emit('view', record)"
      />
    </template>
  </div>
</template>
