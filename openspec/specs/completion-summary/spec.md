# Completion Summary Specification

## Purpose

Define the final local recap and the privacy boundary for completed or declined flows.

## Requirements

### Requirement: Accepted completion recap

After an accepted invitation and at least one selected slot, the system MUST show an on-screen recap of the decision, answered preferences, and selected date-and-time slots.

#### Scenario: Review accepted choices

- GIVEN the guest accepted and selected one or more slots
- WHEN the guest completes availability
- THEN a readable summary shows those choices
- AND the guest can distinguish selected slots from skipped categories

#### Scenario: No hidden submission

- GIVEN the completion summary is visible
- WHEN the guest views or leaves it
- THEN no message, request, notification, or third-party event is created

### Requirement: Declined completion boundary

The system MUST show a respectful decline end state without displaying availability or an accepted-choice summary.

#### Scenario: Decline ends the flow

- GIVEN the guest declined the invitation
- WHEN the decline end state is shown
- THEN no availability data is revealed
- AND no completion action is offered

### Requirement: Ephemeral accessible summary

Summary and end-state content MUST be navigable by keyboard, announced with meaningful headings and labels, readable without color alone, and usable with reduced motion. All quiz, decision, and slot data MUST remain in memory only and MUST be cleared on refresh.

#### Scenario: Refresh clears recap

- GIVEN an accepted completion summary is visible
- WHEN the guest refreshes the page
- THEN the flow starts without prior answers, decision, slots, or summary
