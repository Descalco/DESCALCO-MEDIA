# BOARD — updated 2026-10-23

Target: launch 31 Dec 2026 (cut line in `docs/revamp/plan-review-2026-10-23.md`). Nothing dispatched yet; waiting for Pedro's go on the decision below.

## Tasks
| ID | Outcome | Lane | Role | Model | Cloud | State | Depends |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T01 | Live site no longer publishes backoffice/docs/coord; 404s are real; tracked junk removed | site | dev | sonnet | yes (verify needs Pedro) | todo | — |
| T02 | Trivial code fixes: functions.js orphan block, SOF WEEK/LIMISHOP ordering | site | mechanical | haiku | yes | todo | — |
| T03 | Phase 2: sitemap, TS content schema + validator, redirect map, preserve-list | docs/rebuild | dev | sonnet | yes | todo | — |
| T04 | Typography + positioning shortlist so Pedro can decide Q4/Q7/Q8 by 26 Oct | research | research | sonnet | yes | todo | — |
| T05 | Media pass: 11 GIFs to MP4/WebM, JPG resize, OPENER.mov out | media | media | sonnet | **no** (ffmpeg, originals) | todo | T01 merged |
| T06 | Reel visible on home (replace "in the making…") | site | dev | sonnet | yes | blocked | Pedro: YouTube link (+Q3) |

## Recommended dispatch
1. T01 first (unblocks merging anything to `main`).
2. In parallel now: T02 (haiku), T03 and T04 (sonnet) — all docs/small code, no file overlap with T01 except `.gitignore` (T01 owns it).
3. T05 local after T01 is merged. T06 when Pedro sends the YouTube link.

## Ideas (nothing built without Pedro's OK)
- After launch: tabs by `relation` at 25-30 projects (D8).
- Replace Cull/ copy on the site with a case study link once Cull has one.

## Verdict log
(none yet)
