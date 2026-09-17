<script setup lang="ts">
import type { Decision } from '../types/quiz';

const emit = defineEmits<{
  decide: [decision: Exclude<Decision, null>];
}>();
</script>

<template>
  <div role="group" aria-labelledby="invitation-question">
    <p id="invitation-question">Ti andrebbe un appuntamento?</p>
    <p>Puoi scegliere liberamente: entrambe le risposte vanno bene.</p>
    <p>La scelta resta solo in questa pagina e non viene inviata.</p>

    <button type="button" @click="emit('decide', 'accepted')">Accetto</button>
    <button type="button" @click="emit('decide', 'declined')">Declino</button>
  </div>
</template>
