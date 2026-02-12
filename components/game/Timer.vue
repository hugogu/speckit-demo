<script setup lang="ts">
interface Props {
  time: string
  isPaused: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-2">
    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span class="font-mono text-lg font-bold" :class="{
      'text-gray-400': isPaused,
      'text-gray-900': !isPaused
    }">
      {{ time }}
    </span>
  </div>
</template>
