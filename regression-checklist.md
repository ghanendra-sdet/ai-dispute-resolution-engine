# AI Dispute Resolution Engine — Regression Checklist & Test Cases

> Sample regression suite structure with dummy data. Format: ID | Scenario | Steps | Expected Result.
> See [`docs/business-overview.md`](./docs/business-overview.md) for why cross-product
> consistency (section 6) is treated as a first-class scenario here, and
> [`docs/README.md`](./docs/README.md) for the full documentation map.

## 1. Intent Recognition (Per Category)

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-001 | Recognize Transaction Status intent | 1. Send a dummy message: "Why is my transaction still pending?" | Classified as `TRANSACTION_STATUS` |
| TC-002 | Recognize Email Change intent | 1. Send: "I need to update my email address" | Classified as `EMAIL_CHANGE` |
| TC-003 | Recognize Mobile Number Change intent | 1. Send: "How do I change my registered mobile number?" | Classified as `MOBILE_CHANGE` |
| TC-004 | Recognize Merchant Onboarding intent | 1. Send: "What's the status of my KYC?" | Classified as `ONBOARDING_STATUS` |
| TC-005 | Recognize General Fintech Q&A intent | 1. Send: "What are your settlement timelines?" | Classified as `GENERAL_QA` |
| TC-006 | Ambiguous message handling | 1. Send a genuinely ambiguous dummy message spanning two categories | AI asks a clarifying question rather than guessing incorrectly |
| TC-007 | Recognize Commission/Revenue Dispute intent | 1. Send (as a dummy reseller): "Why hasn't my commission updated for this merchant?" | Classified as `COMMISSION_DISPUTE` |

## 2. AI-Resolved Happy Path (Per Category × Per Product)

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-008 | Transaction Status — resolved, originating from Collection | 1. Raise a dummy Transaction Status query tagged as originating from Collection | AI correctly reads Collection's transaction data and resolves without escalation |
| TC-009 | Transaction Status — resolved, originating from Payout | 1. Same query, tagged as originating from Payout | AI correctly reads Payout's transaction data and resolves — same quality as TC-008 |
| TC-010 | Transaction Status — resolved, originating from Connected Banking | 1. Same query, tagged as Connected Banking | Resolves consistently with TC-008/009 |
| TC-011 | Transaction Status — resolved, originating from BBPS | 1. Same query, tagged as BBPS | Resolves consistently |
| TC-012 | Transaction Status — resolved, originating from Reseller | 1. Same query, tagged as Reseller | Resolves consistently |
| TC-013 | Transaction Status — resolved, originating from YOBO | 1. Same query, tagged as YOBO | Resolves consistently |
| TC-014 | Email Change — AI-assisted with verification step | 1. Request an email change via chat | AI guides through any required verification before applying the change |
| TC-015 | Mobile Number Change — AI-assisted with verification step | 1. Request a mobile number change via chat | AI guides through any required verification before applying the change |
| TC-016 | Merchant Onboarding — status-only, correctly not "resolved" | 1. Ask about a pending KYC review | AI provides accurate status but does not falsely claim to have "resolved" something outside its control |
| TC-017 | General Fintech Q&A — resolved | 1. Ask a general question about supported transfer modes | AI answers accurately and closes the ticket without escalation |
| TC-018 | Commission/Revenue Dispute — AI explains calculation, does not unilaterally adjust | 1. As a dummy reseller, ask why a commission figure looks lower than expected | AI explains the calculation transparently (rate, source transactions) but does not modify the figure itself — see TC-023 |

## 3. Escalation to Human Agent

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-019 | Low-confidence classification escalates | 1. Send a dummy message the AI has low confidence classifying | Escalated to a human agent rather than guessing |
| TC-020 | Security-sensitive action escalates when verification fails | 1. Attempt an Email Change with failed dummy verification | Escalated, change NOT applied automatically |
| TC-021 | Full context carried to human agent | 1. Trigger an escalation mid-conversation | Human agent sees the full prior conversation, not a blank slate |
| TC-022 | User-requested escalation | 1. User explicitly asks to speak to a human | Immediate escalation, regardless of AI confidence |
| TC-023 | Commission adjustment always escalates | 1. As a dummy reseller, explicitly request a commission correction | Always escalated to a human agent with an auditable trail — the AI never applies a commission adjustment itself |

## 4. Context Retention

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-024 | Multi-turn context retained | 1. Provide info across 3 conversational turns 2. Reference earlier info in a later turn | AI correctly recalls and uses the earlier information |
| TC-025 | Context reset between unrelated tickets | 1. Close one ticket 2. Start a new, unrelated conversation | No bleed-over of the previous ticket's context |

## 5. Cross-Product Consistency

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-026 | Same category, all 6 products, consistent resolution rate | 1. Run the same dummy Transaction Status scenario across all 6 products | Resolution behavior and accuracy are consistent across all 6 — no single product silently underperforming |
| TC-027 | Commission/Revenue Dispute category exists only for Reseller-originated tickets | 1. Attempt to raise a Commission/Revenue Dispute tagged as originating from Collection (a product with no commission concept) | AI correctly recognizes the category doesn't apply and redirects/clarifies rather than misclassifying |

## 6. UI Consistency

> Derived from [`docs/ui-consistency.md`](./docs/ui-consistency.md) — cross-product/cross-screen
> consistency, not single-screen correctness.

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-028 | Ticket status labeling consistency | 1. Compare "In Progress"/"Resolved"/"Escalated" labels across the chat widget embedded in each of the 6 products | Identical labels and colors everywhere |
| TC-029 | Issue category labeling consistency | 1. Compare the 6 issue category names as shown in the chat UI across all 6 products | Identical naming used everywhere, matching the taxonomy in `docs/business-overview.md` |
| TC-030 | Escalation status distinguishable without color | 1. View In Progress/Resolved/Escalated states with color/grayscale rendering simulated | Each remains distinguishable via icon/text label alone |

## 7. Anomaly Detection & Negative Testing

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-031 | Fraud-pattern injection triggers alert | 1. Simulate a dummy edge-case transaction pattern associated with fraud | Anomaly flagged, appropriate alert/escalation triggered |
| TC-032 | AI response to nonsensical input | 1. Send deliberately nonsensical/garbled dummy input | Graceful degradation — a clear "I didn't understand" response, not a crash or wrong classification |
| TC-033 | AI response under service degradation | 1. Simulate a backend dependency being slow/unavailable (test env) | AI gracefully falls back / informs the user, rather than hanging indefinitely |

## 8. Full Regression Checklist

- [ ] Intent Recognition (all 6 categories)
- [ ] AI-Resolved Happy Path (all 6 categories × all 6 connected products)
- [ ] Escalation to Human Agent (low-confidence / security-sensitive / user-requested / commission-adjustment)
- [ ] Context Retention (multi-turn, ticket-to-ticket isolation)
- [ ] Cross-Product Consistency
- [ ] UI Consistency (ticket status labeling, category labeling, accessibility)
- [ ] Anomaly Detection
- [ ] Negative / Boundary AI Response Handling

## 9. Priority Automation Candidates

1. Intent recognition accuracy per category
2. AI-resolved happy path per category (starting with Transaction Status across all 6 products,
   since it's the highest-volume, lowest-risk category)
3. Escalation fallback triggers, including mandatory escalation for commission adjustments
4. Context retention across multi-turn conversations
5. Cross-product consistency checks

See [`automation/`](./automation) for the Playwright implementation.
