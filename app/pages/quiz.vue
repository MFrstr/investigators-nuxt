<template>
  <div class="flex flex-col justify-center items-center gap-4 md:gap-6 relative px-2 sm:px-0" aria-live="polite">
    <h2 class="sr-only">Das Drei Fragezeichen-Quiz</h2>
    <h2 class="text-center" aria-hidden="true">Das Drei ??? Quiz</h2>
    <section
      v-if="hasNotStarted || isQuizWon"
      class="flex flex-row lg:flex-col items-center gap-2 lg:absolute lg:top-0 lg:right-0"
      aria-labelledby="quizModeLabel"
    >
      <div id="quizModeLabel" class="mb-0">Modus auswählen</div>
      <div class="flex gap-2">
        <div
          tabindex="0"
          role="button"
          class="btn btn-outline"
          :class="{'active': quizMode === 'number'}"
          aria-label="Quiz-Modus Folgennummer"
          @click="quizMode = 'number'"
          @keydown.enter="quizMode = 'number'"
        >
          Nummer
        </div>
        <div
          tabindex="0"
          role="button"
          class="btn btn-outline"
          :class="{'active': quizMode === 'title'}"
          aria-label="Quiz-Modus Titel"
          @click="quizMode = 'title'"
          @keydown.enter="quizMode = 'title'"
        >
          Titel
        </div>
      </div>
    </section>

    <div v-if="hasNotStarted">
      <button
        class="btn btn-primary"
        @click="hasNotStarted = false"
        @keydown.enter="hasNotStarted = false"
      >
          START
      </button>
    </div>

    <div
      v-else-if="currentEpisodeIndex !== null && episodeArray.length > 0"
      class="w-full mt-2 md:mt-6 flex flex-col gap-6"
    >
      <div
        class="my-2 font-semibold text-xl"
        aria-live="polite"
      >
      <template v-if="quizMode === 'title'">
        <h3 class="sr-only">Welchen Titel hat Folge {{episodeArray[currentEpisodeIndex].number}} ?</h3>
        <span aria-hidden="true">Welchen Titel hat Folge&nbsp;</span>
        <span class="p-2 border border-white/15" aria-hidden="true">
          {{ episodeArray[currentEpisodeIndex].number }}
        </span>
        <span aria-hidden="true">&nbsp;?</span>
      </template>

      <template v-if="quizMode === 'number'">
        <h3 class="sr-only">Welche Episodennummer hat Folge {{episodeArray[currentEpisodeIndex].title}} ?</h3>
        <span aria-hidden="true">Welche Episodennummer hat die Folge&nbsp;</span>
          <span class="p-2 border border-white/15" aria-hidden="true">
            {{ episodeArray[currentEpisodeIndex].title }}
          </span>
        <span aria-hidden="true">&nbsp;?</span>
      </template>
      </div>

      <div v-if="quizMode === 'title'" class="grid md:grid-cols-2 gap-2">
        <div v-for="(episode, i) in answerOptions" :key="i" class="mt-2">
          <div
            role="button"
            class="btn btn-outline text-lg"
            :class="{
              'border-emerald-400 bg-emerald-400/25 hover:!bg-emerald-400/25': episode.number === selectedAnswer?.number && isAnswerCorrect,
              'border-red-400 bg-red-400/25 hover:!bg-red-400/25': episode.number === selectedAnswer?.number && !isAnswerCorrect,
            }"
            tabindex="0"
            @click="submitAnswer({selectedEpisode: episode})"
            @keydown.enter="submitAnswer({selectedEpisode: episode})"
          >
            {{ episode.title }}
          </div>
        </div>
      </div>
      <div v-if="quizMode === 'number'" class="flex flex-col gap-2">
        <label for="episodeNumber">Deine Eingabe</label>
        <input
          id="episodeNumber"
          type="number"
          v-model="episodeNumberInput"
          placeholder="Folgennummer"
          class="flex items-center justify-center h-12 w-full md:w-48 p-2 text-base-content shadow-default bg-white/25 border rounded-xs border-white/25 hover:border-white/50 cursor-pointer"
        />
        <button
          class="p-2 border cursor-pointer capitalize hover:bg-white/15 text-lg"
          :class="{
            'border-emerald-400 bg-emerald-400/25 hover:!bg-emerald-400/25': episodeNumberInput && isAnswerSent && isAnswerCorrect,
            'border-red-400 bg-red-400/25 hover:!bg-red-400/25': episodeNumberInput && isAnswerSent && !isAnswerCorrect,
          }"
          @click="submitAnswer({episodeNumber: episodeNumberInput })"
        >
          Senden
        </button>
      </div>
      <div v-if="showWrongAnswerMessage">Die Antwort war leider falsch. Versuch's nochmal</div>
    </div>

    <div v-else-if="isQuizWon" class="w-full mt-6 flex flex-col gap-2 items-center">
      <div class="font-semibold text-xl">GEWONNEN 🥳</div>
      <button
        class="p-2 border cursor-pointer hover:bg-white/15"
        @click="restartQuiz"
        @keydown.enter="restartQuiz"
      >
        Quiz neu starten
    </button>
    </div>

    <div v-if="!hasNotStarted && !isQuizWon" class="w-full">
        <span class="sr-only">Dein Fortschritt: {{ ((allEpisodes.length - episodeArray.length) / allEpisodes.length) * 100 }}%</span>
        <div class="w-full bg-white/25 rounded-xs border border-white/25 h-4 overflow-hidden">
        <div
          aria-hidden="true"
          class="bg-linear-to-r from-deep-violet/25 via-deep-purple/25 to-deep-blue/25 h-full transition-all duration-300"
          :style="{ width: ((allEpisodes.length - episodeArray.length) / allEpisodes.length * 100) + '%' }"
        ></div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import dreiMetaData from '~/assets/public/serie.json'
