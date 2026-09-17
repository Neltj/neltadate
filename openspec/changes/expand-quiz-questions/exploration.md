## Exploration: Expand Quiz Questions

### Current State

The quiz catalog is a typed, ordered `readonly QuizQuestion[]` with six questions: two each in `general`, `food`, and `venue`. `useDateQuiz` derives the visible sequence from that array, and an answered `skipsCategory` option removes only later questions in the same category while pruning answers that become unreachable. Question progress and the completion summary are data-driven, all state remains in memory, and no network or persistence layer is involved.

The confirmed change expands the catalog to exactly 15 questions by adding three questions per category, producing five `general`, five `food`, and five `venue` questions. “Exactly 15” should describe the complete catalog; a guest may see fewer because the existing food and venue shortcuts intentionally skip later questions in those categories.

### Affected Areas

- `src/data/questions.ts` — add nine Italian questions and their typed options/reactions while preserving existing IDs and relative order.
- `src/composables/useDateQuiz.spec.ts` — update hard-coded ordering/skip expectations and cover the 15-question, 5-per-category catalog invariant.
- `openspec/specs/preference-quiz/spec.md` — the next spec phase should define the catalog size/distribution and the expanded reaction-content boundary.
- `src/types/quiz.ts` — no change expected; the existing `QuizQuestion`, `QuizOption`, and category union already model the expansion.
- `src/composables/useDateQuiz.ts` — no change expected; progression, revision, pruning, and category-local skipping are already content-driven.
- `src/components/QuizQuestion.vue` and `src/components/CompletionSummary.vue` — no change expected; both render from the question catalog and computed state.

### Approaches

1. **Extend the existing static catalog** — insert three new questions inside each current category block and retain the current shortcut questions as the first food and venue questions.
   - Pros: preserves the architecture and skip semantics; keeps existing IDs stable; produces a small, reviewable content-focused diff.
   - Cons: the data file becomes longer; copy quality and identifier uniqueness need explicit review.
   - Effort: Low

2. **Restructure questions into per-category collections** — split or generate the catalog before flattening it into display order.
   - Pros: makes the 5/5/5 distribution visually explicit.
   - Cons: adds unnecessary structure and regression surface for a fixed 15-item catalog; risks changing ordering or skip behavior without product benefit.
   - Effort: Medium

### Recommendation

Use the static-catalog extension. Preserve the current category-block order and the relative order of all six existing questions: add the three general questions before `food-direction`, the three food questions after `food-format`, and the three venue questions after `venue-distance`. Keeping `food-direction` and `venue-atmosphere` first in their categories means each existing “Lascia fare a me” choice can skip all four later questions in that category without composable changes.

Add focused data-contract assertions for exactly 15 unique question IDs, five questions per category, valid non-empty options/reactions, and unchanged category order. Update the existing skip test's expected active IDs; a food shortcut alone will leave 11 active questions, while both category shortcuts leave seven. Avoid brittle tests that snapshot every sentence, but review every reaction as product copy: warm, witty, and neutral toward the selected option, with occasional subtle appreciation of the recipient's presence, smile, or style rather than body-focused, comparative, possessive, or pressuring language.

This should remain one PR. A realistic authored-change estimate is roughly 250–350 lines across data, tests, and the delta spec, below the 400-line review budget. If final copy formatting pushes the diff above 400 lines, split only along a cohesive content/test boundary or obtain `size:exception`; do not compress the data to game the limit.

### Risks

- “Exactly 15” can be misread as 15 questions always shown; the proposal/spec must distinguish catalog size from the shorter active sequence produced by shortcuts.
- Inserting questions before a shortcut would change what that shortcut can skip; preserve the shortcut as the first item in each skippable category.
- Hard-coded expected IDs in the current skip test will fail until updated, even though the skip algorithm itself should remain correct.
- Nine questions with multiple reactions can become repetitive or make compliments feel invasive; copy review must assess the set as a whole, not only individual lines.
- The archived OpenSpec config describes the pre-scaffold state and has stale testing metadata; implementation planning should rely on the current package scripts and source tests rather than that old context text.

### Ready for Proposal

Yes. The product decision is sufficiently specific. The proposal should keep the change content-focused, define 15 as the full catalog with a 5/5/5 category distribution, preserve category-local shortcuts and local-only behavior, and require Italian reactions that are playful, choice-neutral, respectful, and subtly appreciative without objectification or pressure.
