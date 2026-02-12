<script setup lang="ts">
import { ref, onMounted } from 'vue'

const message = ref('Hello, Sudoku Game!')

onMounted(() => {
  console.log('Test page loaded')
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ message }}</h1>
      <p class="text-gray-600">This is a test page to verify the basic setup.</p>
    </div>
  </div>
</template>
