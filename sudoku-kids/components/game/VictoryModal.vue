<template>
  <BaseModal :model-value="show" title="恭喜完成！" @update:model-value="$emit('close')">
    <div class="text-center">
      <div class="mb-6 text-6xl">🎉</div>
      <p class="mb-4 text-lg text-gray-700">你太棒了！成功完成了这个数独！</p>

      <div class="mb-6 grid grid-cols-2 gap-4">
        <div class="rounded-lg bg-primary-50 p-4">
          <div class="text-sm text-primary-600">用时</div>
          <div class="text-2xl font-bold text-primary-900">{{ formatTime(elapsedTime) }}</div>
        </div>
        <div class="rounded-lg bg-red-50 p-4">
          <div class="text-sm text-red-600">错误次数</div>
          <div class="text-2xl font-bold text-red-900">{{ errorCount }}</div>
        </div>
      </div>

      <div class="flex justify-center gap-4">
        <BaseButton @click="$emit('play-again')">再玩一局</BaseButton>
        <BaseButton variant="secondary" @click="$emit('close')">查看历史</BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
  elapsedTime: number;
  errorCount: number;
}>();

defineEmits<{
  'play-again': [];
  close: [];
}>();

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
</script>
