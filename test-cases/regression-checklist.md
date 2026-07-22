# AI Dispute Resolution Engine — Regression Checklist & Test Cases

> Sample regression suite structure with dummy data. Format: ID | Scenario | Steps | Expected Result

## 1. Intent Recognition (Per Category)

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-001 | Recognize Transaction Status intent | 1. Send a dummy message: "Why is my transaction still pending?" | Classified as `TRANSACTION_STATUS` |
| TC-002 | Recognize Email Change intent | 1. Send: "I need to update my email address" | Classified as `EMAIL_CHANGE` |
| TC-003 | Recognize Mobile Number Change intent | 1. Send: "How do I change my registered mobile number?" | Classified as `MOBILE_CHANGE` |
| TC-004 | Recognize Merchant Onboarding intent | 1. Send: "What's the status of my KYC?" | Classified as `ONBOARDING_STATUS` |
| TC-005 | Recognize General Fintech Q&A intent | 1. Send: "What are your settlement timelines?" | Classified as `GENERAL_QA` |
| TC-006 | Ambiguous message handling | 1. Send a genuinely ambiguous dummy message spanning two categories | AI asks a clarifying question rather than guessing incorrectly |

## 2. AI-Resolved Happy Path (Per Category × Per Product)

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-007 | Transaction Status — resolved, originating from Collection | 1. Raise a dummy Transaction Status query tagged as originating from Collection | AI correctly reads Collection's transaction data and resolves without escalation |
| TC-008 | Transaction Status — resolved, originating from Payout | 1. Same query, tagged as originating from Payout | AI correctly reads Payout's transaction data and resolves — same quality as TC-007 |
| TC-009 | Transaction Status — resolved, originating from Connected Banking | 1. Same query, tagged as Connected Banking | Resolves consistently with TC-007/008 |
| TC-010 | Transaction Status — resolved, originating from BBPS | 1. Same query, tagged as BBPS | Resolves consistently |
| TC-011 | Transaction Status — resolved, originating from YOBO | 1. Same query, tagged as YOBO | Resolves consistently |
| TC-012 | Email Change — AI-assisted with verification step | 1. Request an email change via chat | AI guides through any required verification before applying the change |
| TC-013 | Mobile Number Change — AI-assisted with verification step | 1. Request a mobile number change via chat | AI guides through any required verification before applying the change |
| TC-014 | Merchant Onboarding — status-only, correctly not "resolved" | 1. Ask about a pending KYC review | AI provides accurate status but does not falsely claim to have "resolved" something outside its control |
| TC-015 | General Fintech Q&A — resolved | 1. Ask a general question about supported transfer modes | AI answers accurately and closes the ticket without escalation |

## 3. Escalation to Human Agent

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-016 | Low-confidence classification escalates | 1. Send a dummy message the AI has low confidence classifying | Escalated to a human agent rather than guessing |
| TC-017 | Security-sensitive action escalates when verification fails | 1. Attempt an Email Change with failed dummy verification | Escalated, change NOT applied automatically |
| TC-018 | Full context carried to human agent | 1. Trigger an escalation mid-conversation | Human agent sees the full prior conversation, not a blank slate |
| TC-019 | User-requested escalation | 1. User explicitly asks to speak to a human | Immediate escalation, regardless of AI confidence |

## 4. Context Retention

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-020 | Multi-turn context retained | 1. Provide info across 3 conversational turns 2. Reference earlier info in a later turn | AI correctly recalls and uses the earlier information |
| TC-021 | Context reset between unrelated tickets | 1. Close one ticket 2. Start a new, unrelated conversation | No bleed-over of the previous ticket's context |

## 5. Cross-Product Consistency

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-022 | Same category, all 5 products, consistent resolution rate | 1. Run the same dummy Transaction Status scenario across all 5 products | Resolution behavior and accuracy are consistent across all 5 — no single product silently underperforming |

## 6. Anomaly Detection & Negative Testing

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-023 | Fraud-pattern injection triggers alert | 1. Simulate a dummy edge-case transaction pattern associated with fraud | Anomaly flagged, appropriate alert/escalation triggered |
| TC-024 | AI response to nonsensical input | 1. Send deliberately nonsensical/garbled dummy input | Graceful degradation — a clear "I didn't understand" response, not a crash or wrong classification |
| TC-025 | AI response under service degradation | 1. Simulate a backend dependency being slow/unavailable (test env) | AI gracefully falls back / informs the user, rather than hanging indefinitely |

## 7. Full Regression Checklist

- [ ] Intent Recognition (all 5 categories)
- [ ] AI-Resolved Happy Path (all 5 categories × all 5 connected products)
- [ ] Escalation to Human Agent (low-confidence / security-sensitive / user-requested)
- [ ] Context Retention (multi-turn, ticket-to-ticket isolation)
- [ ] Cross-Product Consistency
- [ ] Anomaly Detection
- [ ] Negative / Boundary AI Response Handling

## 8. Priority Automation Candidates

1. Intent recognition accuracy per category
2. AI-resolved happy path per category (starting with Transaction Status across all 5 products,
   since it's the highest-volume, lowest-risk category)
3. Escalation fallback triggers
4. Context retention across multi-turn conversations
5. Cross-product consistency checks

See [`automation/`](../automation) for the Playwright implementation.
