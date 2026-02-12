<script setup lang="ts">
import type { BoardSize, Difficulty } from '~/types'

interface Props {
  modelValue: {
    boardSize: BoardSize
    difficulty: Difficulty
    count: number
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: {
    boardSize: BoardSize
    difficulty: Difficulty
    count: number
  }]
}>()

const boardSizeOptions = [
  { value: 4, label: '4×4 (入门)' },
  { value: 6, label: '6×6 (进阶)' },
  { value: 9, label: '9×9 (标准)' }
]

const difficultyOptions = [
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' },
  { value: 'expert', label: '专家' }
]

const countOptions = [
  { value: 1, label: '1题' },
  { value: 2, label: '2题' },
  { value: 4, label: '4题' },
  { value: 6, label: '6题' },
  { value: 8, label: '8题' }
]

function updateBoardSize(value: BoardSize) {
  emit('update:modelValue', {
    boardSize: value,
    difficulty: props.modelValue.difficulty,
    count: props.modelValue.count
  })
}

function updateDifficulty(value: Difficulty) {
  emit('update:modelValue', {
    boardSize: props.modelValue.boardSize,
    difficulty: value,
    count: props.modelValue.count
  })
}

function updateCount(value: number) {
  emit('update:modelValue', {
    boardSize: props.modelValue.boardSize,
    difficulty: props.modelValue.difficulty,
    count: value
  })
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">棋盘大小</label>
      <UiSelect
        :model-value="modelValue.boardSize"
        :options="boardSizeOptions"
        @update:model-value="updateBoardSize"
      />
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">难度级别</label>
      <UiSelect
        :model-value="modelValue.difficulty"
        :options="difficultyOptions"
        @update:model-value="updateDifficulty"
      />
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">题目数量</label>
      <UiSelect
        :model-value="modelValue.count"
        :options="countOptions"
        @update:model-value="updateCount"
      />
    </div>
  </div>
</template>
