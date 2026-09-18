<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import QuizQuestion from './components/QuizQuestion.vue';
import { useDateQuiz } from './composables/useDateQuiz';
import { categoryIntroductions, questions } from './data/questions';
import InvitationDecision from './components/InvitationDecision.vue';
import AvailabilityPicker from './components/AvailabilityPicker.vue';
import CompletionSummary from './components/CompletionSummary.vue';
import DeclineEnd from './components/DeclineEnd.vue';
import LocalProfileIntroduction from './components/LocalProfileIntroduction.vue';
const {
  state,
  currentQuestion,
  currentReaction,
  answer,
  back,
  continueQuiz,
  decide,
  addOrToggleDateTime,
  removeDateTime,
  setPreferredDateTime,
  complete,
  reset,
} = useDateQuiz();

const phaseHeading = ref<HTMLElement | null>(null);
const profileName = ref<string | null>(null);
const isProfileComplete = ref(false);
const isDarkTheme = ref(false);
const currentView = computed(() => (isProfileComplete.value ? state.value.phase : 'profile'));
const canonicalQuestionNumber = computed(() => {
  const canonicalQuestionIndex = questions.findIndex(
    (question) => question.id === currentQuestion.value?.id,
  );

  return canonicalQuestionIndex === -1 ? 0 : canonicalQuestionIndex + 1;
});

const categoryIntroduction = computed(() => {
  const question = currentQuestion.value;

  if (!question) {
    return undefined;
  }

  const firstQuestionInCategory = questions.find(
    (candidate) => candidate.category === question.category,
  );

  return firstQuestionInCategory?.id === question.id
    ? categoryIntroductions[question.category]
    : undefined;
});

function startQuiz(name: string): void {
  profileName.value = name;
  isProfileComplete.value = true;
}

function restartQuiz(): void {
  reset();
}

function toggleTheme(): void {
  isDarkTheme.value = !isDarkTheme.value;
}

watch(
  currentView,
  async () => {
    await nextTick();
    phaseHeading.value?.focus();
  },
  { flush: 'post' },
);
</script>

<template>
  <div class="app-shell" :class="{ 'app-shell--dark': isDarkTheme }">
    <div class="theme-controls">
      <button
        type="button"
        class="theme-toggle"
        :aria-label="isDarkTheme ? 'Tema chiaro' : 'Tema scuro'"
        :aria-pressed="isDarkTheme"
        @click="toggleTheme"
      >
        <span aria-hidden="true">{{ isDarkTheme ? '☀' : '☾' }}</span>
        <span>{{ isDarkTheme ? 'Tema chiaro' : 'Tema scuro' }}</span>
      </button>
    </div>

    <main>
      <section
        v-if="currentView === 'profile'"
        class="welcome-screen"
        aria-labelledby="profile-heading"
      >
        <header class="welcome-hero">
          <p class="welcome-kicker">Un incontro inizia con una curiosità gentile</p>
          <h1 id="profile-heading" ref="phaseHeading" tabindex="-1">NeltaDate</h1>
          <p class="welcome-message">
            Prenditi un momento per scegliere ciò che ti somiglia. Cominciamo dal modo in cui
            preferisci essere chiamato.
          </p>
        </header>

        <LocalProfileIntroduction @complete="startQuiz" />
      </section>

      <section v-else-if="state.phase === 'quiz'" aria-labelledby="quiz-heading">
        <h1 id="quiz-heading" ref="phaseHeading" tabindex="-1">
          Piacere mio, {{ profileName }}, stupiscimi ❤️
        </h1>

        <Transition name="quiz-question" mode="out-in">
          <QuizQuestion
            v-if="currentQuestion"
            :key="currentQuestion.id"
            :question="currentQuestion"
            :category-introduction="categoryIntroduction"
            :selected-option-id="state.answers[currentQuestion.id]"
            :current-question-index="state.currentQuestionIndex"
            :canonical-question-number="canonicalQuestionNumber"
            :total-questions="questions.length"
            :reaction="currentReaction"
            @answer="answer"
            @back="back"
            @continue="continueQuiz"
          />
        </Transition>
      </section>

      <section v-else-if="state.phase === 'decision'" aria-labelledby="decision-heading">
        <h1 id="decision-heading" ref="phaseHeading" tabindex="-1">L’invito</h1>

        <InvitationDecision @decide="decide" />
      </section>

      <section v-else-if="state.phase === 'availability'" aria-labelledby="availability-heading">
        <p class="acceptance-celebration" role="status" aria-live="polite" aria-atomic="true">
          Che bello, hai detto sì! Ora scegli con calma un momento che ti va.
        </p>
        <h1 id="availability-heading" ref="phaseHeading" tabindex="-1">
          Scegli quando potresti esserci
        </h1>

        <AvailabilityPicker
          :selected-date-times="state.selectedDateTimes"
          :preferred-date-time="state.preferredDateTime"
          @add-or-toggle="addOrToggleDateTime"
          @remove="removeDateTime"
          @set-preferred="setPreferredDateTime"
          @back="back"
          @complete="complete"
        />
      </section>

      <section v-else-if="state.phase === 'summary'" aria-labelledby="summary-heading">
        <h1 id="summary-heading" ref="phaseHeading" tabindex="-1">Il nostro piano</h1>

        <CompletionSummary
          :name="profileName ?? ''"
          :answers="state.answers"
          :selected-date-times="state.selectedDateTimes"
          :preferred-date-time="state.preferredDateTime"
          @restart="restartQuiz"
        />
      </section>

      <section v-else aria-labelledby="declined-heading">
        <h1 id="declined-heading" ref="phaseHeading" tabindex="-1">Grazie</h1>

        <DeclineEnd />
      </section>
    </main>
  </div>
</template>
