<template>
  <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
    <h1 class="mb-6 text-3xl font-bold text-gray-900">答案</h1>

    <div v-if="!answer" class="py-8 text-center">
      <p class="text-gray-500">未找到该游戏的答案，可能已经过期。</p>
      <NuxtLink to="/" class="mt-4 inline-block text-primary-600 hover:underline">
        返回首页
      </NuxtLink>
    </div>

    <div v-else>
      <BaseCard class="mb-6">
        <div class="mb-4 text-center">
          <h2 class="text-xl font-semibold text-gray-900">正确解答</h2>
        </div>

        <div class="flex justify-center">
          <div
            class="inline-grid gap-px bg-gray-400"
            :style="{ gridTemplateColumns: `repeat(${answer.length}, minmax(0, 1fr))` }"
          >
            <div
              v-for="(value, idx) in answer.flat()"
              :key="idx"
              class="flex h-10 w-10 items-center justify-center bg-white text-lg font-bold"
            >
              {{ value }}
            </div>
          </div>
        </div>
      </BaseCard>

      <div class="text-center">
        <BaseButton @click="$router.push('/')">返回首页</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const gameId = route.params.id as string;

const answer = ref<number[][] | null>(null);

onMounted(() => {
  const { getAnswerById } = usePrint();
  answer.value = getAnswerById(gameId);
});
</script>
