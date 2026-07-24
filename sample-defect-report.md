# Sample Defect Report — AI Dispute Resolution Engine

> Template + worked examples using dummy data. Reflects defect themes specific to a *shared*
> conversational AI engine — where a regression's blast radius spans every connected product. See
> [`docs/business-overview.md`](./docs/business-overview.md) for the six-product architecture
> behind this, and [`docs/README.md`](./docs/README.md) for the full documentation map.

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
1. Raise an identical dummy Transaction Status query from each of the 6 connected products
2. Compare AI-resolution rate per originating product

**Expected Result**
Resolution rate for the same issue category should be consistent across all 6 products (per
`docs/architecture-and-flow.md`'s cross-product consistency principle).

**Actual Result**
BBPS-originated queries resolve at a noticeably lower rate — investigation shows BBPS transaction
data is passed to the AI in a different field format than the other 5 products, which the intent
handler doesn't parse correctly, causing it to fall back to escalation more often than necessary.

**Impact**
BBPS merchants get a measurably worse support experience for the identical underlying question —
exactly the "silent single-product degradation" risk this engine's shared design is meant to
avoid.

**Suggested Fix**
Normalize the transaction-data payload format from all 6 connected products to a single shared
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

## Defect #3

| Field | Value |
|---|---|
| **ID** | BUG-AID-5047 (sample) |
| **Title** | Commission/Revenue Dispute queries auto-close without escalation when the AI is confident about the *explanation* |
| **Severity** | Major |
| **Module** | AI Dispute Resolution Engine → Commission/Revenue Dispute (Reseller) |
| **Environment** | UAT (dummy data) |

**Steps to Reproduce**
1. As a dummy reseller, raise a Commission/Revenue Dispute asking why a commission figure looks
   lower than expected
2. Explicitly follow up asking the AI to correct/adjust the figure
3. Observe whether the ticket escalates or closes

**Expected Result**
Per [`docs/architecture-and-flow.md`](./docs/architecture-and-flow.md), an explicit request to
adjust a commission figure must always escalate to a human agent with an auditable trail — the AI
may explain the calculation, but must never treat "I explained it confidently" as equivalent to
"I resolved a correction request."

**Actual Result**
The AI's high confidence in *explaining* the calculation was incorrectly reused as the
resolution-confidence signal for the *adjustment request* itself, so the ticket auto-closed as
AI-resolved without ever reaching a human agent — even though no adjustment was actually made and
the reseller's underlying concern was never addressed.

**Impact**
A reseller's legitimate revenue concern is silently dropped with a false "resolved" status — a
trust and financial-accuracy issue specific to this category, and a case where two logically
distinct actions (explaining vs. adjusting) were incorrectly treated as one for escalation
purposes.

**Suggested Fix**
Separate the confidence score for "can I explain this" from the escalation gate for "was an
adjustment explicitly requested" — the latter should always route to a human agent regardless of
how confident the AI is in its explanation.

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

