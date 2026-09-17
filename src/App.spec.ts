import { mount, type VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it } from 'vitest';
import App from './App.vue';

function getButtonByText(wrapper: VueWrapper, text: string) {
  const button = wrapper.findAll<HTMLButtonElement>('button').find((item) => item.text() === text);

  if (!button) throw new Error(`Expected button with text: ${text}`);

  return button;
}

async function startQuiz(wrapper: VueWrapper): Promise<void> {
  await wrapper.get('#profile-name').setValue('Elena');
  await wrapper.get('#profile-age').setValue('28');
  await wrapper.get('#profile-ephemeral-confirmation').setValue(true);
  await wrapper.get('.local-profile-form').trigger('submit');
}

async function reachDecision(wrapper: VueWrapper): Promise<void> {
  while (wrapper.find('#decision-heading').exists() === false) {
    await wrapper.get<HTMLInputElement>('input[type="radio"]').setValue();
    await getButtonByText(wrapper, 'Continua').trigger('click');
  }
}

async function continueCurrentQuestion(wrapper: VueWrapper): Promise<void> {
  await wrapper.get<HTMLInputElement>('input[type="radio"]').setValue();
  await getButtonByText(wrapper, 'Continua').trigger('click');
}

describe('App', () => {
  it('mostra il nome del profilo locale nell’intestazione del quiz dopo un invio valido', async () => {
    const wrapper = mount(App);

    await wrapper.get('#profile-name').setValue('  Elena  ');
    await wrapper.get('#profile-age').setValue('28');
    await wrapper.get('#profile-ephemeral-confirmation').setValue(true);
    await wrapper.get('.local-profile-form').trigger('submit');

    expect(wrapper.get('#quiz-heading').text()).toBe('Piacere mio, Elena, stupiscimi ❤️');
    expect(wrapper.text()).not.toContain('28');
  });

  it('transitions between keyed quiz questions', async () => {
    const wrapper = mount(App);

    await startQuiz(wrapper);

    const transition = wrapper.get('transition-stub');

    expect(transition.attributes()).toMatchObject({
      name: 'quiz-question',
      mode: 'out-in',
    });
    expect(wrapper.get('legend').text()).toBe('Che energia ti piacerebbe per questo appuntamento?');

    await wrapper.get<HTMLInputElement>('#date-energy-cozy').setValue();
    await getButtonByText(wrapper, 'Continua').trigger('click');

    expect(wrapper.get('legend').text()).toBe('Cosa rende una conversazione più naturale?');
  });

  it('mostra l’introduzione solo all’inizio di ogni categoria', async () => {
    const wrapper = mount(App);

    await startQuiz(wrapper);

    expect(wrapper.get('.quiz-category-introduction').text()).toBe(
      'Partiamo dall’atmosfera e da come far nascere una conversazione naturale.',
    );

    await continueCurrentQuestion(wrapper);

    expect(wrapper.find('.quiz-category-introduction').exists()).toBe(false);

    for (let index = 0; index < 4; index += 1) {
      await continueCurrentQuestion(wrapper);
    }

    expect(wrapper.get('legend').text()).toBe('Come gestiamo il cibo?');
    expect(wrapper.get('.quiz-category-introduction').text()).toBe(
      'Ora scopriamo cosa potremmo mangiare insieme.',
    );

    await continueCurrentQuestion(wrapper);

    expect(wrapper.find('.quiz-category-introduction').exists()).toBe(false);

    for (let index = 0; index < 4; index += 1) {
      await continueCurrentQuestion(wrapper);
    }

    expect(wrapper.get('legend').text()).toBe('Che tipo di posto ti ispira?');
    expect(wrapper.get('.quiz-category-introduction').text()).toBe(
      'Infine, lasciamo spazio alla sorpresa del posto giusto.',
    );

    await continueCurrentQuestion(wrapper);

    expect(wrapper.find('.quiz-category-introduction').exists()).toBe(false);
  });

  it('avanza di una domanda quando una categoria viene lasciata a sorpresa', async () => {
    const wrapper = mount(App);

    await startQuiz(wrapper);

    for (let index = 0; index < 5; index += 1) {
      await wrapper.get<HTMLInputElement>('input[type="radio"]').setValue();
      await getButtonByText(wrapper, 'Continua').trigger('click');
    }

    const progressbar = wrapper.get('[role="progressbar"]');
    const progressFill = wrapper.get('.quiz-progress__fill');

    expect(wrapper.get('.quiz-progress__label').text()).toBe('Domanda 6 di 15');
    expect(progressbar.attributes()).toMatchObject({
      'aria-valuemax': '15',
      'aria-valuenow': '6',
      'aria-valuetext': 'Domanda 6 di 15',
    });
    expect(progressFill.attributes('style')).toContain('inline-size: 40%');

    await wrapper.get<HTMLInputElement>('#food-direction-leave-it-to-me').setValue();

    expect(wrapper.get('.quiz-progress__label').text()).toBe('Domanda 6 di 15');
    expect(progressbar.attributes()).toMatchObject({
      'aria-valuemax': '15',
      'aria-valuenow': '6',
      'aria-valuetext': 'Domanda 6 di 15',
    });
    expect(progressFill.attributes('style')).toContain('inline-size: 40%');

    await getButtonByText(wrapper, 'Continua').trigger('click');

    const nextProgressbar = wrapper.get('[role="progressbar"]');

    expect(wrapper.get('legend').text()).toBe('Che tipo di esperienza a tavola preferisci?');
    expect(wrapper.get('.quiz-progress__label').text()).toBe('Domanda 7 di 15');
    expect(nextProgressbar.attributes()).toMatchObject({
      'aria-valuemax': '15',
      'aria-valuenow': '7',
      'aria-valuetext': 'Domanda 7 di 15',
    });
    expect(wrapper.get('.quiz-progress__fill').attributes('style')).toContain('inline-size: 47%');
  });

  it('riavvia dal riepilogo mantenendo il profilo locale e riportando il focus al quiz', async () => {
    const wrapper = mount(App, { attachTo: document.body });

    await startQuiz(wrapper);
    await reachDecision(wrapper);
    await getButtonByText(wrapper, 'Accetto').trigger('click');

    await wrapper.get('#availability-date-time').setValue('2032-06-14T18:45');
    await wrapper.get('form').trigger('submit');
    await getButtonByText(wrapper, 'Completa').trigger('click');

    expect(wrapper.get('#summary-heading').text()).toBe('Il nostro piano');
    expect(wrapper.text()).toContain('2032-06-14 alle 18:45');

    await getButtonByText(wrapper, 'Ricomincia').trigger('click');
    await nextTick();
    await nextTick();

    expect(wrapper.get('#quiz-heading').text()).toBe('Piacere mio, Elena, stupiscimi ❤️');
    expect(wrapper.get('legend').text()).toBe('Che energia ti piacerebbe per questo appuntamento?');
    expect(wrapper.get<HTMLInputElement>('input[type="radio"]').element.checked).toBe(false);
    expect(wrapper.text()).not.toContain('2032-06-14 alle 18:45');
    expect(document.activeElement).toBe(wrapper.get('#quiz-heading').element);

    wrapper.unmount();
  });

  it('mostra la celebrazione solo dopo aver accettato l’invito', async () => {
    const acceptedWrapper = mount(App);

    await startQuiz(acceptedWrapper);
    await reachDecision(acceptedWrapper);
    await getButtonByText(acceptedWrapper, 'Accetto').trigger('click');

    const celebration = acceptedWrapper.get('.acceptance-celebration');

    expect(acceptedWrapper.find('#availability-heading').exists()).toBe(true);
    expect(celebration.text()).toBe(
      'Che bello, hai detto sì! Ora scegli con calma un momento che ti va.',
    );
    expect(celebration.attributes()).toMatchObject({
      role: 'status',
      'aria-live': 'polite',
      'aria-atomic': 'true',
    });

    const declinedWrapper = mount(App);

    await startQuiz(declinedWrapper);
    await reachDecision(declinedWrapper);
    await getButtonByText(declinedWrapper, 'Declino').trigger('click');

    expect(declinedWrapper.find('#declined-heading').exists()).toBe(true);
    expect(declinedWrapper.find('.acceptance-celebration').exists()).toBe(false);
  });

  it('non offre un riavvio dopo il rifiuto dell’invito', async () => {
    const wrapper = mount(App);

    await startQuiz(wrapper);
    await reachDecision(wrapper);
    await getButtonByText(wrapper, 'Declino').trigger('click');

    expect(wrapper.get('#declined-heading').text()).toBe('Grazie');
    expect(wrapper.text()).not.toContain('Ricomincia');
  });

  it('usa il tema chiaro come impostazione iniziale', () => {
    const wrapper = mount(App);
    const themeToggle = wrapper.get<HTMLButtonElement>('[aria-label="Tema scuro"]');

    expect(themeToggle.attributes('aria-pressed')).toBe('false');
    expect(wrapper.get('.app-shell').classes()).not.toContain('app-shell--dark');
  });

  it('aggiorna lo stato accessibile del pulsante per il tema scuro', async () => {
    const wrapper = mount(App);
    const themeToggle = wrapper.get<HTMLButtonElement>('[aria-label="Tema scuro"]');

    await themeToggle.trigger('click');

    expect(themeToggle.attributes('aria-pressed')).toBe('true');
    expect(themeToggle.attributes('aria-label')).toBe('Tema chiaro');
    expect(themeToggle.text()).toContain('Tema chiaro');
    expect(wrapper.get('.app-shell').classes()).toContain('app-shell--dark');
  });

  it('mantiene il tema scelto passando dal profilo al quiz', async () => {
    const wrapper = mount(App);
    const themeToggle = wrapper.get<HTMLButtonElement>('[aria-label="Tema scuro"]');

    await themeToggle.trigger('click');
    await startQuiz(wrapper);

    expect(wrapper.find('#quiz-heading').exists()).toBe(true);
    expect(
      wrapper.get<HTMLButtonElement>('[aria-label="Tema chiaro"]').attributes('aria-pressed'),
    ).toBe('true');
    expect(wrapper.get('.app-shell').classes()).toContain('app-shell--dark');
  });
});
