<template>
    <div class="sort-container flex flex-row w-full justify-center my-10 mx-auto gap-2">
        <div
            tabindex="0"
            role="button"
            class="btn btn-outline btn-sorting"
            :class="{'active': showAllRoles}"
            @click="filterVoices('all')"
            @keydown.enter="filterVoices('all')"
        >
            <span>Alle anzeigen</span>
        </div>
        <div
            tabindex="0"
            role="button"
            class="btn btn-outline btn-sorting"
            :class="{'active': showNarrators}"
            @click="filterVoices('narrator')"
            @keydown.enter="filterVoices('narrator')"
        >
            <span>Erzähler</span>
        </div>
    </div>
    <div class="flex flex-wrap">
        <div v-if="showAllRoles"class="accordion grid md:grid-cols-2 gap-2 w-full">
            <AccordionNew :items="getAllVoices" />
        </div>
        <div v-else-if="!showAllRoles && showNarrators" class="accordion grid md:grid-cols-2 gap-2 w-full">
            <AccordionNew :items="getAllNarrators" />
        </div>
    </div>
</template>
<script setup lang="ts">
import dreiMetaData from '~/assets/public/serie.json'
    import { computed, ref } from "vue";
    import AccordionNew from "../components/misc/Accordion.vue";
    import type { Voice } from "../utils/types/Roles.ts";
    import type { Sprecher } from '../utils/types/episode.ts'

    const showNarrators = ref(false);
    const showAllRoles = ref(true);
    let voices: Voice[] = [];

    const getAllVoices = computed(() => {

        for (let episodeNumber = 0; episodeNumber < dreiMetaData.length; episodeNumber++) {
            const episode = dreiMetaData[episodeNumber];
            
            if (episode != null) {

                const isSprecherArray = Array.isArray(episode.sprecher) && 
                    episode.sprecher.length > 0 && 
                    typeof episode.sprecher[0] === 'object' &&
                    'rolle' in episode.sprecher[0]
            
                if (episode.sprecher && Array.isArray(episode.sprecher) && episode.sprecher.length > 0) {
                    for (const roleData of episode.sprecher) {
                        let roleName: string;
                        let voiceName: string;

                        if (isSprecherArray) {
                            const role = roleData as Sprecher;
                            roleName = role.rolle;
                            voiceName = role.sprecher;
                        } else {
                            const role = roleData as string[];
                            roleName = role[0];
                            voiceName = role[1];
                        }

                        const existingVoice = voices.find(voice => voice.name === voiceName);

                        if (existingVoice) {
                            const existingRole = existingVoice.episodes.find(role => role.roleName === roleName);

                            if (existingRole) {
                                existingRole.episodeNumbers.push(episodeNumber + 1);
                            } else {
                                existingVoice.episodes.push({
                                    episodeNumbers: [episodeNumber + 1],
                                    roleName: roleName
                                });
                            }
                        } else {
                            const newVoice: Voice = {
                                name: voiceName,
                                episodes: [{
                                    episodeNumbers: [episodeNumber + 1],
                                    roleName: roleName
                                }],
                                nameCode: voiceName.replace(/\s+/g, '')
                            };
                            voices.push(newVoice);
                        }
                    }
                }
            }
        }
        return voices;
    });

    const filterVoices = (filter: string) => {
        if (filter === 'all') {
            showAllRoles.value = true;
            showNarrators.value = false;
        } else if (filter === 'narrator') {
            showAllRoles.value = false;
            showNarrators.value = true;
        }
    };

    const getAllNarrators = computed(() => {
        voices = voices.filter(voice => voice.episodes.some(role => role.roleName.includes('Erzähler')));
        return voices;
    });
</script>