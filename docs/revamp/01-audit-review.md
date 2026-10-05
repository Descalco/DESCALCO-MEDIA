# 01 — Audit Review

Verification of [`REVAMP_AUDIT_AND_PLAN.md`](archive/2026-04-original-audit-pt.md) against the actual codebase.
**Verified 2026-08-08.** Re-check before relying on line numbers.

The audit is a good strategic document. Its diagnosis and direction hold. But it was written in April 2026, several of its factual claims do not survive checking, and it is not an executable plan — Phases 1–3 are one-line bullets and Phase 4 says "implementar nova homepage" and stops.

---

## Claims that are WRONG

### The two headline "performance crises" are dead files

The audit leads its performance section with two enormous files. Neither is served to anyone.

| File | Size | Reality |
| --- | --- | --- |
| `assets/img/OUTROS/PF_02_MakingOf_*.mp4` | 164 MB | **Gitignored** (`.gitignore:1`) *and* referenced in zero HTML/JS/JSON files. Has never shipped. Local disk only. |
| `assets/video/OPENER.mov` | 40 MB | Tracked in git but referenced nowhere. `index.html:26` loads `OPENER.webm` (1.7 MB); `functions.js:340` fetches `OPENER.mp4` (380 KB). Bloats the deploy, not the user's download. |

Together that's 204 MB of the audit's argument that never reaches a browser.

### `#videoLoading` is not commented out

The audit states the opener depends on `#videoLoading` but "o elemento está comentado em `index.html`". It is not — it is live at `index.html:30`.

---

## Claims that are CONFIRMED — and worse than described

### The homepage throws a ReferenceError on every load

`assets/js/functions.js` is 438 lines. The `DOMContentLoaded` callback that defines `logoVideo` closes at **line 419**. Lines **421–438** then reference `logoVideo` and `playOverlay` *outside* that scope. `playOverlay` is never defined anywhere in the codebase.

This is the last thing in the file, so it fails on every single homepage load.

### The showreel is gated off

`functions.js:286` — `const showreelInTheMaking = true;`

---

## Problems the audit MISSED

### 1. Images are the real weight, not video

| Type | Count | Total | Average |
| --- | --- | --- | --- |
| Video | 26 | 310 MB | — |
| **JPG** | **69** | **109 MB** | **1.6 MB each** |
| **GIF** | **11** | **38 MB** | **3.5 MB each** |
| PNG | 36 | 11.6 MB | — |
| SVG | 39 | 0.6 MB | — |

The **GUISADO case study alone loads ~34 MB of animated GIF** — `modohistoria` 4.3 MB, `blendshapes` 4.0 MB, `animfacial` 3.6 MB, `cenario` 3.5 MB, `limpeza` 3.2 MB, `captura` 3.1 MB, `poses` 2.6 MB, `GUISADO-MODELING1` 2.0 MB, `lareira` 1.8 MB, plus `guisado-titulo-gif.gif` at 8.2 MB.

GIF→MP4/WebM is a 90–95% reduction at *better* quality. This is the highest-leverage fix available and it costs nothing but encoding time.

The JPGs are print-resolution files served to browsers: `CARTAZ-FINAL-100.jpg` is 9.8 MB, and the DESISTIR case study has six images over 3 MB each.

### 2. `_redirects` makes every 404 return 200

The file ends with:

```
/* /index.html 200
```

An SPA fallback on a multi-page static site. Every mistyped or dead URL serves the homepage with HTTP 200 instead of a 404. This poisons SEO and will silently mask broken links during migration.

### 3. Two records in `projects.json` are malformed

`backoffice/data/projects.json` holds 13 projects. The two created through the backoffice UI (Limifield RMA, LIMISHOP) differ structurally from the hardcoded ones:

- `status` and `source` are `undefined`
- `tags` is empty
- LIMISHOP's `coverMedia` is a **nested object** (`{type, filename, path}`) rather than a string

`generate-portfolio-data.js:63-113` normalises both shapes. **Consequence: the Next.js build must consume the generated artifact, never the raw JSON.** A typed schema pointed at `projects.json` breaks on record two.

### 4. `.git` is 355 MB

Moving media out of the working tree will **not** shrink this — history retains every version. Reclaiming it requires a `git filter-repo` rewrite, which invalidates every existing clone.

**Recommendation: do not rewrite.** Stop the bleeding by keeping new media out of git (see [04](04-media-architecture.md)) and revisit only if repo size actually causes pain.

### 5. `portfolio/` is an empty stub

The untracked `portfolio/` directory contains only `.codex/config.toml`. A rebuild was scaffolded in intent; zero files were written.

---

## Corrected priority order

The audit's Phase 6 treats media as final polish. Given the numbers above, the actual highest-value-per-hour order is:

1. **Convert the GIFs** — ~38 MB → ~3 MB, free, immediate
2. **Resize and re-encode the JPGs** — ~109 MB → <10 MB
3. **Delete the two dead video files** — 204 MB off local disk and the deploy
4. **Fix `functions.js:421-438`** — removes a JS error from every page load
5. **Fix the `_redirects` SPA fallback** — restores real 404s

Items 1–5 are independent of the rebuild and improve the live site immediately.

---

## Re-verification — 2026-10-05

No commits since 2026-01-28, so every finding above still stands. Re-checked: the `functions.js:421-438` `ReferenceError`, `showreelInTheMaking = true` at `functions.js:286`, the `/* /index.html 200` catch-all, SOF WEEK `displayOrder: 0` + `featured: false`, both dead video files present.

### Correction — the JPG weight is partly not the site

Of the 109 MB of JPG, **38 MB is `Cull/imgs-placeholders`** — placeholder photos for the Cull/AlbumTeller prototype, not portfolio media. The real site JPG weight is ~71 MB, and **DESISTIR alone is 49 MB** of it. Same fix, narrower target.

### New — the whole repo is publicly served

There is no `netlify.toml`, and the live domain serves the repository root. Verified with HTTP requests against `descalcomedia.pt`:

| Path | Status |
| --- | --- |
| `/backoffice/server.js` | 200 — full backoffice source |
| `/backoffice/data/projects.json` | 200 |
| `/backoffice/data/analytics.json` | 200 — 132 KB (all IPs are `::1`, so no visitor data leaks) |
| `/backoffice/admin/login.html` | 200 |
| `/README.md` | 200 |
| `/this-page-does-not-exist` | 200 — the catch-all |

**Not a credentials leak** — `ADMIN_PASSWORD` and `SESSION_SECRET` come from `backoffice/.env`, which is ignored and not deployed. But it is sloppy, and it means **anything merged to `main` goes public**, including `docs/revamp/` with its candid notes on client work. Fix the publish directory before merging docs.

### New — gitignored files that are tracked anyway

`backoffice/node_modules/` (1,274 files) and `backoffice/data/analytics.json` are listed in `.gitignore` but were committed before the rule. Fix with `git rm -r --cached`.

### New — `Cull/` is a duplicate

`Cull/` inside this repo is a copy of the standalone `a34696_pedro_costa_p1` repository (the AlbumTeller culling prototype). It ships to the public site at `/Cull/`. Decide whether it belongs here at all; if it becomes a case study, link the real thing rather than vendoring a copy.
