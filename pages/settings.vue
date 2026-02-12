<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from '#app'
import { useSettingsStore } from '~/stores/settings'

const router = useRouter()
const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.loadSettings()
})

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">个性化设置</h1>
        <UiButton
          variant="outline"
          @click="goBack"
        >
          返回游戏
        </UiButton>
      </div>
      
      <div class="bg-white rounded-xl shadow p-6">
        <SettingsSettingsForm />
      </div>
    </div>
  </div>
</template>
