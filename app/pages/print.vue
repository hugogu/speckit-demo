<script setup lang="ts">
import type { BoardSize, Difficulty } from '~/types'
import { generatePrintPuzzles, triggerPrint, getPuzzlesPerPage } from '~/utils/print'
import type { PrintPuzzle } from '~/utils/print'

// Options state
const selectedSize = ref<BoardSize>(9)
const selectedDifficulty = ref<Difficulty>('medium')
const showSolutions = ref(false)
const isGenerating = ref(false)

// Generated puzzles
const puzzles = ref<PrintPuzzle[]>([])

// Options
const sizeOptions = [
  { value: 4, label: '4×4 (入门) - 每页8题' },
  { value: 6, label: '6×6 (进阶) - 每页6题' },
  { value: 9, label: '9×9 (标准) - 每页4题' },
]

const difficultyOptions = [
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' },
  { value: 'expert', label: '专家' },
]

const puzzleCount = computed(() => getPuzzlesPerPage(selectedSize.value))

function handleGenerate() {
  isGenerating.value = true
  
  // Use setTimeout to allow UI to update
  setTimeout(() => {
    puzzles.value = generatePrintPuzzles(
      selectedSize.value,
      selectedDifficulty.value
    )
    isGenerating.value = false
  }, 100)
}

function handlePrint() {
  triggerPrint()
}

function handleClear() {
  puzzles.value = []
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-indigo-50 to-white print:bg-white print:min-h-0">
    <div class="container mx-auto px-4 py-8 max-w-4xl print:max-w-none print:px-0 print:py-0">
      <!-- Header (hidden when printing) -->
      <header class="mb-8 print:hidden">
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
        </div>
        
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">
          🖨️ 打印练习题
        </h1>
        <p class="text-gray-600 mt-2">
          生成数独练习题，打印到纸上练习
        </p>
      </header>

      <!-- Options Panel (hidden when printing) -->
      <div v-if="puzzles.length === 0" class="bg-white rounded-2xl shadow-lg p-6 print:hidden">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">
          选择题目设置
        </h2>
        
        <div class="grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              棋盘大小
            </label>
            <UiSelect
              v-model="selectedSize"
              :options="sizeOptions"
              size="lg"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              难度级别
            </label>
            <UiSelect
              v-model="selectedDifficulty"
              :options="difficultyOptions"
              size="lg"
            />
          </div>
        </div>
        
        <div class="flex items-center gap-2 mb-6">
          <input
            id="showSolutions"
            v-model="showSolutions"
            type="checkbox"
            class="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
          >
          <label for="showSolutions" class="text-sm text-gray-700">
            包含答案页
          </label>
        </div>
        
        <div class="text-sm text-gray-500 mb-4">
          将生成 <span class="font-semibold text-indigo-600">{{ puzzleCount }}</span> 道题目
        </div>
        
        <UiButton
          variant="primary"
          size="lg"
          class="w-full"
          :loading="isGenerating"
          @click="handleGenerate"
        >
          生成题目
        </UiButton>
      </div>

      <!-- Preview Panel -->
      <div v-else>
        <!-- Controls (hidden when printing) -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
          <div class="flex items-center gap-3">
            <UiButton variant="outline" @click="handleClear">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              重新选择
            </UiButton>
            
            <UiButton variant="outline" @click="handleGenerate">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              重新生成
            </UiButton>
          </div>
          
          <UiButton variant="primary" @click="handlePrint">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            打印
          </UiButton>
        </div>

        <!-- Print Preview -->
        <div class="bg-white rounded-xl shadow-lg p-6 print:shadow-none print:p-0 print:rounded-none">
          <PrintPreview
            :puzzles="puzzles"
            :show-solutions="false"
          />
          
          <!-- Solutions Page -->
          <div v-if="showSolutions" class="mt-8 pt-8 border-t print:border-0 print:mt-0 print:pt-0 print:break-before-page">
            <h2 class="text-lg font-semibold text-center mb-6 print:text-base print:mb-4">
              答案
            </h2>
            <PrintPreview
              :puzzles="puzzles"
              :show-solutions="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@media print {
  @page {
    size: A4;
    margin: 1.5cm;
  }
  
  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
</style>
