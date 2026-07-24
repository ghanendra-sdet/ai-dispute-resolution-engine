# AI Dispute Resolution Engine — Business Overview

> **Start here if you're new to fintech QA, in HR, or from a non-QA technical role.** This
> document explains why a *shared* AI dispute engine exists across six products, before you
> look at any test case or code.

## 1. What problem does it solve?

Every product a fintech platform ships generates support load: confused users, stuck
transactions, requests to update account details. The traditional approach — build a support
chatbot per product — means six separate, slowly-improving, inconsistently-quality bots. This
engine solves that by centralizing dispute/support handling into **one shared AI layer** that
every product routes into: **whatever goes wrong in Collection, Payout, Connected Banking, BBPS,
or Reseller, this engine is the one final destination for resolving it.**

## 2. Why Centralization Beats Six Separate Bots

| Approach | Outcome |
|---|---|
| **Per-product chatbot** (6 separate builds) | Each learns from only its own product's conversation volume; inconsistent quality; 6x the QA effort to harden |
| **One shared engine** (this repo) | Learns from combined conversation volume across all 6 products; consistent quality everywhere; one place to test rigorously |

## 3. The Numbers That Justify This Architecture

- **Ticket resolution time:** reduced from a 24–72 hour baseline to **under 6 hours**
- **AI-only resolution rate:** **~80%** of raised issues never need a human agent at all
- Both figures hold **across all six connected products** — Collection, Payout, Connected
  Banking, BBPS, Reseller, and YOBO — which is only possible because of the shared, centralized
  design

## 4. Issue Categories

- **Transaction Status** — "why is this still processing / is it stuck?"
- **Email Change** — updating a merchant's registered email
- **Mobile Number Change** — updating a merchant's registered mobile number
- **Merchant Onboarding** — status questions during signup/KYC/activation
- **Commission / Revenue Dispute** — a reseller questioning a commission figure, an attribution
  change, or why a merchant's transactions stopped generating expected revenue (raised from
  Reseller — see the
  [Reseller Management Platform](https://github.com/ghanendra-sdet/reseller-management-platform)
  repo's lifetime-commission model for why this needs its own category rather than folding into
  General Fintech Q&A)
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
degrading Collection, Connected Banking, BBPS, Reseller, and YOBO's support quality too, if it
isn't explicitly tested per originating product. This is why the regression suite treats "same
issue category, six different originating products" as its own dedicated test dimension, not
just "test the chatbot once."

See [`architecture-and-flow.md`](./architecture-and-flow.md) for the detailed resolution flow.
