<script setup lang="ts">
import type { Board } from '~/types'

interface Props {
  boards: Board[]
  boardSize: number
  difficulty: string
}

defineProps<Props>()

const boardSizeLabels = {
  4: '4×4',
  6: '6×6',
  9: '9×9'
}

const difficultyLabels = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
  expert: '专家'
}

function getRowBorderClass(rowIndex: number, boardSize: number): string {
  const boxHeight = boardSize === 6 ? 2 : 3
  if ((rowIndex + 1) % boxHeight === 0 && rowIndex < boardSize - 1) {
    return 'border-b-2 border-gray-800'
  }
  return 'border-b border-gray-300'
}

function getColBorderClass(colIndex: number, boardSize: number): string {
  const boxWidth = boardSize === 6 ? 3 : 3
  if ((colIndex + 1) % boxWidth === 0 && colIndex < boardSize - 1) {
    return 'border-r-2 border-gray-800'
  }
  return 'border-r border-gray-300'
}
</script>

<template>
  <div class="bg-white rounded-xl shadow p-6">
    <div class="text-center mb-6">
      <h2 class="text-xl font-bold text-gray-900">打印预览</h2>
      <p class="text-gray-600">
        盘面大小: {{ boardSizeLabels[boardSize as keyof typeof boardSizeLabels] }} | 
        难度: {{ difficultyLabels[difficulty as keyof typeof difficultyLabels] }}
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="(board, index) in boards" 
        :key="index"
        class="border border-gray-300 rounded-lg p-4"
      >
        <h3 class="text-center font-medium text-gray-900 mb-2">题目 {{ index + 1 }}</h3>
        <div class="grid gap-0 mx-auto" :class="[
          board.size === 4 ? 'grid-cols-4 w-48' : 
          board.size === 6 ? 'grid-cols-6 w-60' : 'grid-cols-9 w-80'
        ]">
          <template v-for="(row, rowIndex) in board.cells" :key="rowIndex">
            <div
              v-for="(cell, colIndex) in row"
              :key="`${rowIndex}-${colIndex}`"
              class="flex items-center justify-center font-bold"
              :class="[
                'bg-white',
                getRowBorderClass(rowIndex, board.size),
                getColBorderClass(colIndex, board.size),
                rowIndex === 0 ? 'border-t-2 border-gray-800' : '',
                colIndex === 0 ? 'border-l-2 border-gray-800' : '',
                board.size === 4 ? 'w-12 h-12 text-xl' : 
                board.size === 6 ? 'w-10 h-10 text-lg' : 'w-8 h-8 text-base'
              ]"
            >
              {{ cell.isPrefilled ? cell.value : '' }}
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
