<template>
    <RouterLink ref="episodeCover" :to="`/folgen/${episode?.nummer}`" :aria-label="`Folge ${episode.nummer}, Titel ${episode.titel}`" class="card">
        <NuxtImg
            v-if="episode.links.cover"
            :src="episode.links.cover"
            sizes="140px md:270px"
            densities="x1 x2"
            format="webp"
            quality="75"
            loading="lazy"
            placeholder="../../icons/Spinner.vue"
            class="object-cover aspect-square"
            :alt="`Cover Folge ${episode.nummer}`"
        />

        <div v-else class="flex flex-col text-sm text-left hyphens-auto">
            <div class="flex flex-row justify-between items-start mb-2">
                <div class="p-2 aspect-1/1 mr-3 rounded-full border border-white/15 w-fit flex items-center align-center">
                    <span>{{ episode.nummer }}</span>
                </div>
            <NuxtImg
                src="../../assets/public/fragezeichen-logo.png"
                loading="lazy"
                alt="Logo der drei Fragezeichen, kein Cover vorhanden"
            />
            </div>
        </div>
    </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { Episode } from '~/utils/types/episode';
import Spinner from "~/components/icons/Spinner.vue";

const props = defineProps<{
    episode: Episode
}>();
</script>