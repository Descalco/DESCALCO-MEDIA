# Descalco Media

Pedro's personal motion-design portfolio (descalcomedia.pt). Today: static HTML site on Netlify + a local Node `backoffice/` + Firebase analytics. Goal: rebuild as a Next.js site by **31 Dec 2026** for an audience of motion studios hiring a junior motion designer. Branch `revamp` holds the work; `main` is the live site. Detail in `AGENTS.md` and `docs/revamp/`.

## Commands
- No build step for the live site: open `index.html`, or serve the root (`npx serve .`).
- Regenerate site data from the backoffice: `node generate-portfolio-data.js`
- Backoffice (local only): `cd backoffice && npm start`
- The Next.js rebuild does not exist yet (`portfolio/` is a stub). Its commands go here once it does.

## Where to look
- Plan and decisions: `docs/revamp/README.md` (read order), `06-roadmap.md`, latest `plan-review-*.md`
- Current work queue and rules: `.coord/BOARD.md`, `.coord/RULES.md`, owner questions `.coord/OWNER-DECISIONS.md`
- Site code: `index.html`, `mystory.html`, `other-projects.html`, `projects/*.html`, `assets/js/`, `assets/css`
- Project data: `backoffice/data/projects.json` is raw; consume the generated `assets/js/portfolio-data.js`
- Redirects/deploy: `_redirects`
- Separate project (do not edit from here): `a34696_pedro_costa_p1` = repo `Descalco/Cull`

## Hard rules
1. **Docs, `.coord/`, `CLAUDE.md`, `AGENTS.md` must never reach `main`** until the Netlify publish directory is fixed (T01); the live site serves the repo root. Work on `revamp` or task branches off it.
2. No secrets in git: no `.env`, service-account JSON, private keys. (The Firebase web `apiKey` is public by design.)
3. No media in git over 5 MB. The showreel lives on YouTube, not in the repo. Never touch `PF_02_MakingOf_*.mp4`.
4. Do not edit `backoffice/` behaviour or the live pages beyond what the brief says. Backoffice stays isolated (D2).
5. Never `push --force`, rewrite history, delete branches, or merge into `main`. Only Pedro merges to `main`.
6. Settled decisions D1–D9 (`docs/revamp/02-decisions.md`) are not reopened by workers.
7. No employer work (AlbumTeller, LabsForge) shown on the site.
8. If code and docs disagree, the code wins; fix the doc in the same change.

## Working rules
- Verify before saying done (commands in the brief). Anything needing a deploy preview, a real device or Pedro's taste is "unverified": say so and what is needed.
- Read only the lines you need: Grep, then Read with offset/limit. Large/binary: see `.claude/settings.json` deny list.
- Update the one doc that owns the change; do not create new docs.
- Commits: conventional (`fix:`, `docs:`, `chore:`, `feat:`), small, one logical change.
- Stop and ask if: a task needs a `main` merge, a schema/content-model change not in the brief, or a decision marked "needs Pedro".
- Reply to Pedro in PT-PT; end every reply to him with a short "Em palavras simples" section.
