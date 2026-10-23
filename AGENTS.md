# Descalco Media — Agent Guide

Operating contract for AI agents (Claude, Codex, cloud sessions) working in this repo. `CLAUDE.md` has commands and hard rules (always loaded); this file has the method and the map.

## Workspace boundary
You are in **Descalco Media** — `D:\PORTFOLIO\FREELANCE\DESCALCO-MEDIA\DESCALCO-MEDIA\DESCALCO-MEDIA`, remote `Descalco/DESCALCO-MEDIA`, working branch `revamp`. Stay inside this folder.
- `..\a34696_pedro_costa_p1` is a **different repo** (`Descalco/Cull`, branch `main`). Never edit, commit or copy into/out of it from here. The in-repo `Cull/` folder is an old copy served on the live site; see task T01 about removing it.
- Money Trail, Arkive, AE Agent and others are unrelated projects. Never touch them.

## Mission
Ship the portfolio rebuild by 31 Dec 2026 (scope flexes, date does not; see `docs/revamp/plan-review-2026-10-23.md` for the cut line). Judge every call against: *would a creative director at a motion studio want to hire him?*

## Method (coordinator + workers)
- **Pedro talks to the coordinator only.** Coordinator = a session running the global `/coordinate` skill. It plans, briefs, reviews, integrates; it does not implement.
- **Worker** = a fresh session or subagent running `/worker <ID>` on one brief. One task, one branch, one report.
- **Roles** (set per task in the board's *Role* column):
  | Role | Does | Model |
  | --- | --- | --- |
  | `coordinator` | slice, brief, review, integrate | opus |
  | `dev` | site/backoffice code, data, redirects, schema | sonnet |
  | `media` | ffmpeg/image passes (local only, big files) | sonnet / haiku |
  | `research` | proposals, shortlists, teardown notes; writes docs only | sonnet |
  | `design` | visual decisions: always needs Pedro's eyes | peer session with Pedro |
  | `mechanical` | renames, header fixes, searches | haiku |
- **State** lives in `.coord/` and is committed (unlike Money Trail's, so cloud sessions can read it). Read `.coord/BOARD.md` first and `.coord/RULES.md` once.
  - `BOARD.md` — task table + ideas. The board is the coordinator's memory.
  - `RULES.md` — lanes, risk zones, verify commands, branch rules.
  - `OWNER-DECISIONS.md` — questions only Pedro can answer.
  - `briefs/<ID>.md` and `reports/<ID>.md` — one each per task; templates in `templates/`.
- The global skills default to `.claude/coord/`; in this repo the directory is **`.coord/`**. Dispatch prompts must say so: `Follow the /worker protocol for task <ID>. Coord dir: <repo>/.coord/`.
- **Token economy**: pointers not pastes; coordinator reads reports and `git diff --stat`, not source; one task per context; max 2 revision rounds; no polling; batch independent dispatches.
- **Review**: report → diff stat → risky hunks only (risk zones in RULES.md) → verify → accept / revise (≤5 bullets) / reject.
- **Branches**: `task/<ID>-<slug>` off `revamp`. Workers commit to their branch and never merge. The coordinator merges accepted branches into `revamp` locally and pushes `revamp`. Only Pedro merges to `main`.
- **Cloud vs local**: a task may run in cloud when it needs only repo text and standard tools (no ffmpeg on large originals, no local backoffice data, no taste judgment). Each brief says `cloud: yes|no`. Cloud workers start from pushed `revamp`.
- **Lessons**: when a lesson appears in 2+ reports, promote it into `RULES.md` or this file.

## Repo map
| Path | What |
| --- | --- |
| `index.html`, `mystory.html`, `other-projects.html` | live pages |
| `projects/*.html` | 5 hand-authored case studies (guisado, sof-week, desistir, let-it-happen, cidade-do-futuro) |
| `assets/js/`, `assets/img/`, `assets/video/` | scripts and media (`functions.js` has the orphan block at 421-438) |
| `backoffice/` | local Node/express CMS; output consumed via `generate-portfolio-data.js` |
| `firebase-portfolio-analytics.js`, `analytics-integration.js` | analytics |
| `_redirects` | Netlify redirects (has the SPA fallback to fix) |
| `Cull/` | old copy of the Cull web app, publicly served |
| `portfolio/` | stub for the Next.js rebuild |
| `docs/revamp/` | brief, decisions, curation, media, references, roadmap, visual language, plan review |
| `.coord/` | coordinator state |

## Source of truth by concern
- Why and for whom: `docs/revamp/00-brief.md`
- Settled decisions: `docs/revamp/02-decisions.md` (D1–D9)
- What to build and when: `docs/revamp/06-roadmap.md` + `plan-review-*.md` (latest wins where they differ)
- Project inventory and hero set: `docs/revamp/03-curation.md`
- Media targets: `docs/revamp/04-media-architecture.md`
- Look and motion: `docs/revamp/05-references.md`, `07-visual-language.md`

## Documentation policy
Docs are part of the change. When a task changes behaviour or closes a roadmap item, update the owning doc and the board in the same commit. Keep the roadmap's quick-win table current by ticking items in the plan review, not by rewriting history.

## Standing review rituals
- Before "done": run the brief's verify commands; list anything unverified.
- Any visual change: look at the touched page at desktop and mobile width (max 2 screenshots), and check reduced motion.
