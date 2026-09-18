<script setup lang="ts">
import { computed, ref } from 'vue';
import { questions } from '../data/questions';
import { buildCalendarIcs } from '../utils/calendar';
import type { LocalDateTime, QuestionCategory, QuizAnswers } from '../types/quiz';

const props = defineProps<{
  name: string;
  answers: QuizAnswers;
  selectedDateTimes: readonly LocalDateTime[];
  preferredDateTime?: LocalDateTime | null;
}>();

const emit = defineEmits<{
  restart: [];
}>();

const categoryLabels: Record<QuestionCategory, string> = {
  general: 'Preferenze generali',
  food: 'Cibo',
  venue: 'Luogo',
};

const selectedChoices = computed(() =>
  questions.flatMap((question) => {
    const selectedOption = question.options.find(
      (option) => option.id === props.answers[question.id],
    );

    return selectedOption ? [{ prompt: question.prompt, label: selectedOption.label }] : [];
  }),
);

const skippedCategories = computed<readonly QuestionCategory[]>(() =>
  Array.from(
    new Set(
      questions.flatMap((question) => {
        const selectedOption = question.options.find(
          (option) => option.id === props.answers[question.id],
        );

        return selectedOption?.skipsCategory ? [question.category] : [];
      }),
    ),
  ),
);

const displayName = computed(() => props.name.trim());
const invitationLine = computed(() =>
  displayName.value
    ? `${displayName.value}, abbiamo tenuto da parte un piccolo momento speciale per noi.`
    : 'Abbiamo tenuto da parte un piccolo momento speciale per noi.',
);
const venueSurpriseLine = 'Il luogo resta una sorpresa: ti basterà portare la tua curiosità.';
const actionStatus = ref('');
const preferredDateTime = computed(() => props.preferredDateTime ?? null);

function formatDateTime(value: LocalDateTime): string {
  return value.replace('T', ' alle ');
}

const shareText = computed(() => {
  const sections = [
    displayName.value
      ? `Riepilogo dell’appuntamento di ${displayName.value}`
      : 'Riepilogo dell’appuntamento',
    `Scelte:\n${selectedChoices.value.map((choice) => `- ${choice.prompt}: ${choice.label}`).join('\n') || '- Nessuna scelta registrata'}`,
    `Categorie a sorpresa: ${
      skippedCategories.value.length > 0
        ? skippedCategories.value.map((category) => categoryLabels[category]).join(', ')
        : 'Nessuna'
    }`,
    `Invito:\n${invitationLine.value}\n${venueSurpriseLine}`,
    `Disponibilità:\n${
      props.selectedDateTimes.map((value) => `- ${formatDateTime(value)}`).join('\n') ||
      '- Nessuna disponibilità selezionata'
    }`,
    preferredDateTime.value
      ? `Preferita:\n- ${formatDateTime(preferredDateTime.value)}`
      : 'Preferita:\n- Nessuna disponibilità indicata',
  ];

  return sections.join('\n\n');
});

function isShareCancellation(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function downloadCalendar(): void {
  actionStatus.value = '';

  let objectUrl: string | undefined;
  let downloadLink: HTMLAnchorElement | undefined;

  try {
    const calendar = buildCalendarIcs({
      dateTimes: props.selectedDateTimes,
      preferredDateTime: preferredDateTime.value,
      summary: 'Un momento da aspettare',
      description: venueSurpriseLine,
    });
    const calendarFile = new Blob([calendar], { type: 'text/calendar;charset=utf-8' });

    objectUrl = URL.createObjectURL(calendarFile);
    downloadLink = document.createElement('a');
    downloadLink.href = objectUrl;
    downloadLink.download = 'disponibilita-appuntamento.ics';
    downloadLink.style.display = 'none';
    document.body.append(downloadLink);
    downloadLink.click();

    actionStatus.value = 'File del calendario pronto: contiene ogni disponibilità proposta.';
  } catch {
    actionStatus.value = 'Non è stato possibile preparare il calendario.';
  } finally {
    downloadLink?.remove();

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  }
}

async function shareSummary(): Promise<void> {
  actionStatus.value = '';

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: 'Il nostro piano',
        text: shareText.value,
      });
      actionStatus.value = 'Riepilogo condiviso.';
    } catch (error: unknown) {
      actionStatus.value = isShareCancellation(error)
        ? 'Condivisione annullata.'
        : 'Non è stato possibile condividere il riepilogo.';
    }

    return;
  }

  if (typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(shareText.value);
      actionStatus.value = 'Riepilogo copiato negli appunti.';
    } catch {
      actionStatus.value = 'Non è stato possibile copiare il riepilogo.';
    }

    return;
  }

  actionStatus.value = 'La condivisione non è disponibile su questo dispositivo.';
}
</script>

