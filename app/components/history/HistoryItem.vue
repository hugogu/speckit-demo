<script setup lang="ts">
import type { GameRecord } from '~/types'

interface Props {
  record: GameRecord
  difficultyLabel: string
  formattedDuration: string
  formattedDate: string
}

defineProps<Props>()

const emit = defineEmits<{
  delete: []
  view: []
}>()
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4 flex items-center justify-between gap-4">
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <span class="font-semibold text-gray-800">
          {{ record.boardSize }}×{{ record.boardSize }}
        </span>
        <span 
          class="px-2 py-0.5 text-xs rounded-full"
          :class="{
            'bg-green-100 text-green-700': record.difficulty === 'easy',
            'bg-yellow-100 text-yellow-700': record.difficulty === 'medium',
            'bg-orange-100 text-orange-700': record.difficulty === 'hard',
            'bg-red-100 text-red-700': record.difficulty === 'expert',
          }"
        >
          {{ difficultyLabel }}
        </span>
        <span v-if="record.isCompleted" class="text-green-500">✓</span>
      </div>
      
      <div class="flex items-center gap-4 text-sm text-gray-500">
        <span class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ formattedDuration }}
        </span>
        <span class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ formattedDate }}
        </span>
        <span v-if="record.errorCount > 0" class="text-orange-500">
          {{ record.errorCount }} 错误
        </span>
      </div>
    </div>
    
    <div class="flex items-center gap-2">
      <button
        class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors min-w-11 min-h-11 flex items-center justify-center"
        aria-label="删除记录"
        @click="emit('delete')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>
