# Invitation Decision Specification

## Purpose

Define explicit, dignified acceptance and decline outcomes for the invitation.

## Requirements

### Requirement: Freely chosen decision

The system MUST present distinct Accept and Decline actions, treat either as a valid outcome, and MUST NOT submit, transmit, or conceal a decision.

#### Scenario: Accept invitation

- GIVEN the guest has completed the required quiz questions
- WHEN the guest chooses Accept
- THEN the accepted state is recorded locally
- AND availability selection becomes reachable

#### Scenario: Decline invitation

- GIVEN the decision step is visible
- WHEN the guest chooses Decline
- THEN a respectful end state is shown
- AND availability selection is not revealed or reachable

#### Scenario: Decision is revisable before completion

- GIVEN the guest has accepted and has not completed the final summary
- WHEN the guest returns to the decision and chooses Decline
- THEN the flow ends respectfully and no availability remains visible

### Requirement: Consent-respecting presentation

Decision copy MUST be non-coercive, MUST NOT imply punishment or obligation, and MUST provide equal keyboard access, visible focus, readable labels, and touch targets for both outcomes.

#### Scenario: Decline without pressure

- GIVEN the guest chooses Decline
- WHEN the end state is rendered
- THEN it contains no retry pressure, guilt, or availability details

### Requirement: Local privacy boundary

The system MUST keep the decision in ephemeral browser state only; it MUST NOT send it to a server or third party.

#### Scenario: Refresh after decision

- GIVEN a decision has been made
- WHEN the guest refreshes the page
- THEN no prior decision is available
