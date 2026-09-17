# Tasks: Date Quiz MVP

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 650–900 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR #1 foundation/state → PR #2 flow UI → PR #3 accessibility and component tests |
| Delivery strategy | ask-on-risk |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Scaffold contracts, content, composable, and unit tests | PR #1 (base = feature/tracker branch) | `pnpm vitest run src/composables/useDateQuiz.spec.ts` | N/A: state-only unit behavior | Revert scaffold, data, composable, and unit tests |
| 2 | Wire phase components and complete decision/availability/summary flow | PR #2 (base = PR #1 branch) | `pnpm vitest run src/components` | `pnpm dev`; keyboard-complete accepted path | Revert components and `src/App.vue` |
| 3 | Accessibility styling and rendered behavior coverage | PR #3 (base = PR #2 branch) | `pnpm vitest run src/components/*.spec.ts` | `pnpm build` plus keyboard/refresh checklist | Revert styles and component specs |

## Phase 1: Foundation and Contracts

- [x] 1.1 Create `package.json`, `pnpm-lock.yaml`, `index.html`, `vite.config.ts`, `tsconfig*.json`, and Vitest/jsdom scripts for Vue 3, TypeScript, Vue Test Utils, and Vitest.
- [x] 1.2 Create `src/types/quiz.ts` with discriminated phases, decisions, minute-precision local date-time, question categories/options, and command contracts.
- [x] 1.3 Create `src/data/questions.ts` with ordered general/food/venue questions, “Leave it to me” options, and brief choice-neutral reactions.

## Phase 2: State and Transition Core

- [x] 2.1 Create `src/composables/useDateQuiz.ts` with readonly state, active-question recomputation, answer revision/pruning, and no-answer/progression guards.
- [x] 2.2 Add decision transitions: equal Accept/Decline actions, acceptance gate, revisable pre-summary decision, and respectful terminal decline cleanup.
- [x] 2.3 Add availability transitions using `YYYY-MM-DDTHH:mm`: arbitrary local values, independent toggle/remove, empty-completion validation, and decline cleanup.
- [x] 2.4 Create `src/composables/useDateQuiz.spec.ts` covering every preference, decision, availability, refresh-reset, and privacy/no-network transition scenario.
- [x] 2.5 (PR #1; manual learning-mode setup) Configure ESLint + Prettier for Vue 3/TypeScript in `package.json`, `eslint.config.js`, `.prettierrc.json`, `.prettierignore`, and `.vscode/settings.json` (enable workspace format-on-save); validate with `pnpm exec eslint src`, `pnpm exec prettier --check src`, `pnpm type-check`, and a VS Code save of `src/composables/useDateQuiz.ts` that applies formatting without behavior changes. Defer `pnpm build` until task 3.1 creates `src/main.ts`.

## Phase 3: UI Wiring and Presentation

- [x] 3.1 Create `src/main.ts` and `src/App.vue` to switch exclusively on the composable phase and move focus to each phase heading.
- [x] 3.2 Create `src/components/QuizQuestion.vue` with labelled choices, progress, validation, immediate reaction, back, and continue controls.
- [x] 3.3 Create `src/components/InvitationDecision.vue` with equal keyboard/touch Accept and Decline controls and non-coercive copy.
- [x] 3.4 Create `src/components/AvailabilityPicker.vue` with native `datetime-local`, selected review list, remove controls, polite errors, and back/complete actions.
- [x] 3.5 Create `src/components/CompletionSummary.vue` and `src/components/DeclineEnd.vue`; show accepted choices/skipped categories only on summary and never availability on decline.
- [x] 3.6 Create `src/styles/main.css` with responsive layout, visible focus, usable touch targets, non-color state cues, and reduced-motion rules.

## Phase 4: Rendered Verification

- [x] 4.1 Create `src/components/*.spec.ts` asserting labels, keyboard-focusable controls, `aria-live` errors, selected state, reactions without delay, accepted recap, and decline privacy boundary.
- [x] 4.2 Run component/unit suites, `pnpm build`, and manual keyboard, responsive, reduced-motion, screen-reader-heading, refresh-reset, and no-network checks; record outcomes.
