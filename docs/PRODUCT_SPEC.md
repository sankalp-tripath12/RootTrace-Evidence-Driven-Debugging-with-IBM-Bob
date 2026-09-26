# RootTrace — Product Specification

## 1. Product

RootTrace is an evidence-driven debugging workflow powered by IBM Bob.

Core promise:

> Don't just guess the bug. Investigate it. Prove it. Fix it. Verify it.

## 2. Problem

AI coding assistants can suggest plausible fixes quickly, but developers still need to determine:

- What actually failed?
- Where did the failure originate?
- Which hypothesis explains the evidence?
- Was the proposed fix actually verified?
- What evidence supports the conclusion?

RootTrace structures debugging as an investigation rather than a single-shot code-generation request.

## 3. Core Workflow

Bug Report
→ Reproduce
→ Evidence Collection
→ Execution Trace
→ Hypotheses
→ Hypothesis Testing
→ Root Cause
→ Minimal Fix
→ Regression Verification
→ Debugging Case File

## 4. IBM Bob's Role

IBM Bob is the core developer workflow engine.

Bob should:

1. Inspect the repository.
2. Reproduce failures.
3. Trace relevant code.
4. Generate competing hypotheses.
5. Test hypotheses using repository evidence.
6. Identify the supported root cause.
7. Apply the smallest appropriate fix.
8. Run regression tests.
9. Report observed verification results.

## 5. MVP

The MVP must demonstrate:

- One controlled repository.
- One reproducible bug.
- Evidence collection.
- At least two plausible hypotheses when appropriate.
- Root-cause identification.
- Minimal fix.
- Before/after test results.
- Final debugging case file.

## 6. Case File

The user should be able to see:

- Incident
- Reproduction
- Evidence
- Hypotheses
- Confirmed root cause
- Changed files
- Fix
- Tests before
- Tests after
- Verification
- Confidence

## 7. MVP Constraints

Do NOT build:

- Authentication
- Billing
- GitHub OAuth
- Production database
- Arbitrary repository ingestion
- Multi-language support
- Complex RAG
- Unnecessary multi-agent orchestration
- Enterprise infrastructure

## 8. Demo Goal

The entire workflow should be understandable in approximately three minutes.

The demo should clearly show that RootTrace is different from a generic "AI fix my bug" workflow.

Differentiation:

> RootTrace treats debugging as an investigation: evidence first, competing hypotheses, verification, minimal fix, and regression proof.

## 9. Success Criteria

The MVP is successful when a judge can clearly see:

1. A real reproducible defect.
2. Evidence gathered from the repository.
3. Competing explanations.
4. Evidence used to distinguish them.
5. A supported root cause.
6. A minimal fix.
7. Tests proving the fix.
8. A persistent debugging case file.
