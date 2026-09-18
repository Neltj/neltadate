import { computed, ref, type ComputedRef } from 'vue';
import { questions } from '../data/questions';
import { isFutureLocalDateTime, isValidLocalDateTime } from '../utils/dateTime';
import type {
  DateQuizCommands,
  DateQuizFlowState,
  Decision,
  FlowPhase,
  LocalDateTime,
  QuizAnswers,
  QuizQuestion,
} from '../types/quiz';

export interface UseDateQuiz extends DateQuizCommands {
  readonly state: ComputedRef<DateQuizFlowState>;
  readonly activeQuestions: ComputedRef<readonly QuizQuestion[]>;
  readonly currentQuestion: ComputedRef<QuizQuestion | null>;
  readonly currentReaction: ComputedRef<string | null>;
}

export function useDateQuiz(): UseDateQuiz {
  const phase = ref<FlowPhase>('quiz');
  const answers = ref<Record<string, string>>({});
  const currentQuestionIndex = ref(0);
  const decision = ref<Decision>(null);
  const selectedDateTimes = ref<LocalDateTime[]>([]);
  const preferredDateTime = ref<LocalDateTime | null>(null);

  const activeQuestions = computed(() => questions);

  const currentQuestion = computed(() => activeQuestions.value[currentQuestionIndex.value] ?? null);

  const currentReaction = computed(() => {
    const question = currentQuestion.value;

    if (!question) return null;

    return (
      question.options.find((option) => option.id === answers.value[question.id])?.reaction ?? null
    );
  });

  const state = computed<DateQuizFlowState>(() => {
    const readonlyAnswers: QuizAnswers = { ...answers.value };
    const readonlyDateTimes = [...selectedDateTimes.value] as readonly LocalDateTime[];

    switch (phase.value) {
      case 'quiz':
        return {
          phase: 'quiz',
          answers: readonlyAnswers,
          currentQuestionIndex: currentQuestionIndex.value,
          decision: null,
          selectedDateTimes: readonlyDateTimes,
          preferredDateTime: preferredDateTime.value,
        };
      case 'decision':
        return {
          phase: 'decision',
          answers: readonlyAnswers,
          decision: null,
          selectedDateTimes: readonlyDateTimes,
          preferredDateTime: preferredDateTime.value,
        };
      case 'availability':
        return {
          phase: 'availability',
          answers: readonlyAnswers,
          decision: 'accepted',
          selectedDateTimes: readonlyDateTimes,
          preferredDateTime: preferredDateTime.value,
        };
      case 'summary':
        return {
          phase: 'summary',
          answers: readonlyAnswers,
          decision: 'accepted',
          selectedDateTimes: readonlyDateTimes,
          preferredDateTime: preferredDateTime.value,
        };
      case 'declined':
        return {
          phase: 'declined',
          answers: readonlyAnswers,
          decision: 'declined',
          selectedDateTimes: [],
          preferredDateTime: null,
        };
      default:
        throw new Error('Unsupported quiz phase');
    }
  });

  function answer(questionId: string, optionId: string): boolean {
    if (phase.value !== 'quiz') return false;

    const question = currentQuestion.value;

    if (!question || question.id !== questionId) return false;
    if (!question.options.some((option) => option.id === optionId)) return false;

    answers.value = { ...answers.value, [questionId]: optionId };

    return true;
  }

  function back(): boolean {
    if (phase.value === 'availability') {
      phase.value = 'decision';
      decision.value = null;
      return true;
    }

    if (phase.value !== 'quiz' || currentQuestionIndex.value === 0) {
      return false;
    }

    currentQuestionIndex.value -= 1;
    return true;
  }

  function continueQuiz(): boolean {
    if (phase.value !== 'quiz' || !currentQuestion.value) return false;
    if (!answers.value[currentQuestion.value.id]) return false;

    const isLastQuestion = currentQuestionIndex.value === activeQuestions.value.length - 1;

    if (isLastQuestion) {
      phase.value = 'decision';
      return true;
    }

    currentQuestionIndex.value += 1;
    return true;
  }

  function decide(nextDecision: Exclude<Decision, null>): boolean {
    if (phase.value !== 'decision') return false;

    if (nextDecision !== 'accepted' && nextDecision !== 'declined') {
      return false;
    }

    decision.value = nextDecision;

    if (nextDecision === 'accepted') {
      phase.value = 'availability';
      return true;
    }

    selectedDateTimes.value = [];
    preferredDateTime.value = null;
    phase.value = 'declined';
    return true;
  }

  function addOrToggleDateTime(value: string): boolean {
    if (phase.value !== 'availability') return false;
    if (!isValidLocalDateTime(value) || !isFutureLocalDateTime(value)) return false;
    if (selectedDateTimes.value.includes(value)) return false;

    selectedDateTimes.value = [...selectedDateTimes.value, value].sort((left, right) =>
      left.localeCompare(right),
    );

    return true;
  }

  function removeDateTime(value: LocalDateTime): boolean {
    if (phase.value !== 'availability') return false;
    if (!selectedDateTimes.value.includes(value)) return false;

    selectedDateTimes.value = selectedDateTimes.value.filter(
      (selectedDateTime) => selectedDateTime !== value,
    );

    if (preferredDateTime.value === value) {
      preferredDateTime.value = null;
    }

    return true;
  }

  function setPreferredDateTime(value: LocalDateTime): boolean {
    if (phase.value !== 'availability') return false;
    if (!selectedDateTimes.value.includes(value)) return false;

    preferredDateTime.value = value;
    return true;
  }

  function complete(): boolean {
    if (phase.value !== 'availability') return false;
    if (selectedDateTimes.value.length === 0) return false;

    phase.value = 'summary';
    return true;
  }

  function reset(): void {
    phase.value = 'quiz';
    answers.value = {};
    currentQuestionIndex.value = 0;
    decision.value = null;
    selectedDateTimes.value = [];
    preferredDateTime.value = null;
  }

  return {
    state,
    activeQuestions,
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
  };
}
