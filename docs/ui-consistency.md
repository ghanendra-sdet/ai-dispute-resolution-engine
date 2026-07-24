# AI Dispute Resolution Engine — UI Consistency

> Ticket/conversation state surfaces across the chat widget (however it's embedded per product)
> and any human-agent handoff view (see [`business-overview.md`](./business-overview.md)). This
> document covers whether it's represented **consistently** across all six connected products.

## Why This Matters More Here Than in Most Modules

This engine's central risk is silent cross-product inconsistency (see `business-overview.md`
section 6) — a regression can degrade one product's support quality without anywhere near
obviously breaking. UI/ticket-state inconsistency is the same failure mode at the presentation
layer: if "Escalated" looks or reads differently depending on which product embedded the chat
widget, a merchant can't tell whether they're waiting on a human or the AI just hasn't responded
yet, regardless of which of the six products they raised the issue from.

## 1. Ticket Status Representation Consistency

| Status | Expected Label | Expected Color (convention) |
|---|---|---|
| AI actively resolving | "In Progress" | Neutral/Blue |
| AI resolved, ticket closed | "Resolved" | Green |
| Escalated to human agent | "Escalated" / "With Support Team" | Amber |
| Human agent resolved | "Resolved" | Green — identical to AI-resolved, since the outcome is the same from the user's perspective |

**Test scenario:** the same status label/color set must render identically whether the chat
widget is embedded in Collection, Payout, Connected Banking, BBPS, Reseller, or YOBO — see
[`regression-checklist.md`](../regression-checklist.md) section 5 (Cross-Product Consistency).

## 2. Issue Category Labeling Consistency

Per the glossary in [`business-overview.md`](./business-overview.md), watch for drift on:

- The 6 issue categories (Transaction Status, Email Change, Mobile Number Change, Merchant
  Onboarding, Commission/Revenue Dispute, General Fintech Q&A) must be labeled identically
  regardless of originating product — never "Txn Status" in one product's widget and
  "Transaction Status" in another's
- "Commission/Revenue Dispute" is Reseller-specific in practice but the category taxonomy itself
  is shared platform-wide — the label must match exactly what Reseller's own
  [`docs/ui-consistency.md`](https://github.com/ghanendra-sdet/reseller-management-platform/blob/main/docs/ui-consistency.md)
  calls the same concept

## 3. Escalation & Handoff Messaging Consistency

- The message shown when an issue escalates to a human agent must be worded identically across
  all six products — a merchant shouldn't get a noticeably more or less reassuring message
  depending on which product they raised the issue from
- Verification-step prompts (Email Change, Mobile Number Change) must use identical wording and
  step count regardless of originating product

## 4. Empty States & Error Messages

- Does a merchant with zero prior tickets see a deliberate empty state in their ticket history,
  consistent across all six products?
- Is the "I didn't understand that" fallback message (see
  [`regression-checklist.md`](../regression-checklist.md) TC-024) worded identically everywhere?

## 5. Cross-Browser & Responsive Consistency

- Does the chat widget render identically across Chrome, Firefox, and Safari/WebKit regardless
  of which product's UI it's embedded in?

## 6. Accessibility Consistency

- Are In Progress/Resolved/Escalated states distinguishable by more than color alone?

---

## Coverage Mapping

See [`../regression-checklist.md`](../regression-checklist.md) section 5 for the cross-product
consistency test cases derived from this document.
