# Descalco Media — Revamp Documentation

Working documentation for the portfolio rebuild. Start here.

**Status:** Brief and Phase 1 **closed**. Audience: motion studios hiring · identity: Pedro, as Descalco · **launch by 31 Dec 2026** ([00](00-brief.md), [schedule](06-roadmap.md#schedule--launch-by-31-dec-2026)). Phase 2 ready. No rebuild code written yet.
**Last updated:** 2026-10-05

> ⚠️ **Do not merge `docs/` to `main` until the Netlify publish directory is fixed.** The live site serves the repo root, so these files would become public at `descalcomedia.pt/docs/…`. See [01 — re-verification](01-audit-review.md#re-verification--2026-10-05).

---

## Read in this order

| # | Document | What it covers |
| --- | --- | --- |
| 00 | [Brief](00-brief.md) | **What the revamp is for** — audience, primary action, identity, success definition, launch scope. Read first. |
| 01 | [Audit review](01-audit-review.md) | Verification of the original audit against the codebase. **Read before trusting the original audit** — several of its headline claims are wrong. |
| 02 | [Decisions](02-decisions.md) | Locked decisions: framework, CMS, language, hosting. With the reasoning and the rejected alternatives. |
| 03 | [Curation](03-curation.md) | The 13-project inventory, hero set, Work/Play split, and open curation problems. |
| 04 | [Media architecture](04-media-architecture.md) | Zero-budget video and image strategy. Encoding targets, hosting, the YouTube facade pattern. |
| 05 | [References](05-references.md) | Teardowns of reference sites, what they're actually built with, and specific techniques worth copying. |
| 06 | [Roadmap](06-roadmap.md) | Phase status, open questions, and what blocks what. |
| 07 | [Visual language](07-visual-language.md) | **How the references look and feel** — motion tokens, type system, colour, page systems. Phase 3 input. |

## Source documents

- Open questions live in **one place only**: [06 — Open questions](06-roadmap.md#open-questions).
- [`archive/2026-04-original-audit-pt.md`](archive/2026-04-original-audit-pt.md) — the original audit (April 2026, Portuguese). Still the best statement of *intent*; its factual claims are superseded by [01](01-audit-review.md).
- A later handoff document (not committed) established the Next.js decision. Its content is folded into [02](02-decisions.md).

## The one-line version

The content is close to a premium portfolio; the interface and architecture are not. The rebuild is a repositioning and an editorial reorganisation that happens to require new code — not a technical project that happens to change the design.

## Caution

Everything in [01](01-audit-review.md) marked *verified* was checked against the repo on 2026-08-08 and re-checked on 2026-10-05. Code changes; re-verify before relying on file/line citations.
