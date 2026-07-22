# AI Dispute Resolution Engine — Business Overview

> **Start here if you're new to fintech QA, in HR, or from a non-QA technical role.** This
> document explains why a *shared* AI dispute engine exists across five products, before you
> look at any test case or code.

## 1. What problem does it solve?

Every product a fintech platform ships generates support load: confused users, stuck
transactions, requests to update account details. The traditional approach — build a support
chatbot per product — means five separate, slowly-improving, inconsistently-quality bots. This
engine solves that by centralizing dispute/support handling into **one shared AI layer** that
every product routes into.

## 2. Why Centralization Beats Five Separate Bots

| Approach | Outcome |
|---|---|
| **Per-product chatbot** (5 separate builds) | Each learns from only its own product's conversation volume; inconsistent quality; 5x the QA effort to harden |
| **One shared engine** (this repo) | Learns from combined conversation volume across all 5 products; consistent quality everywhere; one place to test rigorously |

## 3. The Numbers That Justify This Architecture

- **Ticket resolution time:** reduced from a 24–72 hour baseline to **under 6 hours**
- **AI-only resolution rate:** **~80%** of raised issues never need a human agent at all
- Both figures hold **across all five connected products** — Collection, Payout, Connected
  Banking, BBPS, and YOBO — which is only possible because of the shared, centralized design

## 4. Issue Categories

- **Transaction Status** — "why is this still processing / is it stuck?"
- **Email Change** — updating a merchant's registered email
- **Mobile Number Change** — updating a merchant's registered mobile number
- **Merchant Onboarding** — status questions during signup/KYC/activation
- **General Fintech Q&A** — fees, settlement timing, supported transfer modes, and similar

## 5. Glossary

| Term | Meaning |
|---|---|
| **Intent Recognition** | The AI's classification of what the user is actually asking for |
| **AI-Resolved** | An issue closed entirely by the AI agent, no human involvement |
| **Escalation** | Handoff to a human agent when the AI can't resolve confidently |
| **Context Retention** | The AI correctly remembering earlier parts of the same conversation |
| **Cross-Product Consistency** | The same issue category resolving the same way regardless of which product it was raised from |

## 6. Why Cross-Product Consistency Is the Central Testing Theme

Because this engine is shared, a regression doesn't stay contained to one product. An
intent-recognition bug found only via Payout-originated tickets could just as easily be silently
degrading Collection, Connected Banking, BBPS, and YOBO's support quality too, if it isn't
explicitly tested per originating product. This is why the regression suite treats "same issue
category, five different originating products" as its own dedicated test dimension, not just
"test the chatbot once."

See [`architecture-and-flow.md`](./architecture-and-flow.md) for the detailed resolution flow.
