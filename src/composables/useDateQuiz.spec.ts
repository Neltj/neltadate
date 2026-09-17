import { afterEach, describe, expect, it, vi } from 'vitest';
import { questions } from '../data/questions';
import { useDateQuiz } from './useDateQuiz';

afterEach(() => {
  vi.restoreAllMocks();
});

function completeQuiz(quiz: ReturnType<typeof useDateQuiz>): void {
  while (quiz.state.value.phase === 'quiz') {
    const question = quiz.currentQuestion.value;

    if (!question) throw new Error('Expected a current quiz question');

    const option = question.options[0];

    if (!option) throw new Error(`Expected an option for ${question.id}`);

    expect(quiz.answer(question.id, option.id)).toBe(true);
    expect(quiz.continueQuiz()).toBe(true);
  }
}

function acceptQuiz(quiz: ReturnType<typeof useDateQuiz>): void {
  completeQuiz(quiz);
  expect(quiz.decide('accepted')).toBe(true);
  expect(quiz.state.value.phase).toBe('availability');
}

describe('useDateQuiz', () => {
  it('contains 15 balanced questions with four options and reactions', () => {
    expect(questions).toHaveLength(15);
    expect(questions.filter(({ category }) => category === 'general')).toHaveLength(5);
    expect(questions.filter(({ category }) => category === 'food')).toHaveLength(5);
    expect(questions.filter(({ category }) => category === 'venue')).toHaveLength(5);

    const questionIds = questions.map((question) => question.id);

    expect(new Set(questionIds).size).toBe(questionIds.length);

    for (const question of questions) {
      expect(question.options).toHaveLength(4);

      for (const option of question.options) {
        expect(option.reaction.trim()).not.toBe('');
      }
    }

    expect(
      questions
        .find((question) => question.id === 'food-direction')
        ?.options.find((option) => option.id === 'leave-it-to-me')?.label,
    ).toBe('Ci penso io: sarà una sorpresa');
    expect(
      questions
        .find((question) => question.id === 'venue-atmosphere')
        ?.options.find((option) => option.id === 'leave-it-to-me')?.label,
    ).toBe('Ci penso io: sarà una sorpresa');
  });

  it('records valid answers, reactions, progression, and revision', () => {
    const quiz = useDateQuiz();

    expect(quiz.back()).toBe(false);
    expect(quiz.continueQuiz()).toBe(false);
    expect(quiz.answer('food-direction', 'favorite')).toBe(false);
    expect(quiz.answer('date-energy', 'unknown')).toBe(false);

    expect(quiz.answer('date-energy', 'cozy')).toBe(true);
    expect(quiz.currentReaction.value).toBe(questions[0]?.options[0]?.reaction);
    expect(quiz.continueQuiz()).toBe(true);

    expect(quiz.back()).toBe(true);
    expect(quiz.answer('date-energy', 'spontaneous')).toBe(true);
    expect(quiz.state.value.answers).toEqual({
      'date-energy': 'spontaneous',
    });
  });

  it('keeps all questions and answers when a category is left as a surprise', () => {
    const quiz = useDateQuiz();

    expect(quiz.answer('date-energy', 'cozy')).toBe(true);
    expect(quiz.continueQuiz()).toBe(true);
    expect(quiz.answer('conversation-style', 'quiet-table')).toBe(true);
    expect(quiz.continueQuiz()).toBe(true);
    expect(quiz.answer('date-pace', 'balanced')).toBe(true);
    expect(quiz.continueQuiz()).toBe(true);
    expect(quiz.answer('shared-curiosity', 'local-stories')).toBe(true);
    expect(quiz.continueQuiz()).toBe(true);
    expect(quiz.answer('atmosphere-detail', 'soft-light')).toBe(true);
    expect(quiz.continueQuiz()).toBe(true);
    expect(quiz.answer('food-direction', 'favorite')).toBe(true);
    expect(quiz.continueQuiz()).toBe(true);
    expect(quiz.answer('food-format', 'casual')).toBe(true);
    expect(quiz.continueQuiz()).toBe(true);

    expect(quiz.back()).toBe(true);
    expect(quiz.back()).toBe(true);
    expect(quiz.answer('food-direction', 'leave-it-to-me')).toBe(true);
    expect(quiz.continueQuiz()).toBe(true);
    expect(quiz.currentQuestion.value?.id).toBe('food-format');

    expect(quiz.activeQuestions.value).toEqual(questions);

    expect(quiz.state.value.answers).toEqual({
      'date-energy': 'cozy',
      'conversation-style': 'quiet-table',
      'date-pace': 'balanced',
      'shared-curiosity': 'local-stories',
      'atmosphere-detail': 'soft-light',
      'food-direction': 'leave-it-to-me',
      'food-format': 'casual',
    });
  });

  it('gates availability behind acceptance and clears it on decline', () => {
    const quiz = useDateQuiz();
    const localDateTime = '2031-05-12T19:30';

    expect(quiz.decide('accepted')).toBe(false);
    expect(quiz.addOrToggleDateTime(localDateTime)).toBe(false);
    expect(quiz.removeDateTime(localDateTime)).toBe(false);
    expect(quiz.complete()).toBe(false);

    acceptQuiz(quiz);
    expect(quiz.addOrToggleDateTime(localDateTime)).toBe(true);

    expect(quiz.back()).toBe(true);
    expect(quiz.decide('declined')).toBe(true);
    expect(quiz.state.value.phase).toBe('declined');
    expect(quiz.state.value.selectedDateTimes).toEqual([]);
  });

  it('validates, toggles, removes, and completes date-time selections', () => {
    const quiz = useDateQuiz();
    const firstDateTime = '2032-02-29T09:15';
    const secondDateTime = '2032-06-14T18:45';

    acceptQuiz(quiz);

    expect(quiz.addOrToggleDateTime('2031-02-29T09:15')).toBe(false);
    expect(quiz.addOrToggleDateTime('2032-06-14T24:00')).toBe(false);
    expect(quiz.complete()).toBe(false);

    expect(quiz.addOrToggleDateTime(firstDateTime)).toBe(true);
    expect(quiz.addOrToggleDateTime(secondDateTime)).toBe(true);

    expect(quiz.addOrToggleDateTime(firstDateTime)).toBe(true);
    expect(quiz.removeDateTime(firstDateTime)).toBe(false);
    expect(quiz.removeDateTime(secondDateTime)).toBe(true);
    expect(quiz.complete()).toBe(false);

    expect(quiz.addOrToggleDateTime(secondDateTime)).toBe(true);
    expect(quiz.complete()).toBe(true);
    expect(quiz.state.value.phase).toBe('summary');
  });

  it('resets all local state', () => {
    const quiz = useDateQuiz();

    acceptQuiz(quiz);
    expect(quiz.addOrToggleDateTime('2032-06-14T18:45')).toBe(true);
    expect(quiz.complete()).toBe(true);

    const refreshedQuiz = useDateQuiz();

    expect(refreshedQuiz.state.value).toEqual({
      phase: 'quiz',
      answers: {},
      currentQuestionIndex: 0,
      decision: null,
      selectedDateTimes: [],
    });

    quiz.reset();

    expect(quiz.state.value).toEqual({
      phase: 'quiz',
      answers: {},
      currentQuestionIndex: 0,
      decision: null,
      selectedDateTimes: [],
    });
  });

  it('does not make network requests', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const xhrOpenSpy = vi.spyOn(XMLHttpRequest.prototype, 'open');
    const quiz = useDateQuiz();

    acceptQuiz(quiz);
    expect(quiz.addOrToggleDateTime('2032-06-14T18:45')).toBe(true);
    expect(quiz.complete()).toBe(true);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(xhrOpenSpy).not.toHaveBeenCalled();
  });
});
