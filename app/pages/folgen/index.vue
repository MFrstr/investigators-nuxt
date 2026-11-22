<template>
  <div>
    <div class="sort-container flex flex-col w-auto md:flex-row justify-center">
      <span class="sr-only">Episoden filtern</span>
      <div
        role="button"
        tabindex="0"
        aria-label="Aufsteigend sortieren"
        class="btn-sorting btn btn-outline"
        :class="{ 'active': !sortAscending }"
        @click="sortAscending=false"
      >
        <div v-if="loading" class="mr-2">
          <Spinner />
        </div>
        <ArrowUp class="mr-2"/>
        <span>aufsteigend</span>
      </div>
      <div
        role="button"
        tabindex="0"
        aria-label="Absteigend sortieren"
        class="btn-sorting btn btn-outline"
        :class="{ 'active': sortAscending }"
        @click="sortAscending=true"
      >
      <div v-if="loading" class="mr-2">
        <Spinner />
      </div>
        <ArrowDown class="mr-2"/>
        <span>absteigend</span>
      </div>

    </div>
  </div>
  <div v-if="loading" class="flex justify-center mt-6">
    <Spinner />
  </div>
  <ul
    v-else
    class="grid mx-auto justify-evenly gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mt-6"
    :key="sorting"
    :aria-label="sortAscending ? 'Episodenliste absteigend' : 'Episodenliste aufsteigend'"
    >
    <li class="flex w-full h-full" v-for="episode in sortedEpisodeList">
      <EpisodeListItem :episode="episode" class="!w-full h-full" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import dreiMetaData from '~/assets/public/serie.json';
import { ref, watch, onMounted } from "vue";
import ArrowDown from "~/components/icons/ArrowDown.vue";
import ArrowUp from "~/components/icons/ArrowUp.vue";
import Spinner from "~/components/icons/Spinner.vue";
import EpisodeListItem from "~/components/episodes/EpisodeListItem.vue";

const episodeList = dreiMetaData;
const sortAscending = ref(false);
const sorting = ref(0);
const loading = ref(false)
const sortedEpisodeList = ref(episodeList)

function sortEpisodeList () {
  loading.value = true
  sortedEpisodeList.value = episodeList.slice().sort((a, b) => {
    sorting.value++;
    return sortAscending.value ? b.nummer - a.nummer : a.nummer - b.nummer;
  });
  loading.value = false
}

onMounted(() => {
  sortEpisodeList()
})

watch(sortAscending, sortEpisodeList)
</script>