# RootTrace — Case File Schema

A Case File is the structured record of one debugging investigation.

## Case File

```text
id
title
status
createdAt

incident
reproduction

evidence[]

hypotheses[]

rootCause

changedFiles[]

fix

validation

confidence
cat > docs/INVESTIGATION_WORKFLOW.md <<'EOF'
# RootTrace — Investigation Workflow

## Phase 1 — Incident

Capture:

- User-reported problem.
- Expected behavior.
- Actual behavior.

## Phase 2 — Reproduction

Execute the relevant test or application.

Record:

- Exact command.
- Actual output.
- Exit status.
- Failing test.

Never report predicted results as observed results.

## Phase 3 — Evidence

Collect repository evidence:

- Relevant files.
- Functions.
- Variables.
- Data contracts.
- Execution path.
- Runtime errors.
- Test assertions.

## Phase 4 — Hypotheses

Generate plausible competing explanations.

For each hypothesis:

- Supporting evidence.
- Contradicting evidence.
- Experiment required.

Do not confirm a hypothesis simply because it looks plausible.

## Phase 5 — Hypothesis Testing

Run targeted experiments whenever possible.

Record:

- Command.
- Input.
- Observed output.
- Interpretation.

Clearly distinguish observed evidence from static inference.

## Phase 6 — Root Cause

Confirm the explanation that is supported by the strongest available evidence.

Explain why competing hypotheses were rejected or remain uncertain.

## Phase 7 — Fix

Make the smallest appropriate change.

Avoid:

- Unrelated refactoring.
- Unnecessary architecture changes.
- Cosmetic changes.

## Phase 8 — Regression

Run:

- Relevant failing test.
- Full relevant test suite.
- Application/runtime check when appropriate.

Record before/after results.

## Phase 9 — Case File

Produce the structured debugging record.

Required sections:

1. Incident
2. Reproduction
3. Evidence
4. Hypotheses
5. Confirmed Root Cause
6. Fix
7. Validation
8. Confidence

## Evidence Rules

Never fabricate:

- Test results.
- Command output.
- Runtime behavior.
- Confidence.
- Performance measurements.

Every claim must be traceable to repository evidence or an executed command.
