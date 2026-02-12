<script setup lang="ts">
import type { BoardSize, Difficulty } from '~/types'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()

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

function updateDefaultBoardSize(value: BoardSize) {
  settingsStore.updateDefaultBoardSize(value)
}

function updateDefaultDifficulty(value: Difficulty) {
  settingsStore.updateDefaultDifficulty(value)
}

function updateSoundEnabled(value: boolean) {
  settingsStore.updateSoundEnabled(value)
}

function updateAnimationEnabled(value: boolean) {
  settingsStore.updateAnimationEnabled(value)
}

function resetToDefaults() {
  if (confirm('确定要重置所有设置为默认值吗？')) {
    settingsStore.resetToDefaults()
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">默认棋盘大小</label>
      <UiSelect
        :model-value="settingsStore.settings.defaultBoardSize"
        :options="boardSizeOptions"
        @update:model-value="updateDefaultBoardSize"
      />
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">默认难度级别</label>
      <UiSelect
        :model-value="settingsStore.settings.defaultDifficulty"
        :options="difficultyOptions"
        @update:model-value="updateDefaultDifficulty"
      />
    </div>
    
    <div class="flex items-center justify-between py-3 border-b">
      <div>
        <h3 class="text-sm font-medium text-gray-900">声音</h3>
        <p class="text-sm text-gray-500">启用游戏音效</p>
      </div>
      <UiButton
        :variant="settingsStore.settings.soundEnabled ? 'primary' : 'outline'"
        size="sm"
        @click="updateSoundEnabled(!settingsStore.settings.soundEnabled)"
      >
        {{ settingsStore.settings.soundEnabled ? '开启' : '关闭' }}
      </UiButton>
    </div>
    
    <div class="flex items-center justify-between py-3 border-b">
      <div>
        <h3 class="text-sm font-medium text-gray-900">动画</h3>
        <p class="text-sm text-gray-500">启用界面动画效果</p>
      </div>
      <UiButton
        :variant="settingsStore.settings.animationEnabled ? 'primary' : 'outline'"
        size="sm"
        @click="updateAnimationEnabled(!settingsStore.settings.animationEnabled)"
      >
        {{ settingsStore.settings.animationEnabled ? '开启' : '关闭' }}
      </UiButton>
    </div>
    
    <div class="pt-4">
      <UiButton
        variant="secondary"
        @click="resetToDefaults"
      >
        重置为默认设置
      </UiButton>
    </div>
  </div>
</template>
