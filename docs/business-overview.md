# AI Dispute Resolution Engine — Business Overview

> **Start here if you're new to fintech QA, in HR, or from a non-QA technical role.** This
> document explains what this product actually is, why a *shared* AI layer exists across six
> products, before you look at any test case or code.

## 1. What This Product Is

Before anything else, it's worth being precise about what this actually is — because "AI Dispute
Resolution Engine" undersells it, and it's easy to mistake it for a chatbot.

**It is not:**
- ❌ A chatbot
- ❌ A simple AI search tool
- ❌ An FAQ bot
- ❌ Just an AI for dispute resolution

**It is an AI operating layer that sits on top of the platform.** Once a business is onboarded,
the AI has access — subject to permissions — to data across the platform: Connected Banking,
Collection, Payout, Disputes, Settlements, Reports, Commercials, KYC, Transactions, Audit Logs,
User Roles, and Analytics. It understands the *relationships* between this data, not just
individual records in isolation, and serves both Admins and Merchants from that shared
understanding. Dispute/support resolution — the six categories covered in section 5 below — is
the most mature, most rigorously validated capability, but it's one capability within a broader
layer, not the whole product.

**Merchant-side examples:**
- "Why did my settlement decrease today?"
- "Which transactions are likely to become disputes?"
- "Why did this payout fail?"
- "Generate a reconciliation report."
- "How can I reduce chargebacks?"
- "Show merchants with the highest collection success rate."
- "Summarise today's business."

**Admin-side examples:**
- "Which merchants are at high operational risk?"
- "Which merchants have abnormal transaction patterns?"
- "Why did today's settlements fail?"
- "Which commercial configuration is causing issues?"
- "Identify suspicious activity."
- "Recommend actions before merchants raise tickets."

Notice the range in those examples — this is doing more than answering questions. It is:

- **Understanding data** across products, not just within one
- **Correlating events** (a settlement drop *because of* a specific failed payout batch, not two
  unrelated facts sitting next to each other)
- **Predicting outcomes** (which transactions are *likely* to become disputes, before they do)
- **Explaining issues** in plain language instead of requiring a manual report pull
- **Recommending actions** an Admin or Merchant hasn't thought to ask for yet
- **Automating workflows** where the action is safe to execute directly

That combination is why this repo treats the product as an **AI Operations Copilot**:
conversational, cross-product, and action-capable — but with a hard, tested line between what it
does autonomously and what it only proposes.

### Does It Just Answer, or Does It Act?

Both — deliberately split by risk, not by convenience:

| Tier | Example | Behavior |
|---|---|---|
| **Understand & Recommend** (always autonomous) | "Why did my settlement decrease?", "Summarise today's business" | AI answers directly — read-only, no approval needed |
| **Low-risk action** (autonomous) | "Generate and email the report" | AI executes directly — reversible, no financial/security exposure |
| **High-risk action** (propose → human confirms) | "Refund this dispute", "Approve this beneficiary", "Block this merchant", "Create a settlement" | AI drafts the action and its reasoning; a human must confirm before it executes; every proposal is audit-logged regardless of outcome |

> [!IMPORTANT]
> This tiering isn't compliance theater bolted on afterward — it's the actual reason this product
> can be trusted to sit this deep in the platform at all. An AI that unilaterally creates
> settlements or blocks merchants without a human-auditable confirmation step is a categorically
> riskier product to ship and to test. See section 7 for how this maps to actual test design.

## 2. What problem does it solve?

Every product a fintech platform ships generates support load: confused users, stuck
transactions, requests to update account details. The traditional approach — build a support
chatbot per product — means six separate, slowly-improving, inconsistently-quality bots. This
engine solves that by centralizing dispute/support handling into **one shared AI layer** that
every product routes into: **whatever goes wrong in Collection, Payout, Connected Banking, BBPS,
or Reseller, this engine is the one final destination for resolving it.**

## 3. Why Centralization Beats Six Separate Bots

| Approach | Outcome |
|---|---|
| **Per-product chatbot** (6 separate builds) | Each learns from only its own product's conversation volume; inconsistent quality; 6x the QA effort to harden |
| **One shared engine** (this repo) | Learns from combined conversation volume across all 6 products; consistent quality everywhere; one place to test rigorously |

## 4. The Numbers That Justify This Architecture

- **Ticket resolution time:** reduced from a 24–72 hour baseline to **under 6 hours**
- **AI-only resolution rate:** **~80%** of raised issues never need a human agent at all
- Both figures hold **across all six connected products** — Collection, Payout, Connected
  Banking, BBPS, Reseller, and YOBO — which is only possible because of the shared, centralized
  design

## 5. Dispute/Support Issue Categories

The most mature, most rigorously validated slice of the AI Operations Copilot's capability set —
the six categories below all fall under the "Understand & Recommend" and "propose → human
confirms" tiers described in section 1, applied specifically to support/dispute conversations:

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

## 6. Glossary

| Term | Meaning |
|---|---|
| **Intent Recognition** | The AI's classification of what the user is actually asking for |
| **AI-Resolved** | An issue closed entirely by the AI agent, no human involvement |
| **Escalation** | Handoff to a human agent when the AI can't resolve confidently |
| **Context Retention** | The AI correctly remembering earlier parts of the same conversation |
| **Cross-Product Consistency** | The same issue category resolving the same way regardless of which product it was raised from |
| **Action Tier** | Which of the three risk tiers (Understand & Recommend / Low-risk action / High-risk action) a given AI capability falls into — see section 1 |
| **Propose vs. Execute** | Whether the AI carries out an action directly (execute) or drafts it for a human to confirm first (propose) — high-risk actions are always propose-only |
| **Audit Trail** | The logged record of an AI-proposed or AI-executed action, including its reasoning, independent of whether a human approved, rejected, or never reviewed it |

## 7. Why Cross-Product Consistency Is the Central Testing Theme

Because this engine is shared, a regression doesn't stay contained to one product. An
intent-recognition bug found only via Payout-originated tickets could just as easily be silently
degrading Collection, Connected Banking, BBPS, Reseller, and YOBO's support quality too, if it
isn't explicitly tested per originating product. This is why the regression suite treats "same
issue category, six different originating products" as its own dedicated test dimension, not
just "test the chatbot once."

The same principle extends to the broader capability set from section 1: a BI-query or
predictive-risk regression is just as capable of silently degrading across all six connected
products as an intent-recognition regression is — it's tested the same way, per product, not once
in aggregate.

See [`architecture-and-flow.md`](./architecture-and-flow.md) for the detailed resolution flow, and
[`../regression-checklist.md`](../regression-checklist.md) section 10 for how the action-tier
model translates into actual test cases.
