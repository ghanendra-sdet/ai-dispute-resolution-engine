# AI Dispute Resolution Engine — Shared Platform Services

> The AI Dispute Resolution Engine doesn't run in isolation — it's one of several products
> (Collection, Payout, Connected Banking, BBPS, Reseller, YOBO, and this AI-driven dispute
> module) built on top of a **common company-wide platform layer**. This document lists the
> shared services this product depends on, distinct from its own conversational-AI and
> anomaly-detection logic (see the [README](../README.md)).

## Why "Shared Platform" Matters for Testing

A defect in a shared service doesn't stay contained to one product. A bug in the company-wide
**Ledger Engine** or **Reconciliation Engine**, for example, directly affects this product's
ability to correctly reason about disputed transactions — the AI dispute engine consumes the
same transaction/ledger truth that Collection and Payout write, so a shared-service regression
can surface here as a *dispute-resolution* defect even though the root cause is elsewhere.

## Shared Platform Services (Company-Wide)

### Identity & Access
- Authentication
- Authorization
- OTP Service
- User Management
- Role & Permission Service

### Merchant Lifecycle
- Merchant Management
- Merchant Onboarding
- Merchant Activation
- Merchant Profile

### Financial Engines
- Commercial Engine
- GST Engine
- Ledger Engine
- Settlement Engine
- Reconciliation Engine

### Reporting & Data Export
- Report Engine
- Export Engine
- Download Engine
- Dashboard Service
- Search Engine
- Filter Engine

### Platform Infrastructure
- Audit Logs
- Activity Logs
- Notification Service
- API Gateway
- Validation Service
- File Upload Service
- File Download Service
- Scheduler / Background Workers

## How the AI Dispute Resolution Engine Depends on These

- **Ledger Engine / Reconciliation Engine** — dispute initiation and AI-suggested resolutions
  (see the README's Key Achievements) depend on accurate, up-to-date transaction and ledger data
  sourced from the same shared engines Collection and Payout write into — the AI model reasons
  over this shared source of truth, it doesn't maintain its own separate transaction record
- **Notification Service** — escalation triggers and real-time status updates to merchants and
  human agents (the fallback path in negative/boundary AI testing) flow through the shared
  notification layer
- **Audit Logs / Activity Logs** — every AI-suggested resolution and escalation decision needs a
  reliable audit trail for compliance and model-quality review, using the same shared logging
  infrastructure as every other product
- **Role & Permission Service** — the human-agent fallback path depends on correctly scoped
  access so an escalated dispute reaches the right operations/support role

## Platform Summary (Company-Wide Context)

| Product | Approx. Services |
|---|---|
| Collection | 38 |
| Payout | 35 |
| Connected Banking | 28 |
| Shared Platform | 28 |

**~70–80 unique logical services** across the platform in total — many shared rather than
independently reimplemented per product. This product does not yet have its own
separately-documented internal service breakdown in this portfolio; its module-level view is in
the [README](../README.md).

## Testing Implication: Blast Radius

When scoping regression for a change to any shared service, ask: *which other products also
depend on this service?* For this product specifically, the Ledger Engine and Reconciliation
Engine are the dependencies most worth flagging — since the AI model's dispute reasoning is only
as trustworthy as the transaction data it's reasoning over, a shared-service data-quality
regression elsewhere in the platform can manifest here as an incorrect AI-suggested resolution,
which is a much harder defect to trace back to its true root cause.
