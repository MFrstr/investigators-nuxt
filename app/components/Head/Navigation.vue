<template>
    <header class="my-8">
        <div class="flex flex-col md:flex-row justify-between items-center w-full text-base mt-6 pb-6 px-6 border border-transparent border-b-white/15">
            <div class="self-auto flex-1 order-1"></div>
            <nav class="order-2 mb-4 md:mb-0">
                <RouterLink to="/" class="p-2 md:px-4 md:py-2 border border-transparent border-l-white/15">News</RouterLink>
                <RouterLink to="/folgen" class="p-2 md:px-4 md:py-2 border border-transparent  border-x-white/15">Alle Folgen</RouterLink>
                <RouterLink to="/stimmen" class="p-2 md:px-4 md:py-2 border border-transparent border-r-white/15">Stimmen</RouterLink>
                <RouterLink to="/quiz" class="p-2 md:px-4 md:py-2 border border-transparent border-r-white/15">Quiz</RouterLink>
            </nav>
            <div class="relative w-full md:ml-auto mb-0 flex flex-1 order-3 justify-center md:justify-end">
                <Search />
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Search from './Search.vue';
</script>

<style scoped>
    nav a.router-link-exact-active {
        text-decoration: underline;
        background-color: rgba(254, 235, 250, 0.1);
    }
</style>