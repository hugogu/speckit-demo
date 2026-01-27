<script setup lang="ts">
interface Props {
  time: string
  isPaused?: boolean
}

withDefaults(defineProps<Props>(), {
  isPaused: false,
})
</script>

<template>
  <div class="flex items-center gap-2 text-lg font-mono">
    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span :class="isPaused ? 'text-gray-400' : 'text-gray-700'">
      {{ time }}
    </span>
    <span v-if="isPaused" class="text-xs text-gray-400">(暂停)</span>
  </div>
</template>
