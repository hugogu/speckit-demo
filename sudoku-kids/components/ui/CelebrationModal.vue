<!--
  Celebration Modal Component
  Reference: tasks.md T023
  Reference: spec.md §FR-007 - celebration feedback on correct completion
  Reference: spec.md §US4-2 - celebration animation and encouragement
-->
<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  show: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'newGame'): void;
}>();

// Animation state
const isAnimating = ref(false);

watch(() => props.show, (newVal) => {
  if (newVal) {
    isAnimating.value = true;
    // Reset animation after delay
    setTimeout(() => {
      isAnimating.value = false;
    }, 2000);
  }
});

/**
 * Encouraging messages for children
 * Reference: spec.md §US4-2 - 鼓励性文字
 */
const encouragements = [
  '太棒了！你真聪明！🌟',
  '恭喜完成！继续加油！🎉',
  '你做到了！真了不起！🏆',
  '完美！你是数独小天才！✨',
];

const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="celebration-title"
      >
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black/50"
          @click="emit('close')"
        />

        <!-- Modal Content -->
        <div 
          :class="[
            'relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center',
            'transform transition-all duration-300',
            isAnimating ? 'scale-110' : 'scale-100'
          ]"
        >
          <!-- Celebration Icon -->
          <div 
            :class="[
              'text-6xl mb-4',
              isAnimating ? 'animate-bounce' : ''
            ]"
          >
            🎊
          </div>

          <!-- Title -->
          <h2 
            id="celebration-title"
            class="text-2xl font-bold text-primary-700 mb-4"
          >
            恭喜完成！
          </h2>

          <!-- Encouragement Message -->
          <p class="text-lg text-gray-600 mb-6">
            {{ randomEncouragement }}
          </p>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              class="btn-primary"
              @click="emit('newGame')"
            >
              再来一局 🎮
            </button>
            <button
              type="button"
              class="btn-secondary"
              @click="emit('close')"
            >
              查看棋盘
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative {
  transform: scale(0.9);
}

.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>
