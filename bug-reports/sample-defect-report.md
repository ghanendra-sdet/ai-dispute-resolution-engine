# Sample Defect Report — AI Dispute Resolution Engine

> Template + worked examples using dummy data. Reflects defect themes specific to a *shared*
> conversational AI engine — where a regression's blast radius spans every connected product.

## Defect Theme Taxonomy

- Intent misclassification
- False AI-resolution (ticket closed but issue not actually fixed)
- Escalation failure (should have escalated, didn't)
- Context loss across conversation turns
- Cross-product inconsistency (same issue resolves differently by origin product)
- Security-sensitive action applied without proper verification
- Anomaly-detection false negative/positive

**Severity categories used:** Minor, Major, Critical, Blocker.

---

## Defect #1

| Field | Value |
|---|---|
| **ID** | BUG-AID-5012 (sample) |
| **Title** | Transaction Status queries from BBPS resolve at a much lower rate than other products |
| **Severity** | Major |
| **Module** | AI Dispute Resolution Engine → Cross-Product Consistency |
| **Environment** | UAT (dummy data) |

**Steps to Reproduce**
1. Raise an identical dummy Transaction Status query from each of the 5 connected products
2. Compare AI-resolution rate per originating product

**Expected Result**
Resolution rate for the same issue category should be consistent across all 5 products (per
`docs/architecture-and-flow.md`'s cross-product consistency principle).

**Actual Result**
BBPS-originated queries resolve at a noticeably lower rate — investigation shows BBPS transaction
data is passed to the AI in a different field format than the other 4 products, which the intent
handler doesn't parse correctly, causing it to fall back to escalation more often than necessary.

**Impact**
BBPS merchants get a measurably worse support experience for the identical underlying question —
exactly the "silent single-product degradation" risk this engine's shared design is meant to
avoid.

**Suggested Fix**
Normalize the transaction-data payload format from all 5 connected products to a single shared
schema before it reaches the AI resolution logic, rather than handling format differences
per-product inside the AI layer itself.

---

## Defect #2

| Field | Value |
|---|---|
| **ID** | BUG-AID-5031 (sample) |
| **Title** | Mobile number change applied without completing the verification step |
| **Severity** | Blocker |
| **Module** | AI Dispute Resolution Engine → Email/Mobile Change |
| **Environment** | UAT (dummy data) |

**Steps to Reproduce**
1. Start a Mobile Number Change request via chat
2. Abandon the conversation mid-verification (close the chat window)
3. Reopen and check whether the number was changed

**Expected Result**
The change should only apply after verification completes successfully — an abandoned
conversation should leave the original number untouched.

**Actual Result**
The number was changed despite verification never completing — the resolution logic applied the
change optimistically before confirming the verification step's result.

**Impact**
A security-sensitive account field can be changed without proper verification — this is the
highest-severity class of defect for this module, since it undermines the entire premise of
gating sensitive changes behind verification.

**Suggested Fix**
Gate the actual field update on a confirmed verification success event, not on the user simply
proceeding through the conversation flow.

---

## Defect Reporting Template (blank)

| Field | Value |
|---|---|
| **ID** | |
| **Title** | |
| **Severity** | Minor / Major / Critical / Blocker |
| **Module** | |
| **Environment** | |

**Steps to Reproduce**
1.
2.
3.

**Expected Result**


**Actual Result**


**Impact**


**Suggested Fix**

