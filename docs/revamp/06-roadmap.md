# 06 — Roadmap & Status

**Updated 2026-10-05.**

---

## Phase status

| Phase | Status | Notes |
| --- | --- | --- |
| **0 — Brief** | 🟡 **Reopened 2026-10-05** | Audience, goal and identity were never stated. See [00 — Brief](00-brief.md). |
| **1 — Strategy & curation** | 🟢 **Closed** (pending the brief) | Taxonomy settled by [D8](02-decisions.md#d8--relationship-as-the-organising-axis--as-ordering-not-tabs). The hero set and D9 may shift depending on the brief. |
| **2 — IA & content model** | ⚪ **Ready to start** | Schema and sitemap mostly don't depend on the brief; the homepage and About copy do |
| **3 — Visual & motion system** | ⚪ Not started | Needs typography decision |
| **4 — Front-end rebuild** | ⚪ Not started | `portfolio/` is an empty stub |
| **5 — Data & CMS** | 🟢 **Mostly decided** | [D2](02-decisions.md#d2--backoffice-stays-isolated) settles the architecture |
| **6 — Performance & polish** | 🔴 **Partly reprioritised** | Media work moved earlier — see below |

---

## Open questions

| # | Question | Blocks | Status |
| --- | --- | --- | --- |
| ~~Q1~~ | ~~Collapse the 4 Limifield projects into one client-group entry?~~ | — | ✅ Resolved by [D8](02-decisions.md#d8--relationship-as-the-organising-axis--as-ordering-not-tabs) |
| ~~Q2~~ | ~~Does Play launch with 2 pieces, or wait for a batch?~~ | — | ✅ Resolved by [D6](02-decisions.md#d6--play-deferred-to-post-launch) |
| **Q3** | Cut a 6–10s silent hero loop + poster frame from the reel? | Homepage hero design | 🟡 Open |
| **Q4** | Typography — which display face, and is there any budget for a licence? | Phase 3 | 🟡 Open |
| ~~Q5~~ | ~~Cidade do Futuro / Empresta o Verbo Amar — commissioned or personal?~~ | — | ✅ Both `relation: collaboration` |
| ~~Q6~~ | ~~Showreel annual or single?~~ | — | ✅ Annual — `/reel/2026`, Reel as top-level nav |

**Only Q3 and Q4 remain, and neither blocks Phase 2.** Q3 needs one export from the reel; Q4 is a Phase 3 decision.

---

## Reprioritised: quick wins on the live site

These are **independent of the rebuild**, improve the public site immediately, and several remove genuine defects. The original audit deferred all of this to Phase 6; the measurements in [01](01-audit-review.md) argue for doing it now.

| # | Task | Impact | Effort |
| --- | --- | --- | --- |
| 0 | **Stop publishing the repo root.** Add a `netlify.toml` / publish dir so `backoffice/`, `Cull/`, `docs/`, `README.md` are not served | `descalcomedia.pt/backoffice/server.js`, `/backoffice/data/analytics.json` and `/README.md` are public today (verified 2026-10-05). **Must happen before `docs/` reaches `main`** — the docs contain candid assessments of client work | Low |
| 1 | Convert 11 GIFs → muted MP4/WebM | **38 MB → ~3 MB**, better quality | Low |
| 2 | Resize + re-encode the site JPGs (DESISTIR 49 MB, SOF 16 MB) | **~71 MB → <10 MB** (the other 38 MB are `Cull/` placeholders) | Low |
| 3 | Delete `PF_02_MakingOf_*.mp4` (164 MB) and `OPENER.mov` (40 MB) | 204 MB off disk/deploy | Trivial |
| 4 | Remove orphaned block at `functions.js:421-438` | Removes a `ReferenceError` from every homepage load | Trivial |
| 5 | Fix `/* /index.html 200` in `_redirects` | Restores real 404s; stops masking broken links | Trivial |
| 6 | Reconcile `featured` vs `displayOrder` for SOF WEEK; demote LIMISHOP | Fixes contradictory ordering signals; matches D5 | Trivial |
| 7 | Replace "in the making…" with the YouTube reel | The single most important asset is currently invisible | Low |
| 8 | `git rm --cached` `backoffice/node_modules` (1,274 files) and `backoffice/data/analytics.json` | Both are gitignored but were committed before the rule | Trivial |

Items 3–6 and 8 are near-zero-risk. Item 0 is the precondition for merging this documentation. Items 1 and 7 are the highest-leverage changes available on the site today.

---

## Phase 2 — what it must produce

1. **Sitemap** — `/`, `/work`, `/work/{slug}`, `/about`, `/contact` (no `/play` at launch — see [D6](02-decisions.md#d6--play-deferred-to-post-launch))
2. **Content schema**, including:
   - entry types: `case-study`, `simple`, `external`, `showreel`
   - **`relation` field: `client` | `personal` | `collaboration` | `reel`** — card metadata and curated ordering; **no filter UI at launch** ([D8](02-decisions.md#d8--relationship-as-the-organising-axis--as-ordering-not-tabs))
   - credits and awards as structured fields (`credits[]`, `awards[]`), not prose — they render on cards and feed `/recognition`
   - media references: `coverLoopMp4`, `coverLoopWebm`, `posterWebp`, `youtubeId`
   - discipline retained as **card metadata**, not a filter axis
3. **Redirect map** — old URLs → new. `_redirects` already carries 301s from a previous restructure; the rebuild changes URLs again and must not break them.
4. **Decision:** do case studies stay hand-authored HTML, or become structured content? Five exist today with real writing in them.

---

## Known risks

| Risk | Mitigation |
| --- | --- |
| ~~Two visibly empty sections at launch~~ | ✅ Mitigated. Play deferred ([D6](02-decisions.md#d6--play-deferred-to-post-launch)); UX/Web becomes a homepage capability statement rather than an empty grid ([D8](02-decisions.md#d8--relationship-as-the-organising-axis--as-ordering-not-tabs)). |
| ~~Showreels tab with a single item~~ | ✅ Resolved by Q6 — no tab; `/reel/2026` as top-level nav. |
| **Momentum** | No commits since 2026-01-28; planning ran April → August with zero code. Ship the quick wins first so the live site improves while the rebuild is built. |
| ~~Over-engineering — effort into machinery instead of editorial quality~~ | ⚠️ **Reframed by [D9](02-decisions.md#d9--the-site-is-a-work-sample).** The Squarespace observation does not transfer: a studio with a Google/Netflix client list can afford a plain site; a junior cannot. Interface craft *is* the evidence here. The real risk is **incoherent** craft, not too much of it — mitigated by [motion tokens](07-visual-language.md#motion-as-a-system--the-vucko-pattern). |
| **Next.js payload discipline** | Strict lazy-loading; clean up GSAP instances on unmount or they leak ([D1](02-decisions.md#d1--framework-nextjs-app-router)). |
| **Showreel is the long pole** | Reel exists and is on YouTube. Only the hero loop export remains (Q3). |
| **Repo already 355 MB in history** | Accepted. Not rewriting. Keep new media out of git. |

---

## What "done" means

The audit never defined success. Proposed definition, **still unconfirmed** — it depends on the audience question in [00 — Brief](00-brief.md):

> A visitor who has never heard of Descalco Media understands within 10 seconds that this is a motion designer with a signature and range, and can reach the strongest three pieces of work in two clicks.

Everything else is in service of that.
