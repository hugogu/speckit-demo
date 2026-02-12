<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from '#app'
import { useHistoryStore } from '~/stores/history'
import type { GameRecord } from '~/types'

const router = useRouter()
const historyStore = useHistoryStore()

const records = ref<GameRecord[]>([])
const loading = ref(true)

onMounted(() => {
  historyStore.loadRecords()
  records.value = historyStore.sortedRecords
  loading.value = false
})

function goBack() {
  router.push('/')
}

function clearHistory() {
  if (confirm('确定要清空所有游戏记录吗？')) {
    historyStore.clearRecords()
    records.value = []
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 class="text-2xl font-bold text-gray-900">游戏历史记录</h1>
        <div class="flex gap-2">
          <UiButton
            variant="outline"
            @click="goBack"
          >
            返回游戏
          </UiButton>
          <UiButton
            v-if="records.length > 0"
            variant="secondary"
            @click="clearHistory"
          >
            清空记录
          </UiButton>
        </div>
      </div>
      
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        <p class="mt-2 text-gray-600">加载中...</p>
      </div>
      
      <div v-else>
        <HistoryList :records="records" />
      </div>
    </div>
  </div>
</template>
