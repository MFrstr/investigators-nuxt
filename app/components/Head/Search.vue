<template>
    <div ref="target" aria-live="polite" class="w-full md:w-auto">
      <form>
        <label for="episode-search" class="relative sr-only hidden">Eine Folge suchen</label>
        <input
          id="episode-search"
          v-model="searchQuery"
          placeholder="Folge suchen..."
          aria-label="Eine Folge suchen"
          @keydown.esc="searchQuery = ''"
          class="flex items-center justify-center h-12 w-full md:w-48 p-2 text-base-content shadow-default bg-white/25 border rounded-xs border-white/25 hover:border-white/50 cursor-pointer"
        />
        <button v-if="searchQuery != ''" class="absolute inset-y-0 right-0 size-12 cursor-pointer flex items-center justify-center">
          <CloseIcon />
        </button>
      </form>
  
      <ul v-if="searchQuery != ''" aria-label="Suchergebnisse" class="absolute w-full md:w-5/6 top-[52px] right-0 z-50 flex flex-col bg-neutral color-base-content border rounded-xs border-white/50">
        <template v-for="(ep, index) in filteredEpisodes">
          <RouterLink
            v-if="index <= 10"
            :key="index"
            class="px-4 py-2 cursor-pointer hover:bg-white/25 w-full capitalize flex items-center gap-2"
            :to="`/folgen/${ep.nummer}`"
            :aria-label="`Folge ${ep.nummer}, Titel ${ep.titel}`"
            role="listitem"
            @click="searchQuery = ''"
          >
            <span class="p-1 cursor-pointer rounded-xs border border-white/15 min-w-[27.8px] text-center">{{ ep.nummer }}</span>
            <span>{{ ep.titel }}</span>
          </RouterLink>
        </template>
        <div v-if="filteredEpisodes.length > 10" class="px-4 py-2 cursor-pointer hover:bg-white/25 w-full">
          Mehr Ergebnisse
        </div>
        <li v-if="filteredEpisodes.length === 0" class="px-4 py-2 cursor-pointer hover:bg-white/25 w-full">
          Kein Ergebnis
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
import { ref, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import dreiMetaData from '~/assets/public/serie.json'
import CloseIcon from '../icons/CloseIcon.vue'

const searchQuery = ref('')
const target = ref(null)

onClickOutside(target, () => {
  searchQuery.value = ''
})

const episodeList = dreiMetaData

const filteredEpisodes = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return []

  return episodeList.filter(ep =>
    ep.titel.toLowerCase().includes(query) ||
    ep.nummer.toString().includes(query)
  )
})
</script>
