<script setup lang="ts">
import { ref } from 'vue';
import type { LocalDateTime } from '../types/quiz';

const props = defineProps<{
  selectedDateTimes: readonly LocalDateTime[];
}>();

const emit = defineEmits<{
  'add-or-toggle': [value: string];
  remove: [value: LocalDateTime];
  back: [];
  complete: [];
}>();

const dateTime = ref('');
const validationMessage = ref<string | null>(null);

function formatDateTime(value: LocalDateTime): string {
  return value.replace('T', ' alle ');
}

function addOrToggleDateTime(): void {
  if (!dateTime.value) {
    validationMessage.value = 'Inserisci una data e un orario.';
    return;
  }

  emit('add-or-toggle', dateTime.value);
  dateTime.value = '';
  validationMessage.value = null;
}

function complete(): void {
  if (props.selectedDateTimes.length === 0) {
    validationMessage.value = 'Scegli almeno una disponibilità prima di continuare.';
    return;
  }

  emit('complete');
}
</script>

<template>
  <article aria-labelledby="availability-picker-heading">
    <h2 id="availability-picker-heading">Le tue disponibilità</h2>

    <p>Le disponibilità restano solo in questa pagina e non vengono inviate.</p>
    <p>Inserendo di nuovo lo stesso orario, lo rimuovi dalla lista.</p>

    <form class="availability-form" @submit.prevent="addOrToggleDateTime">
      <div class="availability-date-time-field">
        <label for="availability-date-time">Data e ora</label>
        <p id="availability-date-time-hint" class="availability-date-time-hint">
          Tocca il campo per aprire il calendario e selezionare data e ora.
        </p>
        <input
          id="availability-date-time"
          v-model="dateTime"
          type="datetime-local"
          step="60"
          aria-describedby="availability-date-time-hint availability-error"
        />
      </div>
      <button type="submit">Aggiungi o rimuovi l’orario</button>
    </form>

    <p id="availability-error" class="form-status--error" aria-live="polite" aria-atomic="true">
      {{ validationMessage ?? '' }}
    </p>

    <section aria-labelledby="selected-date-times-heading">
      <h3 id="selected-date-times-heading">Disponibilità selezionate</h3>

      <p v-if="selectedDateTimes.length === 0">Non hai ancora selezionato nessun orario.</p>

      <ul v-else>
        <li v-for="selectedDateTime in selectedDateTimes" :key="selectedDateTime">
          <time :datetime="selectedDateTime">{{ formatDateTime(selectedDateTime) }}</time>
          <button
            type="button"
            :aria-label="`Rimuovi ${formatDateTime(selectedDateTime)}`"
            @click="emit('remove', selectedDateTime)"
          >
            Rimuovi
          </button>
        </li>
      </ul>
    </section>

    <div class="quiz-actions">
      <button type="button" @click="emit('back')">Indietro</button>
      <button type="button" aria-describedby="availability-error" @click="complete">
        Completa
      </button>
    </div>
  </article>
</template>
