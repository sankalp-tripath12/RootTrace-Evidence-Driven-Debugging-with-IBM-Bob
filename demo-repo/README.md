# RootTrace Feasibility Experiment

This repository is a deliberately seeded debugging scenario.

## Business scenario

An online checkout system supports percentage discounts.

A customer has:

- Keyboard: $100
- Mouse: $50
- Discount: 20%

Expected final price:

$120

## Current problem

The checkout calculation produces an incorrect result when a percentage discount is applied.

## RootTrace objective

Investigate the failure rather than immediately guessing the fix.

The investigation should:

1. Reproduce the failure.
2. Identify relevant files.
3. Trace the data flow.
4. Generate plausible hypotheses.
5. Gather evidence.
6. Identify the supported root cause.
7. Apply the smallest safe fix.
8. Run regression tests.
9. Report the evidence and validation.

Do not modify the repository until the investigation has established a supported root cause.
