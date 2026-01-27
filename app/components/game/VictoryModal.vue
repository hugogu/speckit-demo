<script setup lang="ts">
interface Props {
  modelValue: boolean
  time: string
  errorCount: number
  moveCount: number
  difficulty: string
  boardSize: number
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  newGame: []
}>()

const difficultyLabels: Record<string, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
  expert: '专家',
}

function handleNewGame() {
  emit('update:modelValue', false)
  emit('newGame')
}

function handleClose() {
  emit('update:modelValue', false)
}
</script>

<template>
  <UiModal
    :model-value="modelValue"
    title="🎉 恭喜完成！"
    size="sm"
    @update:model-value="handleClose"
  >
    <div class="text-center space-y-4">
      <div class="text-6xl mb-4">🏆</div>
      
      <p class="text-lg text-gray-700">
        你成功完成了 {{ boardSize }}×{{ boardSize }} {{ difficultyLabels[difficulty] || difficulty }} 难度的数独！
      </p>
      
      <div class="grid grid-cols-3 gap-4 py-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-indigo-600">{{ time }}</div>
          <div class="text-sm text-gray-500">用时</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-indigo-600">{{ moveCount }}</div>
          <div class="text-sm text-gray-500">步数</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold" :class="errorCount > 0 ? 'text-orange-500' : 'text-green-500'">
            {{ errorCount }}
          </div>
          <div class="text-sm text-gray-500">错误</div>
        </div>
      </div>
      
      <p v-if="errorCount === 0" class="text-green-600 font-medium">
        太棒了！零错误完成！⭐
      </p>
    </div>
    
    <template #footer>
      <div class="flex justify-center gap-3">
        <UiButton variant="primary" size="lg" @click="handleNewGame">
          再来一局
        </UiButton>
      </div>
    </template>
  </UiModal>
</template>
