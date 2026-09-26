# RootTrace — Demo Scenario

## Scenario

A checkout application crashes when a 20% discount is applied.

## Repository

The controlled demonstration repository is:

demo-repo/

## Bug

The checkout passes 20 as a percentage.

The discount calculation function expects 0.20.

The conversion between these representations is missing.

## Expected

Cart subtotal: $150

20% discount: $30

Final price: $120

## Before Fix

Observed baseline:

npm test
3 tests
2 pass
1 fail

Failing test:

calculates final price with 20 percent discount

Application:

npm start
Error: Discount rate must be between 0 and 1

## Investigation

Bob should:

1. Reproduce the failure.
2. Trace the discount value.
3. Identify the contract mismatch.
4. Generate competing hypotheses.
5. Test the hypotheses.
6. Confirm the supported root cause.

## Fix

The expected minimal fix converts percentage to decimal:

return applyDiscount(subtotal, discountPercent / 100);

## After Fix

npm test
3 tests
3 pass
0 fail

Application:

Final price: $120

## Demo Narrative

Opening:

"The application is broken. Instead of asking AI to guess a fix, RootTrace investigates the failure."

Middle:

"Bob reproduces the failure, traces the value, compares competing hypotheses, and identifies the evidence supporting the root cause."

Closing:

"The fix is minimal, and the test suite proves the original failure is gone."

## Important

The demo must show actual Bob activity and actual test results.

Do not fabricate investigation evidence or performance claims.
