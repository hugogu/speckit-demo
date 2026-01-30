<script setup lang="ts">
import type { BoardSize, Difficulty } from '~/types'

interface Props {
  modelValue: boolean
  time: string
  errorCount: number
  moveCount: number
  difficulty: Difficulty
  boardSize: BoardSize
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'newGame': []
}>()

function closeModal() {
  emit('update:modelValue', false)
}

function handleNewGame() {
  closeModal()
  emit('newGame')
}

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
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h3 class="mt-4 text-2xl font-bold text-gray-900">恭喜完成！</h3>
        
        <div class="mt-4 space-y-3">
          <div class="flex justify-between items-center py-2 border-b">
            <span class="text-gray-600">游戏盘面</span>
            <span class="font-medium">{{ boardSizeLabels[boardSize] }}</span>
          </div>
          
          <div class="flex justify-between items-center py-2 border-b">
            <span class="text-gray-600">难度级别</span>
            <span class="font-medium">{{ difficultyLabels[difficulty] }}</span>
          </div>
          
          <div class="flex justify-between items-center py-2 border-b">
            <span class="text-gray-600">用时</span>
            <span class="font-medium font-mono">{{ time }}</span>
          </div>
          
          <div class="flex justify-between items-center py-2 border-b">
            <span class="text-gray-600">错误次数</span>
            <span class="font-medium">{{ errorCount }}</span>
          </div>
          
          <div class="flex justify-between items-center py-2">
            <span class="text-gray-600">步数</span>
            <span class="font-medium">{{ moveCount }}</span>
          </div>
        </div>
        
        <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <UiButton
            variant="primary"
            size="lg"
            class="w-full sm:w-auto"
            @click="handleNewGame"
          >
            再来一局
          </UiButton>
          
          <UiButton
            variant="outline"
            size="lg"
            class="w-full sm:w-auto"
            @click="closeModal"
          >
            关闭
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
