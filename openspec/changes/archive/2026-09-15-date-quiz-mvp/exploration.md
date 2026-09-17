## Exploration: Date Quiz MVP

### Current State
The repository contains OpenSpec configuration but no application source, package manifest, runtime, or tests. The confirmed direction is a browser-based, playful date-preference quiz built with Vue 3, Vite, TypeScript, the Composition API, and pnpm. The experience asks multiple-choice questions, reacts humorously after each answer, lets the guest accept or decline at the end, and reveals an availability calendar only after acceptance.

Because there is no existing implementation to preserve, the MVP can start as a static client-side application. Privacy should be structural rather than policy-only: answers and availability remain in memory, are not transmitted, and disappear on refresh unless later requirements explicitly introduce storage or sharing.

### Affected Areas
- `package.json` — planned pnpm scripts and Vue/Vite dependencies; it does not exist yet.
- `src/App.vue` — planned top-level experience flow; it does not exist yet.
- `src/components/` — planned question, reaction, decision, and availability UI; it does not exist yet.
- `src/composables/` — planned quiz state and transition logic; it does not exist yet.
- `src/data/` — planned typed question and reaction content; it does not exist yet.
- `src/styles/` — planned responsive visual system and calendar styling; it does not exist yet.
- `src/**/*.spec.ts` — planned behavior tests once a test runner is selected; no test infrastructure exists yet.

### Approaches
1. **Single-page state-driven flow** — model the experience as explicit steps in one Vue application, with typed question data and a composable controlling transitions.
   - Pros: Small browser-only surface, clear acceptance gate before availability, easy to test, and appropriate for learning one task at a time.
   - Cons: Navigation history and resumability require deliberate additions if later desired.
   - Effort: Low

2. **Route-per-step flow** — use Vue Router for questions, decision, and availability screens.
   - Pros: Addressable screens, browser navigation support, and easier future deep linking.
   - Cons: Adds ceremony and creates invalid-entry cases for a short linear experience; URLs may expose progress semantics.
   - Effort: Medium

3. **Backend-backed invitation flow** — persist answers and availability and share them with Neltj through an API.
   - Pros: Enables real submission, cross-device recovery, and notifications.
   - Cons: Introduces identity, authorization, data retention, security, hosting, and explicit data-sharing consent that the current MVP does not require.
   - Effort: High

### Recommendation
Use the single-page state-driven approach for the MVP. Keep question content in typed data, keep interaction state in a small composable, and render focused Vue components for the question, humorous reaction, final decision, and availability steps. Treat the flow as a finite set of valid transitions so the calendar cannot appear before acceptance.

Keep all responses ephemeral and local by default. The calendar should initially be a styled date-selection UI, not an integration with a personal calendar provider. A decline must end the flow respectfully without pressure, hidden submission, or revealing the availability step. Humor should respond to choices without mocking, sexualizing, or penalizing the guest.

### Risks
- **Unresolved completion behavior:** decide whether acceptance and selected availability are only celebrated on-screen, copied into a message, downloaded locally, or eventually submitted to Neltj.
- **Unresolved calendar semantics:** define single-date versus multi-date selection, allowed date range, locale/time-zone behavior, and whether time slots are needed.
- **Unresolved quiz structure:** confirm the initial questions, answer choices, whether answers may be changed, and whether progress can move backward.
- **Unresolved surprise behavior:** clarify whether choosing “surprise me” skips later venue/food questions or merely marks them as suggestions.
- **Consent and dignity:** acceptance must be freely reversible until final confirmation, decline must be a first-class outcome, and humorous reactions must not manipulate the guest.
- **Privacy:** availability can be sensitive personal data; browser-only state avoids collection, but any future persistence or sharing requires explicit purpose, recipient, retention, and deletion decisions.
- **Accessibility:** animation, color, focus order, keyboard operation, reduced-motion preferences, touch targets, and readable calendar semantics need explicit acceptance criteria.
- **No test capability yet:** the repository has no test runner, type checker command, linter, or build command until scaffolding is planned and created.
- **Content coupling:** embedding jokes directly in components would make tone changes risky; typed content data should remain separate from flow logic.

### Ready for Proposal
No, not yet. The technical direction is sufficiently narrow, but the orchestrator should first offer the optional research phase and obtain explicit product decisions for completion behavior, calendar semantics, quiz navigation, and the meaning of “surprise me.” Once those are confirmed, the proposal can define a browser-only, privacy-preserving MVP without inventing requirements.
