<template>
  <div>
    <Navigation />
    <slot />
  </div>
</template>

<script setup>
import Navigation from '@/components/Navigation.vue';
</script>

<style>
/* Global styles can go here */
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f8f9fa;
}
</style>
