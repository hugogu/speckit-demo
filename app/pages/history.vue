<script setup lang="ts">
import { useHistoryStore } from '~/stores/history'

const historyStore = useHistoryStore()

// Load records on mount
onMounted(() => {
  historyStore.loadRecords()
})

function handleDelete(id: string) {
  if (confirm('确定要删除这条记录吗？')) {
    historyStore.removeRecord(id)
  }
}

function handleClearAll() {
  if (confirm('确定要清空所有记录吗？此操作不可撤销。')) {
    historyStore.clearAllRecords()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
    <div class="container mx-auto px-4 py-8 max-w-2xl">
      <!-- Header -->
      <header class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <NuxtLink 
            to="/" 
            class="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回游戏
          </NuxtLink>
          
          <button
            v-if="historyStore.records.length > 0"
            class="text-sm text-red-500 hover:text-red-600 transition-colors"
            @click="handleClearAll"
          >
            清空记录
          </button>
        </div>
        
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">
          📊 游戏记录
        </h1>
      </header>

      <!-- Stats -->
      <section class="mb-8">
        <HistoryHistoryStats
          :total-games="historyStore.totalGames"
          :completed-games="historyStore.completedGames"
          :average-time="historyStore.averageTime"
          :best-time="historyStore.bestTime"
        />
      </section>

      <!-- Records List -->
      <section>
        <h2 class="text-lg font-semibold text-gray-700 mb-4">
          最近记录
        </h2>
        
        <HistoryHistoryList
          :records="historyStore.records"
          :is-loading="historyStore.isLoading"
          @delete="handleDelete"
        />
      </section>
    </div>
  </div>
</template>
