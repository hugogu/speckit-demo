<script setup lang="ts">
interface Props {
  isPlaying: boolean
  isPaused: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  newGame: []
  pause: []
  resume: []
}>()
</script>

<template>
  <div class="flex flex-wrap justify-center gap-3">
    <UiButton
      variant="outline"
      size="md"
      @click="emit('newGame')"
    >
      <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      新游戏
    </UiButton>
    
    <UiButton
      v-if="isPlaying && !isPaused"
      variant="secondary"
      size="md"
      @click="emit('pause')"
    >
      <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      暂停
    </UiButton>
    
    <UiButton
      v-else-if="isPlaying && isPaused"
      variant="primary"
      size="md"
      @click="emit('resume')"
    >
      <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      继续
    </UiButton>
  </div>
</template>