import { ref, onMounted } from "vue"

interface Episode {
  number: number
  title: string
}

type AnswerInput =
  | { selectedEpisode: Episode; episodeNumber?: undefined }
  | { selectedEpisode?: undefined; episodeNumber: number | null }

const quizMode = ref<"title" | "number">("title")
const hasNotStarted = ref(true)
const allEpisodes = ref<Episode[]>([])
const episodeArray = ref<Episode[]>([])
const currentEpisodeIndex = ref<number | null>(null)
const answerOptions = ref<Episode[]>([])
const isQuizWon = ref(false)
const selectedAnswer = ref<Episode | null>(null)
const isAnswerCorrect = ref<boolean |  null>(null)
const showWrongAnswerMessage = ref<boolean |  null>(null)
const episodeNumberInput = ref<number | null>(null)
const isAnswerSent = ref(false)
let episodeInput: HTMLElement | null = null

onMounted(() => {
  initializeEpisodes()
  nextQuestion()
})

function initializeEpisodes() {
  allEpisodes.value = dreiMetaData.map((e: any) => ({
    number: e.nummer,
    title: e.titel,
  }))

  allEpisodes.value.splice(5) // TODO remove

  episodeArray.value = [...allEpisodes.value]
}

function nextQuestion() {
  if (episodeArray.value.length === 0) {
    currentEpisodeIndex.value = null
    isQuizWon.value = true
    return
  }

  const randomIndex = Math.floor(Math.random() * episodeArray.value.length)
  currentEpisodeIndex.value = randomIndex

  const correctEpisode = episodeArray.value[randomIndex]

  const wrongCandidates = allEpisodes.value.filter(
    ep => ep.number !== correctEpisode.number
  )

  const randomOptions: Episode[] = []

  while (randomOptions.length < 3 && wrongCandidates.length > 0) {
    const rand = Math.floor(Math.random() * wrongCandidates.length)
    randomOptions.push(wrongCandidates[rand])
    wrongCandidates.splice(rand, 1)
  }

  randomOptions.push(correctEpisode)
  answerOptions.value = randomOptions.sort(() => Math.random() - 0.5)

  focusEpisodeNumInput()
}

function focusEpisodeNumInput () {
  if (quizMode.value === 'number') {
    if (!episodeInput) {
      episodeInput = document.getElementById('episodeNumber')
    }
    if (episodeInput) {
      episodeInput.focus()
    }
  }
}

function submitAnswer(input: AnswerInput) {
  if (quizMode.value === 'title' && input.selectedEpisode) {
    selectedAnswer.value = input.selectedEpisode
    if (currentEpisodeIndex.value != null) {
      const correctEpisode = episodeArray.value[currentEpisodeIndex.value]
      isAnswerCorrect.value = input.selectedEpisode.number === correctEpisode.number
    }
  } else if (quizMode.value === 'number' && input.episodeNumber) {
      isAnswerSent.value = true
      const episode = episodeArray.value.find((episode) => episode.number === input.episodeNumber)
      selectedAnswer.value = episode ?? null
      if (currentEpisodeIndex.value != null) {
        const correctEpisode = episodeArray.value[currentEpisodeIndex.value]
        isAnswerCorrect.value = input.episodeNumber === correctEpisode.number
      }
  }
  if (isAnswerCorrect.value) {
    setTimeout(() => {
      episodeArray.value.splice(currentEpisodeIndex.value!, 1)
      selectedAnswer.value = null
      isAnswerCorrect.value = null
      episodeNumberInput.value = null
      answerOptions.value = []
      isAnswerSent.value = false
      nextQuestion()
    }, 1000)
  } else {
    showWrongAnswerMessage.value = true
    setTimeout(() => {
      isAnswerCorrect.value = null
      selectedAnswer.value = null
      episodeNumberInput.value = null
      showWrongAnswerMessage.value = null
      isAnswerSent.value = false
      focusEpisodeNumInput()
    }, 1500)
  }
}

function restartQuiz() {
  initializeEpisodes()
  nextQuestion()
}
</script>
