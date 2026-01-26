<script setup lang="ts">
interface Props {
  show: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'newGame'): void;
}>();
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="emit('close')"
      >
        <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all">
          <div class="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 class="text-2xl font-bold text-primary-700 mb-2">太棒了！</h2>
          <p class="text-gray-600 mb-6">你成功完成了这个数独游戏！</p>
          <div class="space-y-3">
            <button
              class="btn-success w-full py-3 text-lg"
              @click="emit('newGame')"
            >
              再来一局 🎯
            </button>
            <button
              class="btn-secondary w-full"
              @click="emit('close')"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
