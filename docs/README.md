# AI Dispute Resolution Engine — Documentation Map

> New to this repo? Start here. This page answers the questions a tech-curious QA/SDET would
> actually ask, and points to exactly the doc that answers each one.

| Question | Answer |
|---|---|
| What is this, in plain terms? | [`business-overview.md`](./business-overview.md) sections 1–2 |
| Why does it exist as ONE shared engine, not six per-product bots? | [`business-overview.md`](./business-overview.md) section 2 |
| Who's involved / stakeholders? | [`../README.md`](../README.md#-who-typically-interacts-with-it) |
| What does it depend on? | [`shared-platform-services.md`](./shared-platform-services.md) |
| How does resolution/escalation actually work — tech flow? | [`architecture-and-flow.md`](./architecture-and-flow.md) |
| What issue categories does it handle? | [`business-overview.md`](./business-overview.md) section 4 |
| What does the UI need to get right, consistently? | [`ui-consistency.md`](./ui-consistency.md) |
| What's tested? | [`../regression-checklist.md`](../regression-checklist.md) |
| What's automated? | [`../automation/README.md`](../automation/README.md) |
| What does a real-looking defect report look like? | [`../sample-defect-report.md`](../sample-defect-report.md) |
| What does a regression execution report look like? | [`../regression-execution-summary.md`](../regression-execution-summary.md) |

## Business Flow vs. Tech Flow vs. User Flow

- **Business Flow** — why centralizing support into one engine makes commercial sense: one model
  improving from combined conversation volume, one consistent support experience across all six
  products, one place to harden QA rather than six. See
  [`business-overview.md`](./business-overview.md) sections 1–3.
- **Tech Flow** — how an issue is actually classified, resolved or escalated, and how the AI
  reasons over shared Ledger/Commercial Engine data from the originating product. See
  [`architecture-and-flow.md`](./architecture-and-flow.md).
- **User Flow** — what a merchant or reseller actually experiences: raise an issue from within
  whichever product they're using → converse with the AI → get resolved (~80% of the time) or
  escalated to a human agent with full context carried over. See the README's
  [How It Works](../README.md#-how-it-works--dispute-resolution-flow) section.

## Reading Order

```
README.md (repo root)
      │
      ▼
docs/business-overview.md      ← why one shared engine, issue categories, glossary
      │
      ▼
docs/architecture-and-flow.md  ← resolution/escalation flow, per-category escalation risk
      │
      ▼
docs/ui-consistency.md         ← cross-product ticket/chat UI consistency
      │
      ▼
docs/shared-platform-services.md  ← company-wide services + Commercial/Ledger Engine dependency
      │
      ▼
regression-checklist.md → sample-defect-report.md → regression-execution-summary.md → automation/README.md
```
