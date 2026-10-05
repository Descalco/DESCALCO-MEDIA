# 05 — Reference Sites

Teardowns of sites chosen as aspirational, plus comparable award-winning motion practices.
**Inspected 2026-08-08** via direct HTML fetch — the stacks below are evidence from markup and asset URLs, not guesses.

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
