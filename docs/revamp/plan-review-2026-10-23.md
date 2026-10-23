# Plan review — 2026-10-23

Counter-analysis of the revamp plan ([06 — Roadmap](06-roadmap.md), last updated 2026-10-05) against the repo, the git history and Pedro's current context. The roadmap is **not** rewritten; changes are proposed here. Open owner decisions are in `.coord/OWNER-DECISIONS.md`.

**Verdict: needs adjustments.** The strategy (brief, decisions D1–D9, curation) is still valid. The *schedule* is already behind and the *capacity assumption* is untested.

## Evidence base
- Git: last code commit 2026-01-28 (`d456085`); only two docs commits since (`ac69f53`, `5faed33`, 2026-10-05). No commit after the roadmap's week 1 (6–12 Oct), so none of the "quick wins" were shipped.
- Repo re-check on 2026-10-23 (below).
- Context: memories `revamp-brief` (audience, 31 Dec launch), `descalco-revamp-decisions` (Next.js, English-only, no re-litigation), the `assistente` and `notion-second-brain` skills (thesis due 27/09/2027, full-time job, NAU Collective, other tools: Money Trail, AE Agent, Arkive).

## What is still valid
| Item | Evidence |
| --- | --- |
| Brief: audience = motion studios; identity = Pedro as Descalco; "site is a work sample" (D9) | `00-brief.md`, memory `revamp-brief`; nothing contradicts it |
| D1–D9 (Next.js, isolated backoffice, English only, €0 media, hero set, relation as ordering) | Locked; do not reopen |
| Quick wins 0, 1, 2, 4, 5, 6, 7, 8 | All still present: no `netlify.toml`; `_redirects` ends `/* /index.html 200`; 11 tracked GIFs; `assets/js/functions.js:421-438` still outside the `DOMContentLoaded` that closes at line 419 (`logoVideo`/`playOverlay` undefined); 1274 tracked files under `backoffice/node_modules`; `backoffice/data/analytics.json` tracked; `index.html:109` still says "in the making..." |
| Phase 2 outputs (sitemap, schema, redirect map) | Nothing started; still the right next phase |

## What is outdated or wrong
1. **Schedule.** Week 1 (quick wins) did not happen; today (23 Oct) is the end of week 3, with Phase 2 not started. Remaining: ~69 days to 31 Dec for Phases 2–6, which the roadmap sized at ~11 weeks. Realistic slip: 2–3 weeks.
2. **Quick win 3 is mostly moot.** `PF_02_MakingOf_*.mp4` (164 MB) is gitignored (`.gitignore:1`), so it is not in the repo or the deploy. Only `assets/video/OPENER.mov` (40 MB, tracked, unreferenced) is a real removal.
3. **Q4 deadline is 3 days away** (typography, "needed by 2026-10-26") and nothing prepares the decision. Q3, Q7, Q8 are also still open.
4. **The "do not merge docs to main" rule now covers more files.** The method files added on 2026-10-23 (`CLAUDE.md`, `AGENTS.md`, `.coord/`, `.claude/`) sit in the repo root, which Netlify serves publicly. They are safe on `revamp`, but only if branch deploys of `revamp` are off or the publish directory is fixed. **Quick win 0 is therefore the first task, not one of eight.**
5. **Branch exposure.** `revamp` was pushed to GitHub for the first time on 2026-10-23 (it had no remote before). If Netlify "deploy all branches" is on, `docs/` is already public on a branch URL. Needs a check by Pedro.

## What is missing from the plan
- **Employer work leak.** The brief says employer work is not shown, but `Cull/scripts/culling.js` (served at `descalcomedia.pt/Cull/…`) mentions AlbumTeller. Decide: remove `Cull/` from the public root (also 38 MB of placeholders, per quick win 2).
- **Things to preserve in the rebuild**: Netlify Forms contact flow and `/success` redirect (commit `b6dab55`), Firebase analytics (`firebase-portfolio-analytics.js`; its web `apiKey` is public by design, not a secret), `_redirects` 301s. Add them to the Phase 2 redirect/inventory step.
- **Capacity and cut line.** The roadmap says "next to a full-time job and a Master's" but sets no hours per week and no cut line. Competing demands in the same period: thesis (due 27/09/2027), NAU Collective, other tools. The plan has a date and a full scope but no stated flex.
- **Interim state of the live site.** Until the rebuild lands the live site is the portfolio. Quick wins 0/1/2/4/5/7 are the cheapest way to make it presentable (reel visible, light, no leaks) and are insurance if the rebuild slips.
- **Coordination method.** Not in the roadmap before; added on 2026-10-23 (`CLAUDE.md`, `.coord/`).

## Risks (ranked)
1. **Momentum** — repeated pattern (planning Apr–Oct, zero code). Mitigation: ship small, visible wins first, in the order below.
2. **Scope vs. time** — Phases 3–4 (type, tokens, 4 layouts, motion system, migrate 13 entries, reel page) in ~5 weeks, part-time.
3. **Public exposure** of docs, backoffice code, analytics data (see 4 and 5 above).
4. **Taste decisions blocking build** (Q4, Q7, Q8): only Pedro can make them; each day undecided blocks Phase 3.

## Proposed changes to the roadmap (for Pedro to accept)
1. **Make scope the flex, not the date.** Keep 31 Dec as the target; add a cut line: *launch minimum* = home + `/reel/2026` + 4 hero case studies + `/about` + `/contact` with real content; the 9 simple entries and extra motion polish go after launch if time runs out.
2. **Fallback launch** 31 Jan 2027 if week 7 (end of Nov) is not at "Next.js shell with tokens on a preview URL".
3. **Reorder immediate work** (this week): quick win 0 first (unblocks everything), then 4/5/6/8 (trivial), then 1/2 (media), then 7 (needs reel link), in parallel with Phase 2 and the typography shortlist.
4. **Decide Q4 by 26 Oct** from a shortlist (task T06), and Q8 (recommended: yes) at the same time.
5. **Add a "Preserve" list to Phase 2**: forms, analytics, redirects, Cull/ removal.
6. **Record weekly capacity** (hours) in `.coord/OWNER-DECISIONS.md` and re-plan the schedule from it.

## Not changed
Framework, language, hero set, taxonomy, media budget, backoffice isolation, visual references.
