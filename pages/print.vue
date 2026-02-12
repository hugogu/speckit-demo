<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from '#app'
import { createPuzzle } from '~/composables/useSudokuGenerator'
import { generatePrintHtml, openPrintWindow } from '~/utils/print'
import type { Board, BoardSize, Difficulty } from '~/types'

const router = useRouter()

// Print options
const printOptions = ref({
  boardSize: 4 as BoardSize,
  difficulty: 'easy' as Difficulty,
  count: 4
})

// Generated puzzles
const puzzles = ref<Board[]>([])
const generating = ref(false)

// Generate puzzles
function generatePuzzles() {
  generating.value = true
  puzzles.value = []
  
  // Generate puzzles
  for (let i = 0; i < printOptions.value.count; i++) {
    const puzzle = createPuzzle(
      printOptions.value.boardSize, 
      printOptions.value.difficulty
    )
    puzzles.value.push(puzzle)
  }
  
  generating.value = false
}

// Print puzzles
function printPuzzles() {
  if (puzzles.value.length === 0) return
  
  const htmlContent = generatePrintHtml(
    puzzles.value, 
    printOptions.value.boardSize, 
    printOptions.value.difficulty
  )
  
  openPrintWindow(htmlContent)
}

function goBack() {
  router.push('/')
}

// Generate initial puzzles
onMounted(() => {
  generatePuzzles()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 class="text-2xl font-bold text-gray-900">打印练习题</h1>
        <div class="flex gap-2">
          <UiButton
            variant="outline"
            @click="goBack"
          >
            返回游戏
          </UiButton>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Print Options -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow p-6 sticky top-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">打印设置</h2>
            
            <PrintPrintOptions
              v-model="printOptions"
            />
            
            <div class="mt-6 flex flex-col gap-3">
              <UiButton
                variant="primary"
                :disabled="generating"
                @click="generatePuzzles"
              >
                {{ generating ? '生成中...' : '生成题目' }}
              </UiButton>
              
              <UiButton
                variant="secondary"
                :disabled="puzzles.length === 0 || generating"
                @click="printPuzzles"
              >
                打印
              </UiButton>
            </div>
          </div>
        </div>
        
        <!-- Print Preview -->
        <div class="lg:col-span-2">
          <PrintPrintPreview
            :boards="puzzles"
            :board-size="printOptions.boardSize"
            :difficulty="printOptions.difficulty"
          />
        </div>
      </div>
    </div>
  </div>
</template>
