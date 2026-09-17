# Preference Quiz Specification

## Purpose

Define the guest's ordered, revisable preference questions and respectful reactions.

## Requirements

### Requirement: Ordered, revisable questions

The system MUST present each required question in a defined order, allow only a provided answer, and allow the guest to move backward and change an earlier answer before the decision step.

#### Scenario: Answer progression

- GIVEN the guest is viewing an unanswered question
- WHEN the guest selects a provided answer
- THEN the answer is recorded and the next question is shown
- AND progress identifies the current position

#### Scenario: Revising an answer

- GIVEN a later question is visible and an earlier question has an answer
- WHEN the guest navigates backward and selects a different answer
- THEN the new answer replaces the earlier answer
- AND forward navigation uses the revised answer

#### Scenario: No answer selected

- GIVEN the current question has no answer
- WHEN the guest attempts to continue
- THEN the system keeps the question visible and identifies that an answer is required

### Requirement: Surprise category shortcut

The system MUST provide “Leave it to me” for applicable food or venue details, record that preference, and skip only the remaining questions in that category.

#### Scenario: Leave it to me

- GIVEN an applicable category question is visible
- WHEN the guest chooses “Leave it to me”
- THEN remaining questions in that category are skipped
- AND unrelated required questions remain available

#### Scenario: Back navigation after shortcut

- GIVEN a category was skipped by “Leave it to me”
- WHEN the guest navigates backward
- THEN the shortcut choice is reviewable and changeable

### Requirement: Respectful reactions and access

After each answer, the system SHOULD show a brief choice-neutral reaction and MUST NOT mock, sexualize, penalize, or pressure the guest. Quiz controls MUST be keyboard operable, visibly focused, text-labelled, and usable with reduced motion.

#### Scenario: Reaction does not gate progress

- GIVEN an answer has been selected
- WHEN its reaction is shown
- THEN the guest can continue or navigate backward without waiting for an animation
