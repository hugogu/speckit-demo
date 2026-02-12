<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  isRunning?: boolean;
}>();

const emit = defineEmits<{
  (e: 'tick', seconds: number): void;
  (e: 'pause'): void;
  (e: 'resume'): void;
}>();

const elapsedSeconds = ref(0);
let intervalId: number | null = null;

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startTimer(): void {
  if (intervalId) return;

  intervalId = window.setInterval(() => {
    elapsedSeconds.value++;
    emit('tick', elapsedSeconds.value);
  }, 1000);
}

function stopTimer(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function resetTimer(): void {
  stopTimer();
  elapsedSeconds.value = 0;
}

function pause(): void {
  stopTimer();
  emit('pause');
}

function resume(): void {
  startTimer();
  emit('resume');
}

watch(() => props.isRunning, (newValue: boolean) => {
  if (newValue) {
    resume();
  } else {
    pause();
  }
});

onMounted(() => {
  if (props.isRunning) {
    startTimer();
  }
});

onUnmounted(() => {
  stopTimer();
});

defineExpose({
  resetTimer,
  pause,
  resume,
});
</script>

<template>
  <div class="timer">
    <span class="timer-display">{{ formatTime(elapsedSeconds) }}</span>
  </div>
</template>

<style scoped>
.timer {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  padding: 12px 24px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.timer-display {
  font-size: var(--font-size-xl);
  font-weight: 600;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
  color: var(--color-text);
}
</style>
