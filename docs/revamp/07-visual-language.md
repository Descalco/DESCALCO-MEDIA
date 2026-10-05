# 07 — Visual Language & Page System

Phase 3 input. **How the reference sites look, feel and organise themselves** — extracted from production CSS on 2026-08-08, not from screenshots.

The stack teardowns live in [05](05-references.md). This document is about the visual and structural craft, which is what actually matters here.

---

## The positioning that drives everything

> Make people really see what I am about **even as a junior**.

This is the goal the original audit never stated, and it changes what "good" means:

1. **Depth beats breadth.** Case studies that show process prove thinking, not just output. A junior's strongest evidence is *how* they work.
2. **Credits and awards must be structural, not incidental.** Ocubo, Best Public Project, MOTION JAM winner — these are the credibility signals, and they belong in the card system.
3. **The site is itself a work sample.** An established studio can run on Squarespace because the client list carries it. A junior has no such cover — if the interface moves well, *that is evidence of motion craft*. The craft is part of the argument, not a distraction from it.

**Caveat that still applies:** craft means a coherent *system*, not accumulated effects. See the motion tokens below.

---

## Motion as a system — the Vucko pattern

The most valuable single finding. From `vucko.co`'s production CSS:

```css
--duration: 1.25s;
--delay:    0.075s;
--clip:     50%;
```

**Motion timing as design tokens.** Two or three durations and one delay increment, defined once, consumed by everything on the site.

This is the concrete answer to the audit's demand that motion stop being "efeito" and become "sistema". It is nearly free to implement and it is the single biggest difference between a site that reads as *composed* and one that reads as *accumulated* — which is precisely the diagnosis in [01](01-audit-review.md).

**Proposed starting set:**

| Token | Use |
| --- | --- |
| `--dur-fast` | hovers, filter states, small UI feedback |
| `--dur-base` | card reveals, section entrances |
| `--dur-slow` | hero moments, page transitions |
| `--delay-step` | stagger increment for lists and grids |
| `--ease-out` / `--ease-inout` | one or two curves, never more |

**Rule: no animation on the site may use a hardcoded duration.** If a moment needs a value outside the set, that's a signal the set is wrong — change the token, not the instance.

---

## Typography — the Burocratik pattern

From `burocratik.com`:

```css
--letter-spacing: -0.04em;
--letter-spacing: -0.05em;
--letter-spacing: -0.07em;
--asset-size: clamp(160px, 106.414px + 100vw, …);
--aspect-ratio: 1.8863636364;
```

**Three tiers of negative tracking.** Display type tightens as it grows. This one detail separates "designed" from "browser default" more reliably than typeface choice does.

**Fluid sizing via `clamp()`.** Type and assets scale continuously with the viewport rather than jumping at breakpoints. Also directly fixes the audit's complaint that mobile is treated as a restriction rather than an experience.

**Aspect ratios as precise tokens** — layout stability, no reflow on media load.

`vucko.co` uses **Suisse International**, a paid Swiss neo-grotesque. Relevant to open question **Q4** (typography budget).

---

## Colour — restraint

| Site | Palette |
| --- | --- |
| **Ordinary Folk** | `#161616` + `#B7B5A9`. **Two colours. That is the entire palette.** |
| **Burocratik** | `#0d0d0d` near-black, `#dc3429` red, `#105df1` blue accent |
| **Vucko** | `--dark: #000` / `--light: #fff` as swappable theme tokens |

**Nobody uses pure `#000` or `#fff` as their ground.** Near-black and off-white throughout.

Burocratik's dark-plus-red is essentially the identity the audit says already exists here ("a base escura, o peso do vermelho"). **That instinct was right — it needs refinement, not replacement.** See ["what I would preserve"](archive/2026-04-original-audit-pt.md).

---

## Page systems

| Site | Nav | Projects |
| --- | --- | --- |
| **Vucko** | `/projects` `/approach` `/about` `/contact` | `/project/{slug}` — 20 projects, **no filters** |
| **Ordinary Folk** | `/work` `/play` `/process` `/about` `/contact` | `/project/{slug}` — ~10, **no filters** |
| **Burocratik** | `/work` `/branding` `/naming` `/studios` **`/recognition`** `/lets-talk` | `/work/{slug}` |
| **Richprjcts** | grid + `All·Clients·Personal·Showreels` | 50+, **filtered** |
| **ManvsMachine** | `Work` `Info` | 36 KB of HTML total |

### Two structural ideas worth taking

**1. `/recognition` — a dedicated awards page.** Burocratik treats recognition as a first-class page, not a footer line. For a junior with a MOTION JAM win and a Best Public Project, **this is the highest-value structural idea available.**

**2. Capability pages that exist independently of project count.** Burocratik's `/branding` and `/naming` are real pages selling a capability, not filters over a project list. **This solves the empty UX/Web pillar** ([D7](02-decisions.md#d7--uxweb-pillar-ships-intentionally-thin)) — a page that explains what you do, rather than a filter returning zero results.

### Filters are a function of scale

Richprjcts filters because it has **50+** projects. Vucko (20) and Ordinary Folk (~10) do not filter at all — they show a curated index.

**At 13 projects, filters are over-structure.** See the revision in [03](03-curation.md#taxonomy--revised-relationship-as-ordering-not-as-tabs).

---

## Implementation checklist for Phase 3

Cheap, high-impact, taken directly from production code:

- [ ] Motion tokens — 3 durations, 1 delay step, 2 easings. **No hardcoded durations anywhere.**
- [ ] Three-tier negative letter-spacing on display type
- [ ] `clamp()` fluid type and asset scale — no breakpoint jumps
- [ ] Aspect-ratio tokens on all media containers
- [ ] Near-black ground, off-white text — never `#000`/`#fff`
- [ ] `.fonts-loading * { opacity: 0 }` until webfonts resolve *(Ordinary Folk)*
- [ ] Custom `::selection` colour *(Ordinary Folk)*
- [ ] Themed page transitions matching destination project *(Ordinary Folk)*
- [ ] `backface-visibility: hidden` + `translate3d(0,0,0)` on dense video grids
- [ ] `prefers-reduced-motion` honoured — every token collapses to `0s`

The last item is not optional. A motion-heavy site that ignores it fails the accessibility point the audit raised.
