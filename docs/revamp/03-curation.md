# 03 — Curation

Phase 1 output. Source of truth for what appears where.
**Inventory verified 2026-08-08** against `backoffice/data/projects.json` (13 projects).

---

## Full inventory

Sorted by current `displayOrder`.

| # | Project | Year | Category | Type | Feat. | Case study | Tags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | SOF WEEK | 2025 | Branding | case-study | ✗ | ✓ | Motion, Branding, Military, Final Project |
| 1 | A Carne que Anda (MOTION JAM winner) | 2025 | Motion Design | simple | ✓ | — | Award Winning, Motion, 48H |
| 2 | Limifield RMA Explainer | 2025 | Motion Design | simple | ✗ | — | *(none)* |
| 3 | LIMISHOP – Promotional AD | 2025 | Motion Design | simple | ✓ | — | *(none)* |
| 4 | AMBIVALÊNCIA – City of the Future | 2023 | 2D Animation | case-study | ✓ | ✓ | 2D, Character Anim, Video Mapping |
| 5 | GUISADO – 3D Short Movie | 2025 | 3D Animation | case-study | ✓ | ✓ | 3D, Character Anim, Mocap |
| 6 | Limifield – Corporate Video | 2024 | Video Production | simple | ✗ | — | Corporate, Motion, Business |
| 7 | KINETIC DUALITY (installation) | 2022 | Motion Design | simple | ✗ | — | Motion, Kinetic Type, Installation |
| 8 | LET IT HAPPEN | 2022 | 2D Animation | case-study | ✗ | ✓ | Frame by frame, Motion, Animation |
| 9 | Type in Motion – Limifield Ad | 2023 | Motion Design | simple | ✗ | — | Kinetic Type, Business, Motion |
| 10 | DESISTIR – Conceptual Book | 2024 | Graphic Design | case-study | ✗ | ✓ | Design, Graphic Design, Book |
| 11 | QUEEN – Experimental Animation | 2022 | 2D Animation | simple | ✗ | — | Animation, Frame-by-Frame, Animate |
| 12 | Empresta o Verbo Amar | 2022 | Video Production | simple | ✗ | — | VideoClip, Producing, Storytelling |

**Distribution:** Motion Design 5 · 2D Animation 3 · Video Production 2 · Branding 1 · 3D Animation 1 · Graphic Design 1
**By year:** 2025 × 5 · 2024 × 2 · 2023 × 2 · 2022 × 4

---

## Hero set — LOCKED

**SOF WEEK · GUISADO · MOTION JAM · Cidade do Futuro**

Spans award-winning motion, 3D, 2D/installation and branding. Three of the four have real case studies behind them.

**Changes from the current `featured` flags:**

- **SOF WEEK promoted.** It is the deepest case study by a wide margin — 1,495 words versus 244–493 for the others — and the most recent serious project. It currently sits at `displayOrder: 0` while flagged `featured: false`; the two ordering signals contradict each other. This is exactly the generator/API divergence the original audit flagged.
- **LIMISHOP demoted.** A promotional ad with no tags, no case study, and a raw upload filename for its cover — the weak link in the current featured set.

## Play — DEFERRED to post-launch

**Revised 2026-08-08.** QUEEN and LET IT HAPPEN move to **Work → Personal** instead of a standalone Play section.

### Why deferred

Ordinary Folk's Play page carries **48 pieces**. That density is what makes it read as a restless studio that can't stop making things.

**Two pieces, both from 2022, reads as an abandoned experiment** — worse than not having the section at all. Under Personal they sit alongside SOF WEEK, GUISADO and MOTION JAM instead of alone in a two-item ghost town.

