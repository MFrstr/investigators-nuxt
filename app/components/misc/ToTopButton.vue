<template>
    <button
        v-if="isPageScrolled"
        class="btn fixed bottom-4 right-4 bg-white/15 hover:bg-white/25 shadow-default backdrop-blur-xs"
        @click="scrollToTop()"
    >
        Nach oben
    </button>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isPageScrolled = ref(false)

function handleScroll() {
    isPageScrolled.value = window.scrollY >= window.innerHeight
}

function scrollToTop() {
    window.scroll({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>