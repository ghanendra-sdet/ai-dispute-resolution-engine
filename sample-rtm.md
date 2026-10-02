# Sample Requirement Traceability Matrix — AI Dispute Resolution Engine

> Worked example using dummy data. An RTM is referenced throughout this portfolio as a core QA
> artifact — this is what that artifact actually looks like, not just a claim that it exists.
> See [`docs/README.md`](./docs/README.md) for the full documentation map.

## What an RTM Is Actually For

A regression checklist (see [`regression-checklist.md`](./regression-checklist.md)) answers
"what do we test." An RTM answers a different, equally important question: **"does every
business requirement have test coverage, and is that coverage actually sufficient?"** The two
documents look similar but serve different purposes — a checklist is organized by test area; an
RTM is organized by *requirement*, which is what makes it the tool that actually catches a
requirement with **no** test coverage at all, not just a weakly-tested one.

## The Matrix

| Req ID | Requirement (from a sample sprint story) | Linked Test Case(s) | Automation Status | Coverage Status |
|---|---|---|---|---|
| REQ-701 | Each of the 6 issue categories is correctly classified from a representative message | TC-001–005, TC-007 | Automated | ✅ Covered |
| REQ-702 | A genuinely ambiguous message triggers a clarifying question, not a guess | TC-006 | Manual | ✅ Covered |
| REQ-703 | The same issue category resolves consistently regardless of which of the 6 products it originated from | TC-008–013, TC-026 | Automated | ✅ Covered |
| REQ-704 | A security-sensitive field change is gated on a confirmed verification event, not conversational progress | TC-014, TC-015, TC-020 | Manual | ✅ Covered — this is the exact requirement `BUG-AID-5031` violated |
| REQ-705 | A commission-adjustment request always escalates, regardless of the AI's confidence explaining the figure | TC-018, TC-023 | Manual | ✅ Covered — this is the exact requirement `BUG-AID-5047` violated |
| REQ-706 | High-risk actions (refund, beneficiary approval, merchant block, settlement creation) never auto-execute | TC-042–045 | Automated | ✅ Covered |
| REQ-707 | The confirmation gate cannot be bypassed via adversarial phrasing | TC-048 | Automated | ✅ Covered |
| REQ-708 | Both confirmed and rejected high-risk proposals are audit-logged with full reasoning intact | TC-046, TC-047 | Manual | ✅ Covered |
| REQ-709 | A role cannot trigger actions or access data outside its permission scope | TC-049, TC-050 | Manual | ✅ Covered |
| REQ-710 | The "explain vs. act" confidence separation (REQ-705's fix) holds for every category where the distinction applies, not just Commission Dispute | TC-018, TC-023 (Commission Dispute only) | Manual | ⚠️ Partial — e.g., Merchant Onboarding ("why is my KYC pending" vs. "please approve my KYC now") carries the same explain-vs-act shape, with no equivalent test case |
| REQ-711 | Context isolation between concurrent conversations holds under real concurrent load, not just one-at-a-time sequential testing | TC-024, TC-025 (sequential only) | Manual | ❌ **Gap — identified when performance testing was added to this suite; see `docs/tech-and-skills.md` section 5** |

## What the Gaps Actually Caught

This is the part a checklist alone wouldn't surface, because a checklist only tells you about the
tests that already exist:

- **REQ-710** came from reading [`architecture-and-flow.md`](./docs/architecture-and-flow.md)
  section 5 as a *general principle* rather than a one-off fix: "explanation confidence" and
  "action authority" are two different questions for *any* category where a user can both ask
  "why" and ask "please fix/approve/change this" in the same conversation — Commission Dispute is
  only the category where it was actually caught. Merchant Onboarding has the identical shape
  (explaining KYC status vs. requesting KYC approval), and nothing in the current suite tests
  that the same separation holds there. Raised as a new story (illustrative ID `AID-3310`):
  generalize `TC-023`'s pattern across every category with an explain/act distinction, not just
  the one that already had a defect.
- **REQ-711** is a gap this RTM only caught because performance testing was added to this
  suite's scope at all — `TC-024`/`TC-025` prove context retention and isolation are correct for
  one conversation tested in isolation. Given this engine's whole architecture is built around
  serving six products' concurrent conversational load simultaneously (see
  [`business-overview.md`](./docs/business-overview.md) section 7's "6x blast radius" framing),
  context bleed between two unrelated, genuinely-concurrent sessions is exactly the failure mode
  a sequential-only test suite is structurally unable to catch.

**The general pattern:** an RTM's value isn't the rows that say "Covered" — those just confirm
existing test design. Its value is specifically the rows that say "Gap" or "Partial," because
those are the requirements a test-case-first workflow (write tests, forget to check them against
the original requirement list) would never have surfaced on its own.
