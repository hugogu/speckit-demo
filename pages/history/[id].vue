<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from '#app'
import { useHistoryStore } from '~/stores/history'
import type { GameRecord } from '~/types'

const route = useRoute()
const router = useRouter()
const historyStore = useHistoryStore()

const record = ref<GameRecord | null>(null)
const loading = ref(true)
const notFound = ref(false)

onMounted(() => {
  const id = route.params.id as string
  historyStore.loadRecords()
  record.value = historyStore.getRecordById(id)
  
  if (!record.value) {
    notFound.value = true
  }
  
  loading.value = false
})

function goBack() {
  router.push('/history')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">游戏详情</h1>
        <UiButton
          variant="outline"
          @click="goBack"
        >
          返回列表
        </UiButton>
      </div>
      
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        <p class="mt-2 text-gray-600">加载中...</p>
      </div>
      
      <div v-else-if="notFound" class="bg-white rounded-xl shadow p-6 text-center">
        <h2 class="text-xl font-bold text-gray-900 mb-2">未找到游戏记录</h2>
        <p class="text-gray-600 mb-4">指定的游戏记录不存在或已被删除。</p>
        <UiButton @click="goBack">返回列表</UiButton>
      </div>
      
      <div v-else-if="record">
        <HistoryDetail :record="record" />
      </div>
    </div>
  </div>
</template>
