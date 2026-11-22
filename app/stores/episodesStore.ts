import { defineStore } from 'pinia';
import dreiMetaData from '~/assets/public/serie.json'
import type { Episode } from '../utils/types/episode';
import { type Ref, ref } from 'vue';

export const useEpisodesStore = defineStore('episodes', () => {
    const allEpisodes =  dreiMetaData
    const newestEpisode: Ref<Episode | undefined> = ref(undefined)
    const unreleasedEpisodes: Ref<Episode[]> = ref([])
    
    function getNewestEpisode() {
            const descendingEpisodeList = allEpisodes.slice().sort((a, b) => {
            return b.nummer - a.nummer
          })
          newestEpisode.value = descendingEpisodeList.find((episode) => {            
            return !episode.unvollständig
          })
    }

    function getUnreleasedEpisode() {
        allEpisodes.forEach((episode) => {
            if (episode.unvollständig) {
                unreleasedEpisodes.value.push(episode)
            }
        })
    }

    function getEpisode(episodeNumber : number) {
        const episode = dreiMetaData[episodeNumber];
        return episode as Episode;
    }

    return {
        newestEpisode,
        unreleasedEpisodes,
        getUnreleasedEpisode,
        getNewestEpisode,
        getEpisode
    }
})