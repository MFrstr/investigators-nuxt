<template>
    <div
        class="accordion-item w-full h-fit flex flex-col my-2 mx-auto p-2 text-white bg-white/15 shadow-default backdrop-filter-blur rounded-xs border border-white/15"
        v-for="(item, index) in items" 
        :key="index"
    >
        <h2 :id="item.name.replace(/\s/g, '').toUpperCase()" class="mb-0">
            <button
                class="accordion-button w-full flex cursor-pointer justify-between items-center text-white bg-transparent" 
                @click="toggle(index)"
            >
                <span class="font-semibold">{{ item.name }}</span>
                <span class="sr-only">{{isOpen(index) ? 'Einklappen' : 'Ausklappen'}}</span>
                <svg
                    aria-hidden="true"
                    focusable="false"
                    :class="{'rotate-180': isOpen(index)}" 
                    class="size-4 transform transition-transform duration-600 ease-in-out" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
        </h2>
        <div v-if="isOpen(index)" :class="{ 'max-h-0 overflow-hidden': !isOpen(index), 'py-2 ': isOpen(index) }" class="transition-all duration-250 ease-in">
            <ul v-for="role in item.episodes" :aria-label="`Als ${role.roleName} in Folge ${role.episodeNumbers[0]} ${getEpisodeName(role.episodeNumbers[0])}`">
                <template v-if="role.episodeNumbers.length === 1">
                    <li class="py-4">
                        <span>Als {{ role.roleName }} in Folge&nbsp</span> 
                        <span>
                            <RouterLink :to="`/folgen/${role.episodeNumbers[0]}`" :aria-label="`Folge ${role.episodeNumbers[0]}`">
                                {{ role.episodeNumbers[0] }}
                                <span class="p-1 cursor-pointer rounded-xs border border-white/15 hover:bg-white/15">
                                    {{ getEpisodeName(role.episodeNumbers[0]) }}
                                </span>
                            </RouterLink>
                        </span>
                    </li>
                </template>
                
                <template v-else>
                    <div aria-hidden="true" class="mb-2">Als {{ role.roleName }} in den Folgen:</div> 
                    <ul class="flex flex-wrap justify-start pb-4" :aria-label="`Als ${role.roleName} in`">
                        <li v-for="num in role.episodeNumbers" class="p-1 cursor-pointer rounded-xs border border-white/15 hover:bg-white/15">
                            <RouterLink
                            :aria-label="`Folge ${num}`"
                            :to="`/folgen/${num}`"
                        >
                            {{ num }}
                        </RouterLink>
                        </li>
                    </ul>
                </template>
            </ul>
            <button class="p-1 cursor-pointer rounded-xs border border-white/15 bg-white/15 hover:border-white/30 hover:bg-white/30" @click="toggle(index)">Zuklappen und weiter</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue'
import type { Voice } from '../../utils/types/Roles'
import dreiMetaData from '~/assets/public/serie.json'
import { useRoute } from 'vue-router';

const props = defineProps<{
  items: Voice[]
}>();

const route = useRoute();
const openIndex = ref(null);

const toggle = (index : any) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const isOpen = (index : any) => {
  return openIndex.value === index;
};

onMounted(() => {
    const hash = route.hash;

    if (hash) {
        const id = hash.replace('#', '').toUpperCase();
        clickAccordionButtonById(id);
    }
})

function getEpisodeName (episodeNumber : number) {
    return dreiMetaData[episodeNumber - 1].titel;
};

function clickAccordionButtonById(id: string) {
  const heading = document.getElementById(id);
  if (!heading) return;

  const button = heading.querySelector('button');
  if (button) {
    button.click();
  }
}
</script>