import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import LocalProfileIntroduction from './LocalProfileIntroduction.vue';

async function submitProfile(
  wrapper: ReturnType<typeof mount>,
  { name = '', age = '', confirmed = false }: { name?: string; age?: string; confirmed?: boolean },
): Promise<void> {
  await wrapper.get('#profile-name').setValue(name);
  await wrapper.get('#profile-age').setValue(age);

  if (confirmed) {
    await wrapper.get('#profile-ephemeral-confirmation').setValue(true);
  }

  await wrapper.get('form').trigger('submit');
}

describe('LocalProfileIntroduction', () => {
  it('blocca un profilo senza nome, anche quando gli altri dati sono validi', async () => {
    const wrapper = mount(LocalProfileIntroduction);

    await submitProfile(wrapper, { name: '   ', age: '25', confirmed: true });

    expect(wrapper.get('#local-profile-error').text()).toBe('Inserisci il tuo nome.');
    expect(wrapper.emitted('complete')).toBeUndefined();
  });

  it('blocca chi non ha l’età minima', async () => {
    const wrapper = mount(LocalProfileIntroduction);

    await submitProfile(wrapper, { name: 'Luca', age: '17', confirmed: true });

    expect(wrapper.get('#local-profile-error').text()).toBe(
      'Inserisci un’età intera tra 18 e 120 anni.',
    );
    expect(wrapper.emitted('complete')).toBeUndefined();
  });

  it('richiede la conferma della permanenza locale e invia solo il nome ripulito', async () => {
    const wrapper = mount(LocalProfileIntroduction);

    await submitProfile(wrapper, { name: '  Marta  ', age: '30' });

    expect(wrapper.get('#local-profile-error').text()).toContain(
      'Conferma che queste informazioni',
    );
    expect(wrapper.emitted('complete')).toBeUndefined();

    await wrapper.get('#profile-ephemeral-confirmation').setValue(true);
    await wrapper.get('form').trigger('submit');

    expect(wrapper.emitted('complete')).toEqual([['Marta']]);
  });
});
