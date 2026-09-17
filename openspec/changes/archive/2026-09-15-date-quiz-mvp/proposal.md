# Proposal: Date Quiz MVP

## Intent

Create a playful browser experience where a guest answers date-preference questions, accepts or declines an invitation, and—only after accepting—selects possible date-and-time slots. All choices remain local and ephemeral.

## Scope

### In Scope
- Multiple-choice quiz with backward navigation, answer changes, and brief respectful reactions.
- “Leave it to me” skips later food or venue details and preserves the surprise.
- Accept and decline outcomes; decline ends respectfully without revealing availability.
- Multi-select date-and-time calendar after acceptance.
- On-screen summary; refresh clears state.

### Out of Scope
- Backend, persistence, sharing, notifications, third-party integrations, or automatic submission.
- Cross-device recovery, deep links, and route-based navigation.

## Capabilities

### New Capabilities
- `preference-quiz`: Question progression, answer revision, category skipping, and reaction behavior.
- `invitation-decision`: Accept and decline paths with consent-respecting visibility rules.
- `availability-selection`: Multi-select date-and-time slots after acceptance.
- `completion-summary`: Local on-screen recap without transmission or persistence.

### Modified Capabilities
None.

## Approach

Build a Vue 3 single-page flow with Vite, TypeScript, Composition API, and pnpm. Separate typed content from a composable enforcing valid transitions. Use focused Vue SFCs and framework bindings. Learning-mode application leaves each dependency-ready implementation task to the user.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json`, Vite config | New | Scaffold and pnpm scripts |
| `src/App.vue` | New | Top-level flow |
| `src/components/` | New | Experience UI |
| `src/composables/` | New | State and transitions |
| `src/data/` | New | Typed content |
| `src/styles/` | New | Accessible presentation |
| `src/**/*.spec.ts` | New | Behavior tests |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Gated steps become reachable | Med | Test explicit transitions |
| Humor feels coercive | Med | Keep reactions brief and choice-neutral |
| Calendar is inaccessible | Med | Specify keyboard, focus, labels, touch targets, and reduced motion |
| Scope exceeds one PR | Med | Plan small tasks against the 400-line budget |

## Rollback Plan

Revert the MVP PR; ephemeral state requires no migration or cleanup.

## Dependencies

- Vue 3, Vite, TypeScript, pnpm, and a test runner selected during design.
- Local quiz copy and slot data.

## Success Criteria

- [ ] Guests can complete and revise the quiz; shortcuts skip only relevant details.
- [ ] Declining ends respectfully; availability is reachable only after acceptance.
- [ ] Guests can select multiple date-and-time slots and review an on-screen summary.
- [ ] Refresh clears all state, and no data leaves the browser.
- [ ] The flow is keyboard-accessible, responsive, and behavior-tested.
