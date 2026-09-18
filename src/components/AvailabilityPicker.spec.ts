import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AvailabilityPicker from './AvailabilityPicker.vue';

const selectedDateTime = '2032-06-14T18:45';

describe('AvailabilityPicker', () => {
  it('rende il controllo etichettato e invia l’orario inserito', async () => {
    const wrapper = mount(AvailabilityPicker, {
      props: { selectedDateTimes: [] },
    });

    const input = wrapper.get<HTMLInputElement>('#availability-date-time');

    expect(wrapper.get('label[for="availability-date-time"]').text()).toBe('Data e ora');
    expect(input.attributes('type')).toBe('datetime-local');
    expect(wrapper.get('#availability-date-time-hint').text()).toBe(
      'Tocca il campo per aprire il calendario e selezionare data e ora.',
    );
    expect(input.element.previousElementSibling?.id).toBe('availability-date-time-hint');
    expect(input.attributes('aria-describedby')).toBe(
      'availability-date-time-hint availability-error',
    );
    expect(input.element.tabIndex).toBeGreaterThanOrEqual(0);

    await input.setValue(selectedDateTime);
    await wrapper.get('form').trigger('submit');

    expect(wrapper.emitted('add-or-toggle')).toEqual([[selectedDateTime]]);
  });

  it('annuncia l’errore e non completa senza disponibilità', async () => {
    const wrapper = mount(AvailabilityPicker, {
      props: { selectedDateTimes: [] },
    });

    await wrapper.get('button[aria-describedby="availability-error"]').trigger('click');

    const error = wrapper.get('#availability-error');

    expect(error.attributes('aria-live')).toBe('polite');
    expect(error.text()).toBe('Scegli almeno una disponibilità prima di continuare.');
    expect(wrapper.emitted('complete')).toBeUndefined();
  });

  it('mostra una disponibilità selezionata e consente di rimuoverla', async () => {
    const wrapper = mount(AvailabilityPicker, {
      props: { selectedDateTimes: [selectedDateTime] },
    });

    const removeButton = wrapper.get<HTMLButtonElement>(
      'button[aria-label="Rimuovi 2032-06-14 alle 18:45"]',
    );

    expect(wrapper.get('time').attributes('datetime')).toBe(selectedDateTime);
    expect(wrapper.text()).toContain('2032-06-14 alle 18:45');
    expect(wrapper.text()).toContain('lunedì 14 giugno · sera');
    expect(removeButton.element.tabIndex).toBeGreaterThanOrEqual(0);

    await removeButton.trigger('click');

    expect(wrapper.emitted('remove')).toEqual([[selectedDateTime]]);
  });

  it('permette di indicare una disponibilità preferita', async () => {
    const secondDateTime = '2032-06-15T20:00';
    const wrapper = mount(AvailabilityPicker, {
      props: { selectedDateTimes: [selectedDateTime, secondDateTime] },
    });

    const preferredButton = wrapper.get<HTMLButtonElement>(
      'button[aria-label="Rimuovi 2032-06-14 alle 18:45"]',
    ).element.previousElementSibling as HTMLButtonElement;

    expect(preferredButton.textContent).toBe('Segna come preferita');
    await preferredButton.click();

    expect(wrapper.emitted('set-preferred')).toEqual([[selectedDateTime]]);
  });

  it('rifiuta un orario passato o duplicato senza emettere una nuova disponibilità', async () => {
    const wrapper = mount(AvailabilityPicker, {
      props: { selectedDateTimes: [selectedDateTime] },
    });
    const input = wrapper.get<HTMLInputElement>('#availability-date-time');

    await input.setValue('2020-06-14T18:45');
    await wrapper.get('form').trigger('submit');

    expect(wrapper.get('#availability-error').text()).toBe(
      'Scegli una data e un orario nel futuro.',
    );
    expect(wrapper.emitted('add-or-toggle')).toBeUndefined();
    expect(input.element.value).toBe('2020-06-14T18:45');

    await input.setValue(selectedDateTime);
    await wrapper.get('form').trigger('submit');

    expect(wrapper.get('#availability-error').text()).toBe(
      'Hai già aggiunto questa disponibilità.',
    );
    expect(wrapper.emitted('add-or-toggle')).toBeUndefined();
  });
});
