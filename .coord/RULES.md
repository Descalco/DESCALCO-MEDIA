# RULES — Descalco Media coordination

Read once at start. Coord dir = `.coord/` (committed).

## Lanes
| Lane | Scope | Limit |
| --- | --- | --- |
| `site` | root HTML, `projects/`, `assets/js`, `_redirects`, `netlify.toml` | one task at a time touching the same file |
| `media` | `assets/img`, `assets/video` conversions | local only, one at a time |
| `rebuild` | `portfolio/` (Next.js), schema, tokens | after Phase 2 schema task is merged |
| `docs` | `docs/revamp/`, `.coord/` | parallel OK |
| `research` | writes only under `docs/revamp/` | parallel OK |

## Risk zones (coordinator reads these hunks)
- `_redirects`, `netlify.toml`, `.gitignore` (public exposure)
- `backoffice/**` (isolated; changes need Pedro)
- `assets/js/portfolio-data.js`, `backoffice/data/projects.json` (content source)
- Anything that deletes tracked files (`git rm`)
- Forms/analytics: Netlify Forms in `index.html`, `firebase-portfolio-analytics.js`

## Verify commands
- Static site sanity: `node --check assets/js/functions.js` (syntax) and open the page locally (`npx serve .`), console must show no errors.
- Data: `node generate-portfolio-data.js` must run without error and not change `projects.json`.
- Links/redirects: `grep` the touched files for removed paths; every old URL in `_redirects` still resolves.
- Size guard: `git diff --stat` shows no added binary over 5 MB.
- Secrets guard: `git diff | grep -iE "private_key|secret|password|\.env"` returns nothing.
- Netlify behaviour (publish dir, redirects, 404) can only be verified on a preview deploy: report "unverified" with what is needed.

## Branches and commits
- Worker branch `task/<ID>-<slug>` off `revamp`; small conventional commits; end with the attribution line from the session.
- Worker never merges, never pushes to `main`/`revamp`, never force-pushes. Cloud worker pushes its own branch only.
- Coordinator merges accepted branches into `revamp` (no fast-forward needed) and pushes `revamp`.
- `main` is Pedro's call, after T01 is verified on a preview deploy.

## Model tiers
`opus` coordinator and genuinely open design; `sonnet` default; `haiku` mechanical. Name the model in every brief.

## Stop rules (workers)
Same fix failed twice; more files than the brief allows; a risk zone must change beyond the brief; a decision marked "needs Pedro" is hit. Report `partial`/`blocked`.

## Owner questions
Go to `OWNER-DECISIONS.md`, never into a task. Taste decisions (type, positioning, motion) are Pedro's.

## Never
Touch `a34696_pedro_costa_p1`, extract/delete the parent-folder archives (`*.zip`, `*.rar`, `invoice.pdf`), commit `PF_02_MakingOf_*.mp4`, add the reel video to git, show employer work.
