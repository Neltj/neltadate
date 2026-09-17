import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import QuizQuestionComponent from './QuizQuestion.vue';
import type { QuestionCategory } from '../types/quiz';

const question = {
  id: 'date-energy',
  category: 'general' as const,
  prompt: 'Che energia ti piacerebbe per questo appuntamento?',
  options: [
    {
      id: 'cozy',
      label: 'Tranquilla e senza fretta',
      reaction: 'La copertina immaginaria ha già chiesto di non essere disturbata.',
    },
    {
      id: 'playful',
      label: 'Giocosa, con un pizzico di avventura',
      reaction: 'Il reparto avventure ha acceso una lucina, senza fare troppo rumore.',
    },
  ],
};

function mountQuestion() {
  return mount(QuizQuestionComponent, {
    props: {
      question,
      currentQuestionIndex: 0,
      canonicalQuestionNumber: 1,
      totalQuestions: 2,
      reaction: null,
    },
  });
}

describe('QuizQuestion', () => {
  it.each([
    ['general', 'Preferenze generali'],
    ['food', 'Cibo'],
    ['venue', 'Luogo'],
  ] satisfies readonly [QuestionCategory, string][])(
    'mostra la categoria %s sopra la domanda',
    (category, label) => {
      const wrapper = mount(QuizQuestionComponent, {
        props: {
          question: { ...question, category },
          currentQuestionIndex: 0,
          canonicalQuestionNumber: 1,
          totalQuestions: 2,
          reaction: null,
        },
      });

      const categoryIndicator = wrapper.get('.quiz-category');
      const options = wrapper.get('fieldset.quiz-options');

      expect(categoryIndicator.text()).toBe(`Categoria: ${label}`);
      expect(options.attributes('aria-describedby')).toBe('date-energy-category');
      expect(categoryIndicator.element.compareDocumentPosition(options.element)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    },
  );

  it('descrive la domanda con l’introduzione della categoria quando presente', () => {
    const wrapper = mount(QuizQuestionComponent, {
      props: {
        question,
        categoryIntroduction: 'Partiamo dall’atmosfera e dalla conversazione.',
        currentQuestionIndex: 0,
        canonicalQuestionNumber: 1,
        totalQuestions: 2,
        reaction: null,
      },
    });

    expect(wrapper.get('.quiz-category-introduction').text()).toBe(
      'Partiamo dall’atmosfera e dalla conversazione.',
    );
    expect(wrapper.get('fieldset.quiz-options').attributes('aria-describedby')).toBe(
      'date-energy-category date-energy-introduction',
    );
  });

  it('rende scelte etichettate, controlli focusabili e stato selezionato', async () => {
    const wrapper = mountQuestion();
    const cozyInput = wrapper.get<HTMLInputElement>('#date-energy-cozy');
    const options = wrapper.get('fieldset.quiz-options');

    expect(options.get('legend').text()).toBe(question.prompt);
    expect(options.findAll('input[type="radio"]')).toHaveLength(question.options.length);
    expect(wrapper.get('label[for="date-energy-cozy"]').text()).toContain(
      'Tranquilla e senza fretta',
    );
    expect(wrapper.get('.quiz-option__label').text()).toBe('Tranquilla e senza fretta');
    expect(wrapper.get('.quiz-option__indicator').attributes('aria-hidden')).toBe('true');
    expect(cozyInput.element.tabIndex).toBeGreaterThanOrEqual(0);
    expect(wrapper.get<HTMLButtonElement>('button').element.tabIndex).toBeGreaterThanOrEqual(0);
    expect(cozyInput.element.checked).toBe(false);

    await cozyInput.setValue();

    expect(wrapper.emitted('answer')).toEqual([['date-energy', 'cozy']]);

    await wrapper.setProps({
      selectedOptionId: 'cozy',
      reaction: question.options[0].reaction,
    });

    expect(cozyInput.element.checked).toBe(true);
    expect(wrapper.get('label[for="date-energy-cozy"]').classes()).toContain(
      'quiz-option--selected',
    );
    expect(wrapper.text()).toContain(question.options[0].reaction);
  });

  it('annuncia subito l’errore quando si continua senza risposta', async () => {
    const wrapper = mountQuestion();

    await wrapper.get('button').trigger('click');

    const error = wrapper.get('#date-energy-error');

    expect(error.attributes('aria-live')).toBe('polite');
    expect(error.text()).toBe('Scegli una risposta prima di continuare.');
    expect(wrapper.emitted('continue')).toBeUndefined();
  });

  it('mostra e descrive accessibilmente l’avanzamento del quiz', async () => {
    const wrapper = mountQuestion();

    await wrapper.setProps({
      currentQuestionIndex: 3,
      canonicalQuestionNumber: 11,
      totalQuestions: 15,
    });

    const progressbar = wrapper.get('[role="progressbar"]');

    expect(wrapper.get('.quiz-progress__label').text()).toBe('Domanda 11 di 15');
    expect(progressbar.attributes()).toMatchObject({
      'aria-label': 'Avanzamento del quiz',
      'aria-valuemin': '0',
      'aria-valuemax': '15',
      'aria-valuenow': '11',
      'aria-valuetext': 'Domanda 11 di 15',
    });
    expect(wrapper.get('.quiz-progress__fill').attributes('style')).toContain('inline-size: 73%');
  });
});
