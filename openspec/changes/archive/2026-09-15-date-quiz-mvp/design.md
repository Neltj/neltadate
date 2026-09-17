# Design: Date Quiz MVP

## Technical Approach

Build a browser-only Vue 3 SPA whose UI is a projection of one typed finite-state composable. `useDateQuiz` owns navigation and enforces the acceptance gate; focused SFCs render each phase and emit user intent. Static quiz copy lives outside components, while answers, decision, availability, and summary remain in memory. No router, persistence API, calendar provider, or network client is introduced.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|---|---|---|---|
| Flow model | Discriminated phase union: `quiz`, `decision`, `availability`, `summary`, `declined` | Route-per-step; boolean flags | A finite state makes invalid combinations unrepresentable and centralizes the acceptance gate without deep-link edge cases. Reactions are derived UI feedback, never a blocking phase. |
| State ownership | One Composition API composable with local `ref`/`computed` state | Pinia; component-local state | The flow is small and ephemeral; a store adds lifecycle and persistence expectations without benefit. |
| Question branching | Typed ordered content plus a computed active-question list | Branches embedded in templates | Category metadata and a `leave-it-to-me` answer can skip only later questions in that category. Revising an earlier answer recomputes reachability and removes now-unreachable answers. |
| Availability input | Native `datetime-local` entry plus a selected-values list, keyed by the minute-precision local string | Predefined slot grid; calendar library | Guests can add any date and time without provider coupling. Keeping `YYYY-MM-DDTHH:mm` as the identity avoids accidental UTC conversion; `Intl.DateTimeFormat` handles display. Adding an existing value toggles it off, and each selected item also has an explicit Remove action. |
| Test tooling | Vitest, Vue Test Utils, and jsdom | E2E-only testing | Fast composable and component tests prove transition guards and accessibility-facing behavior; a small Playwright flow can be added after the MVP if browser coverage is warranted. |

## Data Flow

```text
typed questions -> useDateQuiz -> App phase switch -> focused component
                         ^                |
                         +--- emitted intent

quiz -> decision -> accept -> availability -> summary
                  \-> decline ------------> declined
```

Changing an answer prunes invalid dependent answers. Returning from availability to the decision is allowed; choosing Decline clears selected availability and enters the respectful terminal state. Completing availability requires at least one selected value.

## File Changes

| File | Action | Description |
|---|---|---|
| `package.json`, `pnpm-lock.yaml`, `index.html`, `vite.config.ts`, `tsconfig*.json` | Create | Vue/Vite/TypeScript scaffold and pnpm scripts. |
| `src/main.ts`, `src/App.vue` | Create | Mount the app and render the current phase. |
| `src/types/quiz.ts` | Create | Flow, question, answer, decision, and date-time contracts. |
| `src/data/questions.ts` | Create | Typed questions, options, category metadata, and respectful reactions. |
| `src/composables/useDateQuiz.ts` | Create | State, derived active questions, guarded transitions, revision, and selection toggling. |
| `src/components/QuizQuestion.vue` | Create | Question form, progress, validation, reaction, and back/continue controls. |
| `src/components/InvitationDecision.vue` | Create | Equal Accept and Decline actions. |
| `src/components/AvailabilityPicker.vue` | Create | Free-form date-time entry, selected list, validation, and back/complete actions. |
| `src/components/CompletionSummary.vue`, `src/components/DeclineEnd.vue` | Create | Accessible accepted recap and respectful declined ending. |
| `src/styles/main.css` | Create | Responsive layout, visible focus, touch targets, and reduced-motion rules. |
| `src/composables/useDateQuiz.spec.ts`, `src/components/*.spec.ts` | Create | Transition and rendered-behavior tests. |

## Interfaces / Contracts

```ts
type FlowPhase = 'quiz' | 'decision' | 'availability' | 'summary' | 'declined'
type Decision = 'accepted' | 'declined' | null
type LocalDateTime = string // validated YYYY-MM-DDTHH:mm

interface QuizQuestion {
  id: string
  category: 'general' | 'food' | 'venue'
  prompt: string
  options: readonly { id: string; label: string; reaction: string; skipsCategory?: boolean }[]
}
```

The composable exposes readonly state and commands such as `answer`, `back`, `continueQuiz`, `decide`, `addOrToggleDateTime`, `removeDateTime`, and `complete`. Commands reject invalid transitions instead of relying on hidden controls alone.

## Accessibility and Testing Strategy

| Layer | What to test | Approach |
|---|---|---|
| Unit | Branch pruning, back/revision, all phase guards, selection toggling, decline cleanup | Vitest tests against the composable. |
| Component | Labels, validation messages, focusable controls, selected state, summaries, no reaction delay | Vue Test Utils with role/label-oriented assertions. |
| Manual browser | Full keyboard path, focus after phase changes, responsive touch targets, screen-reader headings, reduced motion, refresh reset | Run the production build locally and follow an accessibility checklist. |

Each phase change moves focus to its main heading; errors use an associated message and `aria-live="polite"`. Native form controls and buttons remain operable without pointer input, focus is never removed, and motion is disabled under `prefers-reduced-motion`.

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration required. The MVP is a new static application; rollback is reverting its files.

## Open Questions

None.
