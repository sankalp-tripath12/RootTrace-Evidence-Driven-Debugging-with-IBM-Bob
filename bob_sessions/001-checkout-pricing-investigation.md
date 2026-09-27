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

| ID | Type | Source | Location | Observation | Relevance |
|---|---|---|---|---|---|
| E1 | Runtime output | `npm test` | `tests/checkout.test.js:33` | `Error: Discount rate must be between 0 and 1`; 2 pass, 1 fail | Confirms failure is reproducible |
| E2 | Stack trace | `npm test` | `discount.js:12 ← pricing.js:16 ← checkout.test.js:33` | Full call chain identifies the throw site | Identifies failure path |
| E3 | Runtime output | `npm start` | `checkout.js:18 → pricing.js:16 → discount.js:12` | Same error and exit code 1 | Confirms application path also fails |
| E4 | Runtime experiment | `applyDiscount(150, 20)` | `src/discount.js` | Integer `20` throws; decimal `0.20` returns `120` | Shows expected input format |
| E5 | Runtime experiment | `calculateSubtotal(items)` | `src/pricing.js` | Returns `150` | Shows subtotal calculation works |
| E6 | Runtime experiment | `calculateFinalPrice(items, 0)` | `src/pricing.js` | Returns `150` | Shows zero-discount path works |
| E7 | Runtime experiment | `calculateFinalPrice(items, 0.20)` | `src/pricing.js` | Returns `120` | Shows decimal input works |
| E8 | Source code | `src/discount.js:5–8` | `applyDiscount` JSDoc | `discountRate` is expected to be a decimal; 20% → 0.20 | Defines required input contract |
| E9 | Source code | `src/pricing.js:10` | `calculateFinalPrice` | Parameter is named `discountPercent` | Indicates percentage-based API |
| E10 | Source code | `src/checkout.js:16` | `discountPercent = 20` | Caller supplies integer 20 | Confirms percentage-based input |
| E11 | Test contract | `tests/checkout.test.js:33` | `calculateFinalPrice(items, 20)` | Test expects result `120` | Establishes public API contract |
| E12 | Source comment | `src/pricing.js:13–15` | BUG comment | Notes that `discountPercent` is 20 while `applyDiscount` expects 0.20 | Corroborates other evidence |

---

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