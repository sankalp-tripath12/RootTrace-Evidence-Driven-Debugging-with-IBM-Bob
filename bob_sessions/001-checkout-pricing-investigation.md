# RootTrace Case File — Checkout Pricing Failure

## 1. INCIDENT

**Summary:** The checkout application crashes with `Error: Discount rate must be between 0 and 1` whenever a non-zero discount percentage is applied. No final price is produced; the application exits with code 1.

**Expected behavior:** `calculateFinalPrice(cart, 20)` → `$120.00` (cart subtotal `$150` with 20% discount)

**Actual behavior:** Application throws `Error: Discount rate must be between 0 and 1` and exits with code 1. The failing test `calculates final price with 20 percent discount` confirms the same error in the test suite.

---

## 2. REPRODUCTION

| | |
|---|---|
| **Command 1** | `npm test` |
| **Expected result** | 3 tests pass |
| **Actual result** | 2 pass, 1 fails: `calculates final price with 20 percent discount` |
| **Exit status** | `1` |
| **Error** | `Error: Discount rate must be between 0 and 1` at `discount.js:12`, called from `pricing.js:16`, called from `checkout.test.js:33` |
| **Reproduced** | YES — observed from executed command |

| | |
|---|---|
| **Command 2** | `npm start` |
| **Expected result** | `Final price: $120` printed to stdout |
| **Actual result** | Same error thrown, no output, exit code 1 |
| **Exit status** | `1` |
| **Reproduced** | YES — observed from executed command |

---

## 3. EVIDENCE

### E1 — Runtime Output

- **Type:** Runtime output
- **Source:** `npm test`
- **Location:** `tests/checkout.test.js:33`
- **Observation:** `Error: Discount rate must be between 0 and 1`; 2 tests pass and 1 fails.
- **Relevance:** Confirms the failure is reproducible.

### E2 — Stack Trace

- **Type:** Stack trace
- **Source:** `npm test`
- **Location:** `discount.js:12 ← pricing.js:16 ← checkout.test.js:33`
- **Observation:** The full call chain identifies the throw site.
- **Relevance:** Identifies the failure path.

### E3 — Application Runtime

- **Type:** Runtime output
- **Source:** `npm start`
- **Location:** `checkout.js:18 → pricing.js:16 → discount.js:12`
- **Observation:** Same error occurs and the process exits with code 1.
- **Relevance:** Confirms the application path also fails.

### E4 — Input Boundary Experiment

- **Type:** Runtime experiment
- **Source:** `applyDiscount(150, 20)`
- **Location:** `src/discount.js`
- **Observation:** Integer `20` throws; decimal `0.20` returns `120`.
- **Relevance:** Shows the expected input format.

### E5 — Subtotal Experiment

- **Type:** Runtime experiment
- **Source:** `calculateSubtotal(items)`
- **Location:** `src/pricing.js`
- **Observation:** Returns `150`.
- **Relevance:** Shows subtotal calculation works.

### E6 — Zero Discount Experiment

- **Type:** Runtime experiment
- **Source:** `calculateFinalPrice(items, 0)`
- **Location:** `src/pricing.js`
- **Observation:** Returns `150`.
- **Relevance:** Shows the zero-discount path works.

### E7 — Decimal Input Experiment

- **Type:** Runtime experiment
- **Source:** `calculateFinalPrice(items, 0.20)`
- **Location:** `src/pricing.js`
- **Observation:** Returns `120`.
- **Relevance:** Shows decimal input works.

### E8 — Function Contract

- **Type:** Source code
- **Source:** `src/discount.js:5–8`
- **Location:** `applyDiscount` JSDoc
- **Observation:** `discountRate` is expected to be a decimal; 20% → 0.20.
- **Relevance:** Defines the required input contract.

### E9 — API Naming

- **Type:** Source code
- **Source:** `src/pricing.js:10`
- **Location:** `calculateFinalPrice`
- **Observation:** Parameter is named `discountPercent`.
- **Relevance:** Indicates percentage-based input.

### E10 — Caller Input

- **Type:** Source code
- **Source:** `src/checkout.js:16`
- **Location:** `discountPercent = 20`
- **Observation:** Caller supplies integer `20`.
- **Relevance:** Confirms percentage-based input.

### E11 — Test Contract

- **Type:** Test contract
- **Source:** `tests/checkout.test.js:33`
- **Location:** `calculateFinalPrice(items, 20)`
- **Observation:** Test expects result `120`.
- **Relevance:** Establishes the public API contract.

### E12 — Source Comment

- **Type:** Source comment
- **Source:** `src/pricing.js:13–15`
- **Location:** BUG comment
- **Observation:** Notes that `discountPercent` is `20` while `applyDiscount` expects `0.20`.
- **Relevance:** Corroborates the other evidence.
## 4. HYPOTHESES

### Hypothesis A — Missing `/ 100` conversion

**Statement:** `calculateFinalPrice` accepts an integer percentage such as `20`, but passes it directly to `applyDiscount`, which expects a decimal such as `0.20`.

**Supporting evidence:** The parameter is named `discountPercent`, the caller uses `discountPercent = 20`, and the test calls `calculateFinalPrice(items, 20)`. The `applyDiscount` contract requires a decimal.

**Contradicting evidence:** None found.

**Test required:** Test whether converting `20` to `0.20` at the `calculateFinalPrice` boundary makes the existing test suite pass.

**Result:** Applying `discountPercent / 100` makes the tests pass and the application produce `$120`.

**Status:** SUPPORTED.

---

### Hypothesis B — Callers should pass decimal values

**Statement:** `calculateFinalPrice` should receive a decimal such as `0.20`, and the caller and test are incorrect when they use `20`.

**Supporting evidence:** `calculateFinalPrice(items, 0.20)` returns `120`.

**Contradicting evidence:** The parameter is named `discountPercent`, the caller uses `discountPercent = 20`, and the existing test explicitly calls `calculateFinalPrice(items, 20)` and expects `120`.

**Test required:** Determine whether changing only the caller to `0.20` would make the existing test suite pass.

**Result:** It would not make the existing test pass because the test still supplies `20`.

**Status:** REJECTED.

---

## 5. CONFIRMED ROOT CAUSE

`calculateFinalPrice` accepts a percentage value such as `20`, but passes the raw integer directly to `applyDiscount`.

`applyDiscount` requires a decimal value between `0` and `1`.

Therefore:

```text
20
↓
expected conversion
↓
0.20