<template>
  <article aria-labelledby="completion-summary-heading">
    <h2 id="completion-summary-heading">Riepilogo dell’appuntamento</h2>
    <p v-if="displayName" class="completion-summary__message">
      {{ displayName }}, che bello arrivare fin qui: le tue scelte danno forma a un appuntamento
      tutto tuo.
    </p>
    <p v-else class="completion-summary__message">
      Che bello arrivare fin qui: le tue scelte danno forma a un appuntamento tutto tuo.
    </p>

    <section class="invitation-card" aria-labelledby="invitation-card-heading" role="region">
      <p class="invitation-card__eyebrow">Il tuo invito</p>
      <h3 id="invitation-card-heading">Un momento da aspettare</h3>
      <p class="invitation-card__message">{{ invitationLine }}</p>

      <ul
        v-if="selectedDateTimes.length"
        class="invitation-card__date-times"
        aria-label="Date e orari proposti"
      >
        <li v-for="selectedDateTime in selectedDateTimes" :key="selectedDateTime">
          <time :datetime="selectedDateTime">{{ formatDateTime(selectedDateTime) }}</time>
          <strong v-if="preferredDateTime === selectedDateTime" class="preferred-badge">
            Preferita
          </strong>
        </li>
      </ul>

      <p v-else class="invitation-card__date-times">Sceglieremo insieme il momento giusto.</p>

      <p class="invitation-card__surprise">
        <span aria-hidden="true">✦</span>
        {{ venueSurpriseLine }}
      </p>

      <div v-if="selectedDateTimes.length" class="invitation-card__calendar">
        <button type="button" @click="downloadCalendar">Aggiungi al calendario</button>
        <p>Ogni disponibilità proposta può essere aggiunta al calendario.</p>
      </div>
    </section>

    <section aria-labelledby="selected-choices-heading">
      <h3 id="selected-choices-heading">Le tue scelte</h3>

      <ul>
        <li v-for="choice in selectedChoices" :key="choice.prompt">
          <strong>{{ choice.prompt }}:</strong> {{ choice.label }}
        </li>
      </ul>
    </section>

    <section aria-labelledby="skipped-categories-heading">
      <h3 id="skipped-categories-heading">Categorie lasciate a sorpresa</h3>

      <p v-if="skippedCategories.length === 0">Non hai lasciato nessuna categoria a sorpresa.</p>

      <ul v-else>
        <li v-for="category in skippedCategories" :key="category">
          {{ categoryLabels[category] }}
        </li>
      </ul>
    </section>

    <section aria-labelledby="selected-date-times-heading">
      <h3 id="selected-date-times-heading">Disponibilità selezionate</h3>

      <ul>
        <li v-for="selectedDateTime in selectedDateTimes" :key="selectedDateTime">
          <time :datetime="selectedDateTime">{{ formatDateTime(selectedDateTime) }}</time>
          <strong v-if="preferredDateTime === selectedDateTime" class="preferred-badge">
            Preferita
          </strong>
        </li>
      </ul>
    </section>

    <p>Le informazioni restano solo in questa pagina e non vengono inviate.</p>

    <div class="completion-summary__actions">
      <button class="completion-summary__share-button" type="button" @click="shareSummary">
        Condividi riepilogo
      </button>
      <button type="button" @click="emit('restart')">Ricomincia</button>
    </div>
    <p class="completion-summary__share-status" role="status" aria-live="polite">
      {{ actionStatus }}
    </p>
  </article>
</template>
