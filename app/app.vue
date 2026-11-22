<template>
  <PageHead />

  <main class="max-w-5xl lg:max-w-7xl mx-auto">
    <NuxtPage />
    <ToTopButton />
  </main>
</template>
<script setup lang="ts">
import PageHead from './components/Head/PageHead.vue'
import ToTopButton from './components/misc/ToTopButton.vue';
</script>
