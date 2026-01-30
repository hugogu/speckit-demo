<script setup lang="ts">
import type { GameRecord } from '~/types'
import { useRouter } from '#app'

interface Props {
  records: GameRecord[]
}

defineProps<Props>()

const router = useRouter()

const difficultyLabels = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
  expert: '专家'
}

const boardSizeLabels = {
  4: '4×4',
  6: '6×6',
  9: '9×9'
}

function formatTime(duration: number): string {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('zh-CN')
}

function viewDetails(id: string) {
  router.push(`/history/${id}`)
}
</script>

<template>
  <div class="bg-white rounded-xl shadow overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">游戏盘面</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">难度</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用时</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">错误</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">步数</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">完成时间</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="record in records" :key="record.id">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ boardSizeLabels[record.boardSize] }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ difficultyLabels[record.difficulty] }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{{ formatTime(record.duration) }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ record.errorCount }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ record.moveCount }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(record.completedAt) }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <UiButton
              variant="outline"
              size="sm"
              @click="viewDetails(record.id)"
            >
              查看详情
            </UiButton>
          </td>
        </tr>
        <tr v-if="records.length === 0">
          <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">
            暂无游戏记录
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
