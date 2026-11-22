<template>
    <div v-if="isEpisodeLoaded" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-start gap-3">
        <NuxtImg v-if="episode.links.cover" :src="episode.links.cover" class="aspect-suqare mx-auto sm:mx-0" :alt="episode.titel" />
        <NuxtImg v-else src="../../assets/public/fragezeichen-logo.png" class="w-[150px] sm:w-[200px] lg:w-[250px]" alt="Logo der drei Fragezeichen, kein Cover vorhanden" />
        <h1 class="hidden" :aria-label="episode.titel">{{ episode.titel }}</h1>
        <table class="text-base-content text-sm md:text-base table-auto md:table-fixed mx-auto sm:mx-0">
            <tbody>
                <tr>
                    <th class="text-left">Nummer</th>
                    <td class="">{{ episode.nummer }}</td>
                </tr>
                <tr>
                    <th class="text-left">Titel</th>
                    <td class="">{{ episode.titel }}</td>
                </tr>
                <tr>
                    <th class="text-left">Autor<wbr/>*in</th>
                    <td class="">{{ episode.autor }}</td>
                </tr>
                <tr>
                    <th class="text-left">Hörspiel<wbr/>skript<wbr/>autor*in</th>
                    <td class="">{{ episode.hörspielskriptautor }}</td>
                </tr>
                <tr>
                    <th class="text-left">Veröff<wbr/>entlichungs<wbr/>datum</th>
                    <td class="">
                        {{ convertPublishDateToLocaleDate
                            ( episode.veröffentlichungsdatum )
                        }}
                    </td>
                </tr>
                <tr v-if="episode.kapitel">
                    <th class="text-left">Kapitel</th>
                    <td class="">{{ episode.kapitel?.length }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-if="episode.beschreibung" tabindex="0" class="mt-12">
        <div class="text-base-content bg-white/15 shadow-md rounded-xs border border-white/15 p-4">
            <h2 class="mb-0 text-lg">
                <button 
                    class="accordion-button cursor-pointer w-full h-fit flex justify-between items-center text-base-content bg-transparent" 
                    @click="isBeschreibungOpen = !isBeschreibungOpen"
                    @keydown.enter="isBeschreibungOpen = !isBeschreibungOpen"
                >
                    <span>Klappentext</span>
                    <svg 
                        :class="{'rotate-180': isBeschreibungOpen}" 
                        class="size-4 transform transition-transform duration-600 ease-in-out" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </h2>
            <div v-if="isBeschreibungOpen" :class="{ 'max-h-full overflow-hidden': !isBeschreibungOpen, 'py-2 ': isBeschreibungOpen }" class="transition-all duration-250 ease-in">
                <div>{{ episode.beschreibung }}</div>
            </div>
        </div>
    </div>

    <div v-if="episode.sprecher" tabindex="0" class="my-6">
        <div class="text-base-content bg-white/15 shadow-md rounded-xs border border-white/15 p-4">
            <h2 class="mb-0 text-lg">
                <button
                    class="accordion-button cursor-pointer w-full h-fit flex justify-between items-center text-base-content bg-transparent" 
                    @click="isSprecherOpen = !isSprecherOpen"
                    @keydown.enter="isSprecherOpen = !isSprecherOpen"
                >
                    <span>Stimmen</span>
                    <svg 
                        :class="{'rotate-180': isSprecherOpen}" 
                        class="size-4 transform transition-transform duration-600 ease-in-out" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </h2>
            <div
                v-if="isSprecherOpen"
                :class="{ 'max-h-full overflow-hidden': !isSprecherOpen, 'py-2 ': isSprecherOpen }"
                class="grid md:grid-cols-2 gap-y-2 gap-x-6 transition-all duration-250 ease-in"
            >
            <template v-if="isSprecherArray">
                <div v-for="(voice, index) in episode.sprecher as Sprecher[]" :key="index">
                    <div>{{ voice.rolle }} spricht
                        <RouterLink
                            :to="`/stimmen/#${voice.sprecher.replace(/\s/g, '').toUpperCase()}`"
                            class="p-1 cursor-pointer rounded-xs border border-white/15 hover:bg-white/15"
                        >
                            {{ voice?.sprecher }}
                        </RouterLink>
                    </div>
                </div>
                </template>
                <template v-else>
                <div v-for="(voice, index) in episode.sprecher as SprecherArray" :key="index">
                    <div>{{ voice[0] }} spricht 
                        <RouterLink
                            :to="`/stimmen/#${voice[1].replace(/\s/g, '').toUpperCase()}`"
                            class="p-1 cursor-pointer rounded-xs border border-white/15 hover:bg-white/15"
                        >
                            {{ voice[1] }}
                        </RouterLink>
                    </div>
                </div>
            </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { Episode, Sprecher, SprecherArray } from '../../utils/types/episode'
import { useEpisodesStore } from '../../stores/episodesStore'
import { onBeforeMount, ref, computed, watch } from 'vue'

const episodeStore = useEpisodesStore()
const episode = ref({} as Episode)
const isEpisodeLoaded = ref(false)
const isBeschreibungOpen = ref(false)
const isSprecherOpen = ref(false)
const route = useRoute()

const isSprecherArray = computed(() => {
    return Array.isArray(episode.value.sprecher) && 
        episode.value.sprecher.length > 0 && 
        typeof episode.value.sprecher[0] === 'object' &&
        'rolle' in episode.value.sprecher[0]
})

const loadEpisode = async (episodeParam: number) => {
      const episodeNumber = Number(episodeParam) - 1
      episode.value = await episodeStore.getEpisode(episodeNumber)

      if (episode.value && episode.value.autor !== '') {
        isEpisodeLoaded.value = true
      } else {
        isEpisodeLoaded.value = false
      }
    }

watch(
    () => route.params.episodeNumber,
    (newVal) => {
        const num = Number(newVal)
        if (!isNaN(num)) {
            loadEpisode(num)
        }
    }
)

onBeforeMount(async () => {
    const num = Number(route.params.id)
      if (!isNaN(num)) {
        loadEpisode(num)
      }
})

function convertPublishDateToLocaleDate(date : string) {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
    } as Intl.DateTimeFormatOptions
    return new Date(date).toLocaleDateString('de-DE', options);
};
</script>