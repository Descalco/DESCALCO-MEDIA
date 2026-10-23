# 05 — Reference Sites

Teardowns of sites chosen as aspirational, plus comparable award-winning motion practices.
**Inspected 2026-08-08** via direct HTML fetch — the stacks below are evidence from markup and asset URLs, not guesses.

---

## Pedro's references — 2026-10-23 · highest priority

Chosen by Pedro himself. They **outrank everything below** (which was picked by the planning process). Scope, in his words: **design, structure, organisation and ideas only** — not their stack, backend or motion engineering.

| Site | Pedro's verdict | What it is |
| --- | --- | --- |
| **automatic.pictures** (CarlosTV) | **Main reference — "gosto de tudo"** | Solo motion designer / creative technologist, Madrid. Squarespace. |
| **nunoleites.com** | How projects are organised; the **Miscellaneous** section | Solo Portuguese motion designer. WordPress. |
| **emotion-agency.com** | The **wow effect** | Web studio, Ukraine. Nuxt + Three.js. |

### automatic.pictures — the main reference

**Structure.** Nav: `WORK | APPS | TOOLS | ABOUT` — small mono uppercase, pipe-separated, active item in `[brackets]`. Home is short:

1. Statement — *"Engineering Motion Design"* + one mono line (*"freelance creative technologist working across timezones…"*)
2. **The reel, inline, full-width** in a rounded frame with page margins — not a hero loop behind text, the reel *is* the hero
3. **Apps** — his own tools as an app-dock row of icons, with a `[WIP]` tag
4. **Client list** — names only, mono, two columns, `[ONGOING]` tag

`/work` is a plain 3-column grid of rounded thumbnails, titles only. About is one block of mono uppercase prose ending in *Selected clients* / *Projects for*.

**Design.** Pure black ground, white, almost no colour except what the work brings. Two families: a grotesk (Roboto) for statements, **a mono (Roboto Mono) for everything else** — nav, metadata, labels, tags. Rounded media frames. Lots of empty black.