This also means **only one thin area at launch instead of two**, given the UX/Web pillar is also starting empty ([D7](02-decisions.md#d7--uxweb-pillar-ships-intentionally-thin)).

### Play is still a real idea

It is not cancelled, just not launched. Ordinary Folk's Play items are **loops, rig tests and snippets** — genuinely different from finished personal films. When there is a batch of that kind of material, the section earns its place.

Trigger to revisit: ~15+ short pieces exist.

`projects/let-it-happen.html` is an existing case study page with 329 words of written content. **Keep it** — the Personal entry links through to it.

---

## Taxonomy — REVISED: relationship as ordering, not as tabs

**Revised 2026-08-08.** The insight holds — group by *who the work was for*, not by discipline. **The UI expression changed.** See [D8](02-decisions.md#d8--relationship-as-the-organising-axis--as-ordering-not-tabs).

### Why tabs were dropped

Filters are a function of **scale**:

| Site | Projects | Filters? |
| --- | --- | --- |
| Richprjcts | 50+ | ✅ `All·Clients·Personal·Showreels` |
| Vucko | 20 | ❌ curated index |
| Ordinary Folk | ~10 | ❌ curated index |
| **Descalco** | **13** | **❌** |

At 13 projects, tabs are over-structure. Worse, a `Clients` tab would spotlight **Limifield ×4 — the weakest work in the portfolio** — and invite exactly the comparison a junior loses.

**Keep the `relation` field in the schema** (`client` | `personal` | `collaboration` | `reel`) so tabs can be enabled later with no migration. Tabs earn their place around 25–30 projects.

### What replaces them

**Curated order + rich card metadata.** The card carries what a tab would have communicated, and it works in every view:

> **AMBIVALÊNCIA — City of the Future** · 2023 · with **Ocubo** · *Best Public Project*

### Q5 — RESOLVED: half-half is an asset, not a problem

Both ambiguous projects were **college projects with real partners**:

| Project | Context |
| --- | --- |
| **Cidade do Futuro** | With **Ocubo** (major PT studio). Won **Best Public Project**. Unpaid, college project. |
| **Empresta o Verbo Amar** | College project, made with the artist's direct involvement. Small experiment. |

**Do not force these into Clients or Personal.** `relation: collaboration`, with the credit and award surfaced on the card.

For a junior this line does more work than any filter: real studio, real stakes, award-winning, and he was in the room. Handling a collaborator well is itself a professional signal.

**Consequence:** awards and credits must be a **visible system** in the card design, not prose buried in a description. See the [`/recognition` pattern](07-visual-language.md#two-structural-ideas-worth-taking).

### Q6 — RESOLVED: reel is annual from day one

Ship a **single reel now**, but name it `/reel/2026` immediately, with `/reel` always resolving to the newest.

- Adding `/reel/2027` next year is purely additive — no retro-rename, no dead URL
- Naming it `/showreel` now guarantees a fix in twelve months

**Reel becomes a top-level nav item**, not a filter tab with one entry. Maximum prominence for the single most important asset. When 3–4 exist, `/reel` becomes an index of years — the Richprjcts pattern, earned by then.

### Why relationship beats discipline

1. **No dead groupings.** Discipline filters would return 1 result for Branding, 1 for 3D, 1 for Graphic Design, 1 for Interactive, and **0 for UX/Web**. Half broken on arrival. Relationship groupings always have content.
2. **Contextualises the Limifield concentration** — *if* tabs are ever switched on. Four projects for one client is unremarkable inside a Clients grouping. In the curated order they are simply placed low.
3. **Handles academic work gracefully.** SOF WEEK is a final degree project; GUISADO a student short. "Personal" never forces the label "student project."
4. **Range stops reading as dispersion.** Nobody asks what discipline a personal project belongs to.

### Consequences

- **The `client-group` entry type is no longer needed.** Schema simplifies.
- **Discipline survives on the homepage, not in Work.** The capability split (Motion / 3D / UX / Web) becomes a homepage *statement*; Work is a curated index carrying `relation` as card metadata. Two different jobs, no empty grid. Software projects land under Personal when they arrive.
- **No filter UI at launch.** One `relation` field in the schema, dormant until ~25–30 projects.

### The honest caveat

Richprjcts can afford a Clients tab because their clients are Google, Apple, OpenAI and Netflix — 73 "Clients" mentions against 23 "Personal" in their markup. **Their Clients tab is the flex.** Ours would be Limifield ×4; it would expose the concentration rather than bury it. That's the main reason tabs are off at launch — and why, when they are switched on, `All` must be the default.

### Showreels as an annual artifact

Richprjcts publishes one reel per year: `/showreel-2022`, `/showreel-2023`, `/showreel2024`, `/showreel2025`. A reel isn't a single asset — it's a recurring artifact with its own page. That creates a reason to return to the site annually and a visible track record.

Resolved by Q6 above: annual, `/reel/2026`, top-level nav — no Showreels tab.

---

## RESOLVED — the Limifield concentration

Four of the thirteen projects are Limifield — RMA Explainer (2025), LIMISHOP (2025), Corporate Video (2024), Type in Motion (2023). Three of the four are undifferentiated corporate motion.

**Under discipline filters this was a real problem:** a visitor filtering to Motion Design would have seen mostly Limifield, which reads as client-thin rather than prolific.

**Under the relationship taxonomy it stops being a problem.** With no filter UI, the four Limifield pieces sit low in the curated order with `relation: client` on their cards. Nobody expects client work to be varied.

**Superseded:** the previously proposed `client-group` entry type ("Limifield — ongoing client work", collapsing four into one expandable entry) is **no longer needed**. Keep the four as individual entries with `relation: client`. The schema simplifies accordingly.

---

## Legacy discipline taxonomy — retained for reference only

The audit and handoff both proposed discipline-based filters. **Superseded by [D8](02-decisions.md#d8--relationship-as-the-organising-axis--as-ordering-not-tabs).** Recorded here because it documents *why* the axis changed:

| Proposed filter | Would have returned |
| --- | --- |
| Motion Design | 5 projects ✓ |
| 3D / Animation | 1 (GUISADO) |
| Branding | 1 (SOF WEEK) |
| **UX / Web** | **0** |
| Interactive / Installations | 1 (KINETIC DUALITY) |
| Play / Experimental | 2 |

Half the filters would have shipped returning one or zero results.

The raw categories in the data — `Branding`, `Motion Design`, `2D Animation`, `3D Animation`, `Video Production`, `Graphic Design` — remain useful as **card metadata** (displayed on each project alongside year and role), just not as the filter axis.
