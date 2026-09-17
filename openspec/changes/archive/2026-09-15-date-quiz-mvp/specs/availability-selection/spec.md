# Availability Selection Specification

## Purpose

Define selection and review of possible date-and-time values after acceptance.

## Requirements

### Requirement: Acceptance-gated availability

The system MUST provide a date-and-time calendar that lets the guest enter or select any date and time, MUST NOT restrict choices to predefined offered slots, and MUST make this step reachable only after an accepted invitation.

#### Scenario: Gate before acceptance

- GIVEN the invitation has not been accepted
- WHEN the guest attempts to reach availability
- THEN no availability controls are displayed and no date-time can be selected

#### Scenario: Accepted invitation

- GIVEN the guest has accepted the invitation
- WHEN availability is shown
- THEN the guest can enter or select a date and time
- AND a date-time outside any predefined list can be selected

### Requirement: Multi-select and revision

The system MUST allow selecting zero or more entered or selected date-time values, toggling each value independently, and reviewing the current set before completion.

#### Scenario: Select multiple date-times

- GIVEN the availability calendar is visible
- WHEN the guest selects two distinct date-time values
- THEN both are marked selected and appear in the review set

#### Scenario: Deselect a date-time

- GIVEN a date-time is selected
- WHEN the guest activates it again
- THEN it is deselected and removed from the review set

#### Scenario: Continue with no date-times

- GIVEN no date-times are selected
- WHEN the guest attempts to complete
- THEN the system keeps the step visible and states that at least one date-time is required

### Requirement: Accessible, private interaction

Date-time controls MUST expose selected state and date/time through accessible text, support keyboard operation and visible focus, meet usable touch-target sizing, and respect reduced motion. Date-time choices MUST remain ephemeral and local, with no calendar-provider or network transmission.

#### Scenario: Refresh clears availability

- GIVEN date-times have been selected
- WHEN the guest refreshes the page
- THEN no selections remain

#### Scenario: No external transmission

- GIVEN the guest has selected date-times
- WHEN the guest reviews or leaves the availability step
- THEN no network request or calendar-provider event is created