**Ideas worth taking**
- **The reel is the hero** — answers Q3 differently: maybe no separate loop, the reel itself inline (muted autoplay, sound on click)
- **An "Apps" row** — the elegant answer to [D7](02-decisions.md#d7--uxweb-pillar-ships-intentionally-thin): Money Trail, Arkive (and the Cull study, labelled) as icons + name + `[WIP]`, instead of a capability paragraph
- **Mono for all metadata** — one rule that makes the whole site feel engineered
- **Client list as plain text** — credibility without logos

### nunoleites.com — organisation and Miscellaneous

**Structure.** Nav `HOME · WORK · MISCELLANEOUS · ABOUT` in a floating pill (top right), logo pill top left, light/dark toggle. Home: reel (click to unmute) → one-paragraph intro in first person → 6 selected projects → *"Watch more projects or some miscellaneous work"* → footer with email + socials on every page.

**Work page.** 2–3 column grid. Each card = thumbnail, **title + year on one line**, **one or two sentences** saying what it was, then discipline pills. Filter pills at the top (`All · Branding · Design · Motion · Type`) — 10 projects.

**Miscellaneous** — the idea Pedro singled out. An accordion list, newest first:

```
✿ [2026] 25 de Abril Sempre!        +
✎ [2025] Tjikko                     +
```

- `✎` = client work, `✿` = self-initiated — a legend at the top
- Expanding a row shows **structured credits on the left** (type ✦ context, discipline, role, client, studio) and the media on the right
- Intro says it's updated irregularly — **no density pressure**

**About.** Long-form first person, a large portrait, career history with linked studios, *"I've been working with…"* split into **Studios / Brands**, and **Random facts** (D&D monk level 12, loves bread). Personality as a credibility signal.

**Ideas worth taking**
- **Work = few projects, each with a 1–2 sentence description** — not just a thumbnail
- **Miscellaneous solves what Play could not** ([D6](02-decisions.md#d6--play-deferred-to-post-launch)): a list works with 8 items where a grid needs 48. Limifield ×4, QUEEN, LET IT HAPPEN, Empresta o Verbo Amar, KINETIC DUALITY fit here at launch — and `✎/✿` **is** the `relation` field from [D8](02-decisions.md#d8--relationship-as-the-organising-axis--as-ordering-not-tabs), already in the schema
- **Credits as structured fields** in the expanded row — exactly what D8/D9 asked for
- **About with personality** — Random facts, Studios/Brands lists — fits "Pedro, as Descalco", first person

### emotion-agency.com — the wow

**What makes the wow.** An entry gate (*Enter with audio / without audio*), then one persistent WebGL scene — a particle letter that morphs between shapes as you scroll through chapters, over a landscape. Light lavender palette (the only light reference). Type mixes **italic serif accents** (*Where*, *We*) with **condensed caps** and small **mono** labels (PP Neue Montreal + IBM Plex Mono).

**Structural ideas (no engineering needed)**
- **Project spec cards** — every project carries a mono data block: `PRJCT /01 · CREATED AT · NAME · TYPE · SCOPE · STACK`. For a motion designer: role, software, duration, team — the credits system again
- **Numbered capability list** `(001) … (012)` — a capability statement that reads as a list, not a paragraph
- **Awards as a counted section** — `TOTAL: 70`, grouped by platform with `[31]` counts — the `/recognition` idea from Burocratik, made structural on the home page
- **Indexed footer** — `[01] HOME [02] ABOUT …`, click-to-copy email
- **An entry moment** — one memorable first screen before the site

**Caution.** The wow here is a full 3D scene. At ~10 weeks to launch, take **one** signature moment (the hero or the entry), not a whole-site scene. Pedro scoped this reference as *ideas*, not engineering.

### What the three agree on

| | automatic | nuno | emotion | → for this site |
| --- | --- | --- | --- | --- |
| Ground | black | near-black (+ light toggle) | lavender | **dark** |
| Type | grotesk + **mono** | grotesk | grotesk + serif italic + **mono** | **a grotesk + a mono** for metadata (feeds Q4) |
| Reel | inline hero | inline hero | — | **reel near the top, sound on click** |
| Work | grid, titles | grid + 1–2 lines + tags | spec cards | **few projects, described, with structured credits** |
| Rest | Apps, Client list | **Miscellaneous** | services, awards | **Misc list + Apps row + credits/awards** |
| Contact | About page | footer, every page | footer, every page | **email + socials in every footer** |

Open questions this raises are in [`.coord/OWNER-DECISIONS.md`](../../.coord/OWNER-DECISIONS.md) (items 10–14).

---

## What they're actually built with

| Site | Stack | Media | Evidence |
| --- | --- | --- | --- |
| **richprjcts.com** | **Squarespace** | Squarespace CDN, 52× `loading="lazy"`, masonry grid | 73 `squarespace` refs in markup |
| **murilo.me** | **Cargo.site** | `freight.cargo.site` CDN | `build.cargo.site/frontend/…/index.js` |
| **vucko.co** | **Nuxt + DatoCMS** | 73 KB HTML, 1 mp4 — extremely restrained | `nuxt` × 4, `datocms` × 3 |
| **ordinaryfolk.co** | **Webflow** | **Cloudflare R2 + Cloudflare Pages** | `w-mod-js`, `data-w-id`, `pub-….r2.dev` |
| **mvsm.com** | custom, 36 KB HTML | Vimeo | `vimeo` link, minimal markup |

## The finding that matters most

**Two of the three aspirational sites run on no-code template platforms.** Richprjcts — with Google, Apple, OpenAI and Netflix as clients — is on **Squarespace**. Murilo is on **Cargo.site**, an artist-portfolio template service. Only Vucko is genuinely custom.

The closest structural match to this project, Ordinary Folk, is an **award-winning motion studio on Webflow**.

**Implication:** what makes these sites feel premium is curation, typography, pacing and restraint — **not engineering**. The original audit scored the site 6.3/10 and blamed architecture. These references suggest architecture was never the differentiator.

This does not invalidate [D1 (Next.js)](02-decisions.md#d1--framework-nextjs-app-router) — owning the stack is right given the software case studies ahead. But it reframes the risk: **the danger isn't picking the wrong framework, it's spending effort on machinery instead of editorial quality.**

---

## Richprjcts — the taxonomy

`richprjcts.com`. Squarespace, ~50+ projects, masonry grid. **The single most useful idea taken from any reference site.**

### Filtering by relationship, not discipline

Client-side filtering on `data-filter` attributes, four tabs, `All` active by default:

```html
data-filter="All" | "Clients" | "Personal" | "Showreels"
```

The axis is **who the work was for**, not what discipline it belongs to. This directly replaced the discipline filters proposed by the audit and handoff — see [D8](02-decisions.md#d8--relationship-as-the-organising-axis--as-ordering-not-tabs).

### Showreels are annual

```
/showreel-2022   /showreel-2023   /showreel2024   /showreel2025
```

A reel is not a single asset — it's a **recurring artifact with its own page**, published yearly. That gives a reason to return to the site annually and makes improvement over time visible.

### Ratio caveat

Their markup carries 73 "Clients" mentions against 23 "Personal". **Their Clients tab is the flex** — Google, Apple, OpenAI, Netflix. Ours inverts that ratio, which is why `All` must remain the default. See [03](03-curation.md#the-honest-caveat).

### Also worth noting

52 × `loading="lazy"`, `aspect-ratio` used for layout stability, and a `barba` reference (page transitions). On Squarespace, with a client list like that. **Content beats stack.**

---

## Ordinary Folk — the blueprint

`ordinaryfolk.co`. Closest match to this project's plan, and it validates most of it.

### IA

```
/  ·  /work  ·  /play  ·  /process  ·  /about  ·  /contact
/project/{slug}
```

Essentially the IA we landed on. There is also a `/play-old`, meaning **Play was redesigned at least once** — it's a section worth iterating on rather than getting right first time.

### Media strategy — validates [04](04-media-architecture.md) exactly

Assets live entirely off-site on `ordinaryfolk-assets.pages.dev` (Cloudflare Pages) and `pub-56e21cb1….r2.dev` (Cloudflare R2). Webflow's own CDN carries only the OG image and a few responsive variants.

- **Every video is a paired `.mp4` + `.webm`** — `creation.mp4` / `creation.webm`, `Play_Biker.mp4` / `Play_Biker.webm`
- One file is `OF_Reel2_clean-transcode.mp4` — an explicit encode step, not a raw export
- **Posters are frames cut from the video**: `OF_Reel-0-00-02-15.webp` is a WebP grabbed at timecode 0:00:02:15

### The Play page

**48 pieces**, every one an autoplaying muted loop. Measured on the page: 48 `.mp4`, 48 `.webm`, 48 `muted`, and **`poster` used zero times**.

They go fully motion-everywhere on that one page and nowhere else — the "scroll-driven drama in blocks, not everywhere" principle from the audit, actually applied.

**This density is the point.** See the [Play density problem](03-curation.md#play--deferred-to-post-launch).

---

## Techniques worth stealing

Lifted from Ordinary Folk's production CSS:

| Technique | Code | Why |
| --- | --- | --- |
| **Hide page until fonts load** | `.wf-loading * { opacity: 0 }` | Kills the flash of fallback type — what makes cheap sites look cheap |
| **Never pure black or white** | `#161616` background, `#B7B5A9` off-white text | Pure `#000`/`#fff` is the fastest way to look like a template |
| **Custom `::selection`** | `::selection { background: rgba(0,0,0,0); color: #B7B5A9 }` | Two lines; almost nobody does it |
| **Viewport-unit text indent** | `text-indent: 22.3vw` on the home headline | Type wraps around a fixed element — classic editorial move, trivially cheap |
| **Forced GPU promotion** | `backface-visibility: hidden` + `translate3d(0,0,0)` | Required when many videos decode at once |
| **Themed page transitions** | `.transition-dark` / `.transition-light` / `.transition-white` | Transition colour matches the destination project. Small idea, large perceived polish |
| **Lightbox, don't navigate** | `.w-lightbox-frame { width: 95vw; height: 95vh }` | The pattern for the [YouTube facade](04-media-architecture.md#job-b--youtube-via-a-facade) |

---

## Other comparable practices

Solo or small motion practitioners with strong signature, worth studying for positioning rather than tech:

- **Mat Voyce** — Awwwards SOTD, GSAP Site of the Year nominee. Entirely type-in-motion: letters stretch, snap and recombine on scroll. The clearest example of one idea executed relentlessly.
- **Chris Gannon** — UK motion designer (Google, Amazon, BMW). Clean typography, playful animation, bold orange accent.
- **Andy Tomlinson** — Glasgow-based, 2D animation. Minimal and modern, clear type, bold statements.
- **Uncommon Studio** — Awwwards SOTD + Developer Award + FWA.
- **ManvsMachine** — nav is just `Work` and `Info`. 36 KB of HTML. An argument for how little structure a strong body of work needs.

### Sources

- [Awwwards — portfolio winners](https://www.awwwards.com/websites/winner_category_portfolio/)
- [Awwwards — Sites of the Year](https://www.awwwards.com/websites/sites_of_the_year/)
- [Motion design portfolio examples](https://www.sitebuilderreport.com/inspiration/motion-design-portfolios)
- [Muzli — top portfolio sites](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/)
