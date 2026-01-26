<!--
  Game Controls Component
  Reference: tasks.md T022
  Reference: spec.md §US4 - check answers button
  Reference: spec.md §US5 - print button (P2)
-->
<script setup lang="ts">

const emit = defineEmits<{
  (e: 'check'): void;
  (e: 'reset'): void;
  (e: 'newGame'): void;
  (e: 'print'): void;
}>();
</script>

<template>
  <div class="flex flex-wrap justify-center gap-3">
    <!-- Check Answers - Reference: spec.md §FR-006 -->
    <button
      type="button"
      class="btn-success"
      aria-label="检查答案"
      @click="emit('check')"
    >
      ✓ 检查答案
    </button>

    <!-- Reset - clear user input -->
    <button
      type="button"
      class="btn-secondary"
      aria-label="重置游戏"
      @click="emit('reset')"
    >
      ↺ 重置
    </button>

    <!-- New Game -->
    <button
      type="button"
      class="btn-secondary"
      aria-label="新游戏"
      @click="emit('newGame')"
    >
      + 新游戏
    </button>

    <!-- Print - Reference: spec.md §US5 -->
    <button
      type="button"
      class="btn-secondary no-print"
      aria-label="打印"
      @click="emit('print')"
    >
      🖨 打印
    </button>
  </div>
</template>
