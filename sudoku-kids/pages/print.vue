<template>
  <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
    <h1 class="mb-6 text-3xl font-bold text-gray-900">打印数独游戏</h1>

    <BaseCard class="mb-6">
      <div class="mb-4 grid grid-cols-3 gap-4">
        <div>
          <label class="mb-2 block font-medium text-gray-700">生成数量</label>
          <select v-model="count" class="w-full rounded-lg border border-gray-300 px-4 py-2">
            <option v-for="n in 6" :key="n" :value="n">{{ n }} 个</option>
          </select>
        </div>
        <div>
          <label class="mb-2 block font-medium text-gray-700">难度</label>
          <select v-model="difficulty" class="w-full rounded-lg border border-gray-300 px-4 py-2">
            <option value="easy">简单</option>
            <option value="medium">中等</option>
            <option value="hard">困难</option>
          </select>
        </div>
        <div>
          <label class="mb-2 block font-medium text-gray-700">面板大小</label>
          <select v-model="boardSize" class="w-full rounded-lg border border-gray-300 px-4 py-2">
            <option :value="4">4×4</option>
            <option :value="6">6×6</option>
            <option :value="9">9×9</option>
          </select>
        </div>
      </div>

      <div class="flex justify-center">
        <BaseButton :disabled="isGenerating" @click="generatePrint">
          <span v-if="isGenerating">生成中...</span>
          <span v-else>生成打印预览</span>
        </BaseButton>
      </div>
    </BaseCard>

    <div v-if="printJob" class="print-container">
      <div class="mb-4 flex justify-center gap-2 no-print">
        <BaseButton @click="handlePrint">打印</BaseButton>
        <BaseButton variant="secondary" @click="printJob = null">清除</BaseButton>
      </div>

      <div class="rounded-lg bg-white p-4 shadow-lg print:p-0 print:shadow-none">
        <div
          class="grid gap-4"
          :class="{
            'grid-cols-2': printJob.count <= 4,
            'grid-cols-3': printJob.count > 4
          }"
        >
          <div
            v-for="game in printJob.games"
            :key="game.id"
            class="relative border border-gray-300 p-3"
          >
            <div class="mb-2 text-center text-sm font-bold text-gray-700">
              游戏 #{{ game.sequence }}
            </div>
            <div class="inline-grid gap-px bg-gray-400" :style="gridStyle(game.board.size)">
              <div
                v-for="(cell, idx) in game.board.cells.flat()"
                :key="idx"
                class="flex h-8 w-8 items-center justify-center bg-white text-sm font-bold"
                :class="{ 'bg-gray-100': cell.isFixed }"
              >
                {{ cell.value || '' }}
              </div>
            </div>
            <div class="mt-2 flex justify-end">
              <img :src="game.qrCodeDataUrl" alt="答案二维码" class="h-16 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Difficulty, BoardSize } from '~/types/sudoku';

const count = ref(4);
const difficulty = ref<Difficulty>('medium');
const boardSize = ref<BoardSize>(9);
const isGenerating = ref(false);
const printJob = ref<any>(null);

async function generatePrint() {
  isGenerating.value = true;
  try {
    const { generatePrintJob } = usePrint();
    printJob.value = await generatePrintJob(count.value, difficulty.value, boardSize.value);
  } finally {
    isGenerating.value = false;
  }
}

function handlePrint() {
  window.print();
}

function gridStyle(size: number) {
  return {
    gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`
  };
}
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
