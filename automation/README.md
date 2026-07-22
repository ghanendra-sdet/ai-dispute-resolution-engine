# AI Dispute Resolution Engine — Automation Framework

Automation for the shared dispute-resolution conversational flow, built with **Playwright +
TypeScript**.

## Why This Requires a Different Automation Approach

Unlike a standard UI regression suite, this engine's test surface is **conversational** — the
same input can legitimately produce slightly different (but equally correct) phrasing, so
assertions target **intent classification and outcome state** (was the right category detected?
did the ticket close? was the right data changed?) rather than exact string matching on the AI's
response text.

## Suggested Project Structure

```
automation/
├── README.md
├── playwright.config.ts
├── helpers/
│   └── ChatSession.ts        ← wraps sending a message and reading back structured outcome data
├── fixtures/
│   └── dummy-conversations.ts
└── tests/
    ├── sample-dispute-flow.spec.ts
    └── ...
```

> This repo currently includes one representative sample (`sample-dispute-flow.spec.ts`) rather
> than the full framework, to keep the portfolio focused.

## Test Data Policy

All automation uses **dummy data only**: dummy merchant IDs, dummy transaction references, and
scripted dummy conversational inputs designed to exercise each intent category — never real user
conversations or real account data.

## Priority Automated Scenarios

1. Intent recognition accuracy per category
2. AI-resolved happy path per category, starting with Transaction Status across all 5 connected
   products
3. Escalation fallback triggers
4. Context retention across multi-turn conversations
5. Cross-product consistency checks
