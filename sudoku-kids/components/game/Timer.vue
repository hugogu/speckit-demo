<template>
  <div class="rounded-lg bg-gray-800 px-4 py-2 text-white">
    <span class="font-mono text-xl font-bold">{{ formattedTime }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isRunning: boolean;
}>();

const { formattedTime, start, pause } = useTimer();

watch(
  () => props.isRunning,
  (running) => {
    if (running) {
      start();
    } else {
      pause();
    }
  },
  { immediate: true }
);
</script>
