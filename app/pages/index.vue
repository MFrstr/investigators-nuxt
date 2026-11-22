<template>
  <div class="flex flex-col gap-6 lg:gap-16 mt-5 px-6">
    <div>
      <h3>
        {{
          episodeStore.unreleasedEpisodes.length === 1 ? 'Anstehendes Release' : 'Anstehende Releases'
        }}
      </h3>
      <ul v-if="episodeStore.unreleasedEpisodes.length >= 1" class="flex flex-row overflow-y-scroll gap-6">
        <template v-for="episode in episodeStore.unreleasedEpisodes">
          <li class="flex flex-col w-full h-full shrink-0 max-w-3xs gap-1">
            <p>
              {{ convertPublishDateToLocaleDate
                (
                  episode.veröffentlichungsdatum
                )
              }}
            </p>
            <EpisodeListItem :episode="episode" class="!w-full h-full" />
          </li>
        </template>
      </ul>
    </div>

    <div v-if="episodeStore.newestEpisode" class="max-w-3xs">
      <h3>Zuletzt veröffentlicht</h3>
      <div class="flex flex-col gap-2">
        <p>
          {{ convertPublishDateToLocaleDate(
              episodeStore.newestEpisode.veröffentlichungsdatum
            )
          }}
        </p>
        <EpisodeListItem :episode="episodeStore.newestEpisode" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEpisodesStore } from '~/stores/episodesStore';
import EpisodeListItem from '~/components/episodes/EpisodeListItem.vue';

const episodeStore = useEpisodesStore();
episodeStore.getNewestEpisode();
episodeStore.getUnreleasedEpisode();

function convertPublishDateToLocaleDate(date : string) {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
    } as Intl.DateTimeFormatOptions
    return new Date(date).toLocaleDateString('de-DE', options);
};
</script>
