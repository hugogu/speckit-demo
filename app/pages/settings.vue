<script setup lang="ts">
import type { BoardSize, Difficulty } from '~/types'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()

// Load settings on mount
onMounted(() => {
  settingsStore.loadSettings()
})

// Options
const sizeOptions = [
  { value: 4, label: '4×4 (入门)' },
  { value: 6, label: '6×6 (进阶)' },
  { value: 9, label: '9×9 (标准)' },
]

const difficultyOptions = [
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' },
  { value: 'expert', label: '专家' },
]

// Local state for form
const selectedSize = ref<BoardSize>(settingsStore.defaultBoardSize)
const selectedDifficulty = ref<Difficulty>(settingsStore.defaultDifficulty)
const soundEnabled = ref(settingsStore.soundEnabled)
const animationEnabled = ref(settingsStore.animationEnabled)

// Sync with store when loaded
watch(() => settingsStore.defaultBoardSize, (val) => { selectedSize.value = val })
watch(() => settingsStore.defaultDifficulty, (val) => { selectedDifficulty.value = val })
watch(() => settingsStore.soundEnabled, (val) => { soundEnabled.value = val })
watch(() => settingsStore.animationEnabled, (val) => { animationEnabled.value = val })

// Save handlers
function handleSizeChange(size: BoardSize) {
  selectedSize.value = size
  settingsStore.setDefaultBoardSize(size)
}

function handleDifficultyChange(difficulty: Difficulty) {
  selectedDifficulty.value = difficulty
  settingsStore.setDefaultDifficulty(difficulty)
}

function handleSoundToggle() {
  soundEnabled.value = !soundEnabled.value
  settingsStore.setSoundEnabled(soundEnabled.value)
}

function handleAnimationToggle() {
  animationEnabled.value = !animationEnabled.value
  settingsStore.setAnimationEnabled(animationEnabled.value)
}

function handleReset() {
  if (confirm('确定要恢复默认设置吗？')) {
    settingsStore.resetToDefaults()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
    <div class="container mx-auto px-4 py-8 max-w-lg">
      <!-- Header -->
      <header class="mb-8">
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
          ⚙️ 设置
        </h1>
      </header>

      <!-- Settings Form -->
      <div class="space-y-6">
        <!-- Default Board Size -->
        <div class="bg-white rounded-xl shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">
            默认游戏设置
          </h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                默认棋盘大小
              </label>
              <UiSelect
                :model-value="selectedSize"
                :options="sizeOptions"
                @update:model-value="handleSizeChange"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                默认难度
              </label>
              <UiSelect
                :model-value="selectedDifficulty"
                :options="difficultyOptions"
                @update:model-value="handleDifficultyChange"
              />
            </div>
          </div>
        </div>

        <!-- Sound & Animation -->
        <div class="bg-white rounded-xl shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">
            声音与动画
          </h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium text-gray-800">声音效果</div>
                <div class="text-sm text-gray-500">开启游戏音效</div>
              </div>
              <button
                type="button"
                :class="[
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                  soundEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                ]"
                role="switch"
                :aria-checked="soundEnabled"
                @click="handleSoundToggle"
              >
                <span
                  :class="[
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  ]"
                />
              </button>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium text-gray-800">动画效果</div>
                <div class="text-sm text-gray-500">开启界面动画</div>
              </div>
              <button
                type="button"
                :class="[
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                  animationEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                ]"
                role="switch"
                :aria-checked="animationEnabled"
                @click="handleAnimationToggle"
              >
                <span
                  :class="[
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    animationEnabled ? 'translate-x-5' : 'translate-x-0'
                  ]"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Reset -->
        <div class="bg-white rounded-xl shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">
            重置
          </h2>
          
          <UiButton
            variant="outline"
            class="w-full text-red-600 border-red-300 hover:bg-red-50"
            @click="handleReset"
          >
            恢复默认设置
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
