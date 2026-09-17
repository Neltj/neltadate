import { computed, ref, type ComputedRef } from 'vue';
import { questions } from '../data/questions';
import type {
  DateQuizCommands,
  DateQuizFlowState,
  Decision,
  FlowPhase,
  LocalDateTime,
  QuizAnswers,
  QuizQuestion,
} from '../types/quiz';

function daysInMonth(year: number, month: number): number {
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

  return [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 0;
}

function isValidLocalDateTime(value: string): boolean {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(?:[01]\d|2[0-3]):[0-5]\d$/);

  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  return year >= 1 && month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month);
}

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
        };
      case 'decision':
        return {
          phase: 'decision',
          answers: readonlyAnswers,
          decision: null,
          selectedDateTimes: readonlyDateTimes,
        };
      case 'availability':
        return {
          phase: 'availability',
          answers: readonlyAnswers,
          decision: 'accepted',
          selectedDateTimes: readonlyDateTimes,
        };
      case 'summary':
        return {
          phase: 'summary',
          answers: readonlyAnswers,
          decision: 'accepted',
          selectedDateTimes: readonlyDateTimes,
        };
      case 'declined':
        return {
          phase: 'declined',
          answers: readonlyAnswers,
          decision: 'declined',
          selectedDateTimes: [],
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
    phase.value = 'declined';
    return true;
  }

  function addOrToggleDateTime(value: string): boolean {
    if (phase.value !== 'availability') return false;
    if (!isValidLocalDateTime(value)) return false;

    const isSelected = selectedDateTimes.value.includes(value);

    selectedDateTimes.value = isSelected
      ? selectedDateTimes.value.filter((selectedDateTime) => selectedDateTime !== value)
      : [...selectedDateTimes.value, value];

    return true;
  }

  function removeDateTime(value: LocalDateTime): boolean {
    if (phase.value !== 'availability') return false;
    if (!selectedDateTimes.value.includes(value)) return false;

    selectedDateTimes.value = selectedDateTimes.value.filter(
      (selectedDateTime) => selectedDateTime !== value,
    );

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
    complete,
    reset,
  };
}
