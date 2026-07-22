# AI Dispute Resolution Engine — Architecture & Flow

## Cross-Product Intake Flow

```
┌───────────┐  ┌────────┐  ┌───────────────────┐  ┌──────┐  ┌──────┐
│ Collection│  │ Payout │  │ Connected Banking  │  │ BBPS │  │ YOBO │
└─────┬─────┘  └────┬───┘  └─────────┬──────────┘  └──┬───┘  └──┬───┘
      │             │                │                │         │
      └─────────────┴────────────────┴────────────────┴─────────┘
                                 │
                                 ▼
                 ┌───────────────────────────────┐
                 │  AI Dispute Resolution Engine   │
                 │  (single shared entry point)    │
                 └───────────────────────────────┘
```

Every product passes along **product context** (which product the issue originated from, plus
relevant transaction/merchant IDs) so the AI agent can reason with the right data, even though
the conversational engine itself is shared.

## Resolution & Escalation Flow

```
Issue received (with product context)
        │
        ▼
Intent Recognition
        │
        ▼
Classify into one of 5 categories:
  Transaction Status / Email Change / Mobile Number Change /
  Merchant Onboarding / General Fintech Q&A
        │
        ├──▶ High confidence ──▶ AI proposes/executes resolution
        │                              │
        │                              ▼
        │                        User confirms / resolution applied
        │                              │
        │                              ▼
        │                        Ticket CLOSED (target: < 6 hours)
        │
        └──▶ Low confidence / sensitive action ──▶ Escalate
                     │
                     ▼
              Full conversation context handed to human agent
                     │
                     ▼
              Human agent resolves ──▶ Ticket CLOSED
```

## Why Some Categories Escalate More Than Others

Not all 5 categories carry equal escalation risk:

- **Transaction Status** and **General Fintech Q&A** are typically safe for full AI resolution —
  informational, low-risk if slightly imperfect
- **Email Change** and **Mobile Number Change** touch account security — these may require
  additional verification steps before the AI can safely auto-apply the change, and a
  lower-confidence classification here should escalate more readily than a status question would
- **Merchant Onboarding** questions often depend on state outside the AI's direct control (e.g.
  a pending KYC document review) — the AI can answer status questions confidently but shouldn't
  attempt to "resolve" an onboarding block it doesn't control

**Testing implication:** the ~80% AI-resolution rate is a platform-wide average — regression
should track resolution rate *per category*, not just in aggregate, since a category like Email
Change silently dropping to a much lower AI-resolution rate (correctly, due to security
escalation) looks identical in an aggregate number to a category that's failing for the wrong
reasons.

## System Interaction Map

```
   ┌────────────────────────────────────────────────┐
   │        5 Connected Products (issue sources)      │
   └───────────────────────┬──────────────────────────┘
                            ▼
                 ┌─────────────────────┐
                 │  Intent Recognition  │
                 └──────────┬───────────┘
                            ▼
                 ┌─────────────────────┐
                 │   Resolution Engine   │──▶ reads Ledger/Transaction
                 │  (per-category logic) │    data from the originating
                 └──────────┬───────────┘    product (via shared platform
                            ▼                  services — see
                 ┌─────────────────────┐       shared-platform-services.md)
                 │  Escalation Service   │
                 └──────────┬───────────┘
                            ▼
                 ┌─────────────────────┐
                 │   Human Agent Queue   │
                 └─────────────────────┘
```
