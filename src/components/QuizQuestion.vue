<script setup lang="ts">
import { computed, ref } from 'vue';
import type { QuestionCategory, QuizQuestion } from '../types/quiz';

const categoryLabels: Record<QuestionCategory, string> = {
  general: 'Preferenze generali',
  food: 'Cibo',
  venue: 'Luogo',
};

const props = defineProps<{
  question: QuizQuestion;
  categoryIntroduction?: string;
  selectedOptionId?: string;
  currentQuestionIndex: number;
  canonicalQuestionNumber: number;
  totalQuestions: number;
  reaction: string | null;
}>();

const emit = defineEmits<{
  answer: [questionId: string, optionId: string];
  back: [];
  continue: [];
}>();

const validationMessage = ref<string | null>(null);

const progressPercentage = computed(() => {
  if (props.totalQuestions <= 0) {
    return 0;
  }

  return Math.round((props.canonicalQuestionNumber / props.totalQuestions) * 100);
});

const categoryLabel = computed(() => categoryLabels[props.question.category]);

function selectOption(optionId: string): void {
  emit('answer', props.question.id, optionId);
  validationMessage.value = null;
}

function continueQuiz(): void {
  if (!props.selectedOptionId) {
    validationMessage.value = 'Scegli una risposta prima di continuare.';
    return;
  }

  emit('continue');
}
</script>

<template>
  <article :aria-labelledby="`${question.id}-category ${question.id}-heading`">
    <div class="quiz-progress">
      <p class="quiz-progress__label">
        Domanda {{ canonicalQuestionNumber }} di {{ totalQuestions }}
      </p>
      <div
        class="quiz-progress__track"
        role="progressbar"
        aria-label="Avanzamento del quiz"
        :aria-valuemin="0"
        :aria-valuemax="totalQuestions"
        :aria-valuenow="canonicalQuestionNumber"
        :aria-valuetext="`Domanda ${canonicalQuestionNumber} di ${totalQuestions}`"
      >
        <div class="quiz-progress__fill" :style="{ inlineSize: `${progressPercentage}%` }"></div>
      </div>
    </div>

    <p :id="`${question.id}-category`" class="quiz-category">Categoria: {{ categoryLabel }}</p>

    <p
      v-if="categoryIntroduction"
      :id="`${question.id}-introduction`"
      class="quiz-category-introduction"
    >
      {{ categoryIntroduction }}
    </p>

    <fieldset
      class="quiz-options"
      :aria-describedby="
        categoryIntroduction
          ? `${question.id}-category ${question.id}-introduction`
          : `${question.id}-category`
      "
    >
      <legend :id="`${question.id}-heading`">{{ question.prompt }}</legend>

      <label
        v-for="option in question.options"
        :key="option.id"
        class="quiz-option"
        :class="{ 'quiz-option--selected': selectedOptionId === option.id }"
        :for="`${question.id}-${option.id}`"
      >
        <input
          :id="`${question.id}-${option.id}`"
          :name="question.id"
          type="radio"
          :checked="selectedOptionId === option.id"
          :aria-describedby="validationMessage ? `${question.id}-error` : undefined"
          @change="selectOption(option.id)"
        />
        <span class="quiz-option__label">{{ option.label }}</span>
        <span class="quiz-option__indicator" aria-hidden="true"></span>
      </label>
    </fieldset>

    <p
      :id="`${question.id}-error`"
      class="form-status--error"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ validationMessage ?? '' }}
    </p>

    <p aria-live="polite" aria-atomic="true">
      {{ reaction ?? '' }}
    </p>

    <div class="quiz-actions">
      <button v-if="currentQuestionIndex > 0" type="button" @click="emit('back')">Indietro</button>
      <button type="button" @click="continueQuiz">Continua</button>
    </div>
  </article>
</template>

<style scoped>
.quiz-options {
  display: grid;
  gap: 0.75rem;
  min-inline-size: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.quiz-category-introduction {
  color: var(--color-muted);
  font-size: 1rem;
}

.quiz-option {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  min-block-size: 3.5rem;
  padding: 0.75rem 0.875rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-control);
  background: var(--color-surface);
  cursor: pointer;
  transition:
    border-color 160ms ease-out,
    background-color 160ms ease-out,
    box-shadow 160ms ease-out,
    transform 160ms ease-out;
}

.quiz-option:hover {
  border-color: color-mix(in srgb, var(--color-primary) 45%, var(--color-border));
  background: var(--color-surface-subtle);
  box-shadow: var(--shadow-option);
  transform: translateY(-1px);
}

.quiz-option:focus-within {
  border-color: var(--color-focus);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-focus) 25%, transparent);
}

.quiz-option--selected,
.quiz-option:has(input:checked) {
  border-color: var(--color-primary);
  background: var(--color-accent-soft);
  color: var(--color-text);
  font-weight: 800;
}

.quiz-option__label {
  min-inline-size: 0;
}

.quiz-option__indicator {
  display: grid;
  place-items: center;
  inline-size: 1.5rem;
  block-size: 1.5rem;
  border: 2px solid currentColor;
  border-radius: 50%;
  color: var(--color-muted);
}

.quiz-option--selected .quiz-option__indicator,
.quiz-option:has(input:checked) .quiz-option__indicator {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.quiz-option--selected .quiz-option__indicator::after,
.quiz-option:has(input:checked) .quiz-option__indicator::after {
  content: '✓';
  font-size: 1rem;
  font-weight: 900;
  line-height: 1;
}

@media (prefers-reduced-motion: reduce) {
  .quiz-option {
    transition: none;
  }

  .quiz-option:hover {
    transform: none;
  }
}
</style>
