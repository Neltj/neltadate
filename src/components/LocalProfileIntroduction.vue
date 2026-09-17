<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  complete: [name: string];
}>();

const name = ref('');
const age = ref('');
const confirmsEphemeralData = ref(false);
const validationMessage = ref<string | null>(null);

function submitProfile(): void {
  const trimmedName = name.value.trim();
  const ageIsAnInteger = /^\d+$/.test(age.value);
  const parsedAge = Number(age.value);

  if (!trimmedName) {
    validationMessage.value = 'Inserisci il tuo nome.';
    return;
  }

  if (!ageIsAnInteger || parsedAge < 18 || parsedAge > 120) {
    validationMessage.value = 'Inserisci un’età intera tra 18 e 120 anni.';
    return;
  }

  if (!confirmsEphemeralData.value) {
    validationMessage.value =
      'Conferma che queste informazioni restano solo in questa pagina e si cancellano ricaricando.';
    return;
  }

  validationMessage.value = null;
  emit('complete', trimmedName);
}
</script>

<template>
  <article class="local-profile-introduction" aria-labelledby="local-profile-heading">
    <div class="local-profile-introduction__heading">
      <p class="local-profile-introduction__eyebrow">Un piccolo inizio</p>
      <h2 id="local-profile-heading">Come preferisci essere chiamato?</h2>
      <p>Il tuo nome comparirà nel quiz per rendere il percorso più personale.</p>
    </div>
    <p class="local-profile-introduction__privacy">
      I dati restano solo in questa pagina: non vengono inviati e si cancellano ricaricando.
    </p>

    <form class="local-profile-form" novalidate @submit.prevent="submitProfile">
      <div class="local-profile-field">
        <label for="profile-name">Il tuo nome</label>
        <p id="profile-name-hint">Usalo solo per personalizzare le schermate.</p>
        <input
          id="profile-name"
          v-model="name"
          type="text"
          autocomplete="name"
          required
          aria-describedby="profile-name-hint local-profile-error"
        />
      </div>

      <div class="local-profile-field">
        <label for="profile-age">Età</label>
        <input
          id="profile-age"
          v-model="age"
          type="number"
          inputmode="numeric"
          min="18"
          max="120"
          step="1"
          required
          aria-describedby="local-profile-error"
        />
      </div>

      <label class="local-profile-confirmation" for="profile-ephemeral-confirmation">
        <input
          id="profile-ephemeral-confirmation"
          v-model="confirmsEphemeralData"
          type="checkbox"
        />
        <span>Confermo che i dati restano solo in questa pagina e si cancellano ricaricando.</span>
      </label>

      <p id="local-profile-error" class="local-profile-error" aria-live="polite" aria-atomic="true">
        {{ validationMessage ?? '' }}
      </p>

      <button type="submit" aria-describedby="local-profile-error">Iniziamo</button>
    </form>
  </article>
</template>
