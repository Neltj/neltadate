import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import CompletionSummary from './CompletionSummary.vue';
import DeclineEnd from './DeclineEnd.vue';
import InvitationDecision from './InvitationDecision.vue';

describe('InvitationDecision', () => {
  it('offre Accetto e Declino come azioni distinte e focusabili', async () => {
    const wrapper = mount(InvitationDecision);
    const buttons = wrapper.findAll<HTMLButtonElement>('button');
    const acceptButton = buttons.find((button) => button.text() === 'Accetto');
    const declineButton = buttons.find((button) => button.text() === 'Declino');

    if (!acceptButton || !declineButton) {
      throw new Error('Pulsanti di decisione mancanti');
    }

    expect(acceptButton.element.tabIndex).toBeGreaterThanOrEqual(0);
    expect(declineButton.element.tabIndex).toBeGreaterThanOrEqual(0);

    await acceptButton.trigger('click');
    await declineButton.trigger('click');

    expect(wrapper.emitted('decide')).toEqual([['accepted'], ['declined']]);
  });
});

describe('CompletionSummary', () => {
  const summaryProps = {
    name: '  Giulia  ',
    answers: {
      'date-energy': 'cozy',
      'food-direction': 'leave-it-to-me',
      'food-format': 'casual',
      'venue-atmosphere': 'leave-it-to-me',
    },
    selectedDateTimes: ['2032-06-14T18:45'],
  };

  it('personalizza il riepilogo con il nome ripulito, le categorie lasciate a sorpresa e le disponibilità', () => {
    const wrapper = mount(CompletionSummary, {
      props: {
        name: '  Giulia  ',
        answers: {
          'date-energy': 'cozy',
          'food-direction': 'leave-it-to-me',
          'food-format': 'casual',
          'venue-atmosphere': 'leave-it-to-me',
        },
        selectedDateTimes: ['2032-06-14T18:45'],
      },
    });

    expect(wrapper.get('.completion-summary__message').text()).toBe(
      'Giulia, che bello arrivare fin qui: le tue scelte danno forma a un appuntamento tutto tuo.',
    );
    expect(wrapper.text()).toContain('Tranquilla');
    expect(wrapper.text()).toContain('Ci penso io: sarà una sorpresa');
    expect(wrapper.text()).toContain('Informale e senza programmi');
    expect(wrapper.text()).toContain('Categorie lasciate a sorpresa');
    expect(wrapper.text()).toContain('Cibo');
    expect(wrapper.text()).toContain('Luogo');
    expect(wrapper.get('time').attributes('datetime')).toBe('2032-06-14T18:45');
  });

  it('mostra una card d’invito con nome, date proposte e luogo a sorpresa', () => {
    const wrapper = mount(CompletionSummary, {
      props: {
        ...summaryProps,
        selectedDateTimes: ['2032-06-14T18:45', '2032-06-15T20:00'],
      },
    });

    const invitationCard = wrapper.get('.invitation-card');
    const invitationTimes = invitationCard.findAll('time');

    expect(invitationCard.attributes()).toMatchObject({
      role: 'region',
      'aria-labelledby': 'invitation-card-heading',
    });
    expect(invitationCard.get('h3').text()).toBe('Un momento da aspettare');
    expect(invitationCard.text()).toContain(
      'Giulia, abbiamo tenuto da parte un piccolo momento speciale per noi.',
    );
    expect(invitationTimes.map((time) => time.attributes('datetime'))).toEqual([
      '2032-06-14T18:45',
      '2032-06-15T20:00',
    ]);
    expect(invitationCard.text()).toContain('Il luogo resta una sorpresa');
    expect(invitationCard.get('ul').attributes('aria-label')).toBe('Date e orari proposti');
  });

  it('mantiene un messaggio caldo quando il nome è vuoto', () => {
    const wrapper = mount(CompletionSummary, {
      props: {
        name: '   ',
        answers: {},
        selectedDateTimes: [],
      },
    });

    expect(wrapper.get('.completion-summary__message').text()).toBe(
      'Che bello arrivare fin qui: le tue scelte danno forma a un appuntamento tutto tuo.',
    );
    expect(wrapper.get('.completion-summary__message').text()).not.toContain(',');
  });

  it('emette il riavvio solo dopo una scelta esplicita', async () => {
    const wrapper = mount(CompletionSummary, {
      props: {
        name: 'Giulia',
        answers: {},
        selectedDateTimes: [],
      },
    });

    const restartButton = wrapper
      .findAll<HTMLButtonElement>('button')
      .find((button) => button.text() === 'Ricomincia');

    if (!restartButton) {
      throw new Error('Pulsante di riavvio mancante');
    }

    expect(restartButton.text()).toBe('Ricomincia');
    expect(restartButton.attributes('type')).toBe('button');
    expect(restartButton.element.tabIndex).toBeGreaterThanOrEqual(0);
    expect(wrapper.emitted('restart')).toBeUndefined();

    await restartButton.trigger('click');

    expect(wrapper.emitted('restart')).toEqual([[]]);
  });

  it('crea e condivide un riepilogo leggibile dopo un clic esplicito', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { share });

    try {
      const wrapper = mount(CompletionSummary, { props: summaryProps });

      await wrapper.get<HTMLButtonElement>('button').trigger('click');

      expect(share).toHaveBeenCalledOnce();
      expect(share.mock.calls[0][0]).toMatchObject({ title: 'Il nostro piano' });
      expect(share.mock.calls[0][0].text).toContain('Riepilogo dell’appuntamento di Giulia');
      expect(share.mock.calls[0][0].text).toContain(
        'Che energia ti piacerebbe per questo appuntamento?: Tranquilla',
      );
      expect(share.mock.calls[0][0].text).toContain('Categorie a sorpresa: Cibo, Luogo');
      expect(share.mock.calls[0][0].text).toContain(
        'Invito:\nGiulia, abbiamo tenuto da parte un piccolo momento speciale per noi.\nIl luogo resta una sorpresa',
      );
      expect(share.mock.calls[0][0].text).toContain('Disponibilità:\n- 2032-06-14 alle 18:45');
      expect(wrapper.get('[role="status"]').text()).toBe('Riepilogo condiviso.');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('copia il riepilogo negli appunti quando Web Share non è disponibile', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    try {
      const wrapper = mount(CompletionSummary, { props: summaryProps });

      await wrapper.get<HTMLButtonElement>('button').trigger('click');

      expect(writeText).toHaveBeenCalledWith(
        expect.stringContaining('Riepilogo dell’appuntamento di Giulia'),
      );
      expect(wrapper.get('[role="status"]').text()).toBe('Riepilogo copiato negli appunti.');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('gestisce l’annullamento della condivisione senza provare a copiare', async () => {
    const share = vi
      .fn()
      .mockRejectedValue(Object.assign(new Error('Annullata'), { name: 'AbortError' }));
    const writeText = vi.fn();
    vi.stubGlobal('navigator', { share, clipboard: { writeText } });

    try {
      const wrapper = mount(CompletionSummary, { props: summaryProps });

      await wrapper.get<HTMLButtonElement>('button').trigger('click');

      expect(writeText).not.toHaveBeenCalled();
      expect(wrapper.get('[role="status"]').text()).toBe('Condivisione annullata.');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('gestisce senza errori il fallimento della copia negli appunti', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('Permesso negato'));
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    try {
      const wrapper = mount(CompletionSummary, { props: summaryProps });

      await expect(
        wrapper.get<HTMLButtonElement>('button').trigger('click'),
      ).resolves.toBeUndefined();

      expect(wrapper.get('[role="status"]').text()).toBe(
        'Non è stato possibile copiare il riepilogo.',
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('DeclineEnd', () => {
  it('termina rispettosamente senza riepilogo accettato né disponibilità', () => {
    const wrapper = mount(DeclineEnd);

    expect(wrapper.text()).toContain('Grazie per la tua risposta. La tua scelta è valida.');
    expect(wrapper.text()).not.toContain('Riepilogo dell’appuntamento');
    expect(wrapper.text()).not.toContain('Disponibilità selezionate');
    expect(wrapper.text()).not.toContain('Hai accettato l’invito.');
    expect(wrapper.text()).not.toContain('Giulia');
    expect(wrapper.text()).not.toContain('Età');
    expect(wrapper.text()).not.toContain('Ricomincia');
  });
});
