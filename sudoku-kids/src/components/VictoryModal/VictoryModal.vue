<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  duration: number;
  errorCount: number;
}>();

const emit = defineEmits<{
  (e: 'play-again'): void;
}>();

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}分${secs}秒`;
  }
  return `${secs}秒`;
}

const stars = computed(() => {
  if (props.errorCount === 0) return 3;
  if (props.errorCount <= 2) return 2;
  return 1;
});
</script>

<template>
  <div class="victory-overlay">
    <div class="victory-modal card">
      <div class="celebration">
        🎉 🎊 🎉
      </div>

      <h2>恭喜完成!</h2>

      <div class="stars">
        <span v-for="i in 3" :key="i" class="star" :class="{ active: i <= stars }">
          ⭐
        </span>
      </div>

      <div class="stats">
        <p class="duration">用时: {{ formatDuration(duration) }}</p>
        <p class="errors" :class="{ warning: errorCount > 0 }">
          错误: {{ errorCount }} 次
        </p>
      </div>

      <button class="btn btn-success" @click="emit('play-again')">
        再玩一次
      </button>
    </div>
  </div>
</template>

<style scoped>
.victory-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.victory-modal {
  max-width: 400px;
  width: 100%;
  text-align: center;
  animation: bounce-in 0.5s ease-out;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.celebration {
  font-size: 48px;
  margin-bottom: 16px;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

h2 {
  color: var(--color-success);
  margin-bottom: 16px;
  font-size: var(--font-size-xl);
}

.stars {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.star {
  font-size: 32px;
  opacity: 0.3;
  transition: all var(--transition-normal);
}

.star.active {
  opacity: 1;
  animation: star-pop 0.3s ease-out;
}

@keyframes star-pop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.stats {
  margin-bottom: 24px;
}

.stats p {
  margin: 8px 0;
  font-size: var(--font-size-lg);
}

.stats .duration {
  color: var(--color-text);
}

.stats .errors {
  color: var(--color-text-secondary);
}

.stats .errors.warning {
  color: var(--color-warning);
}
</style>
