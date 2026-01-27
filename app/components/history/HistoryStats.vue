<script setup lang="ts">
interface Props {
  totalGames: number
  completedGames: number
  averageTime: number
  bestTime: number
}

defineProps<Props>()

function formatTime(ms: number): string {
  if (ms === 0) return '--:--'
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <div class="bg-white rounded-lg shadow p-4 text-center">
      <div class="text-2xl font-bold text-indigo-600">{{ totalGames }}</div>
      <div class="text-sm text-gray-500">总游戏数</div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-4 text-center">
      <div class="text-2xl font-bold text-green-600">{{ completedGames }}</div>
      <div class="text-sm text-gray-500">已完成</div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-4 text-center">
      <div class="text-2xl font-bold text-blue-600">{{ formatTime(averageTime) }}</div>
      <div class="text-sm text-gray-500">平均用时</div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-4 text-center">
      <div class="text-2xl font-bold text-amber-600">{{ formatTime(bestTime) }}</div>
      <div class="text-sm text-gray-500">最佳用时</div>
    </div>
  </div>
</template>
