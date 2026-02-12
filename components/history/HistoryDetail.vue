<script setup lang="ts">
import type { GameRecord } from '~/types'

interface Props {
  record: GameRecord
}

defineProps<Props>()

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

function formatTime(duration: number): string {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('zh-CN')
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl shadow p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">游戏详情</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex justify-between py-2 border-b">
          <span class="text-gray-600">游戏盘面</span>
          <span class="font-medium">{{ boardSizeLabels[record.boardSize] }}</span>
        </div>
        
        <div class="flex justify-between py-2 border-b">
          <span class="text-gray-600">难度级别</span>
          <span class="font-medium">{{ difficultyLabels[record.difficulty] }}</span>
        </div>
        
        <div class="flex justify-between py-2 border-b">
          <span class="text-gray-600">用时</span>
          <span class="font-medium font-mono">{{ formatTime(record.duration) }}</span>
        </div>
        
        <div class="flex justify-between py-2 border-b">
          <span class="text-gray-600">错误次数</span>
          <span class="font-medium">{{ record.errorCount }}</span>
        </div>
        
        <div class="flex justify-between py-2 border-b">
          <span class="text-gray-600">步数</span>
          <span class="font-medium">{{ record.moveCount }}</span>
        </div>
        
        <div class="flex justify-between py-2 border-b">
          <span class="text-gray-600">完成时间</span>
          <span class="font-medium">{{ formatDate(record.completedAt) }}</span>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-xl shadow p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">初始棋盘</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300">
          <tbody>
            <tr v-for="(row, rowIndex) in record.initialBoard" :key="rowIndex">
              <td 
                v-for="(cell, colIndex) in row" 
                :key="colIndex"
                class="border border-gray-300 p-2 text-center font-medium"
                :class="{
                  'bg-gray-100 text-gray-500': cell !== 0,
                  'text-gray-900': cell === 0
                }"
              >
                {{ cell !== 0 ? cell : '' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="bg-white rounded-xl shadow p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">最终棋盘</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300">
          <tbody>
            <tr v-for="(row, rowIndex) in record.finalBoard" :key="rowIndex">
              <td 
                v-for="(cell, colIndex) in row" 
                :key="colIndex"
                class="border border-gray-300 p-2 text-center font-medium"
              >
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
