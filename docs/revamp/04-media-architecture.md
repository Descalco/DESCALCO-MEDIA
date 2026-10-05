# 04 — Media Architecture

Zero-budget media strategy. Constraint: **no paid services** ([D4](02-decisions.md#d4--zero-budget-for-media-hosting)).

---

## The core principle: video has two jobs

They have opposite requirements. Solving both with one host is why this normally goes wrong.

| | **Job A — cover loops** | **Job B — full pieces** |
| --- | --- | --- |
| What | Grid cards, hover previews, hero loop | Showreel, complete works, case study video |
| Length | 2–10 s | 30 s – several minutes |
| Audio | none (track stripped) | yes |
| Trigger | autoplay | user-initiated |
| Requirement | **instant start** | quality, seeking, adaptive |
| Solution | **self-hosted, hard-compressed** | **YouTube via facade** |

Streaming is *actively wrong* for Job A: the HLS manifest fetch plus segment handshake adds latency you feel on every card, and adaptive bitrate is meaningless for a 4-second loop.

---

## Job A — self-hosted loops

### Encoding targets

| Asset | Spec | Budget |
| --- | --- | --- |
| Grid cover loops | 540–720p, muted, **audio track removed**, 2–6 s | 200–500 KB each |
| Hero loop | 720–1080p, muted, 6–10 s | 500 KB – 1 MB |
| Case study inline loops (GIF replacements) | 720p, muted, looped | 200–500 KB each |

Ship **paired `.mp4` + `.webm`** for every loop — this is what Ordinary Folk does (`creation.mp4` / `creation.webm`). MP4/H.264 for universal support, WebM/VP9 for size.

At these sizes, 20 loops totals ~8 MB. **The reason your current media feels unhostable is that it's unoptimised, not that it's inherently large.**

### Where they live

**Option 1 — in-repo (start here).** ~8 MB served from Netlify's CDN. No third party, no account, works today.

**Option 2 — Cloudflare Pages (when you outgrow it).** A *second repo* containing nothing but optimised media, deployed to Cloudflare Pages, referenced by absolute URL. Free tier, **unlimited bandwidth**, no card required. The site repo then never grows again.

This is precisely what Ordinary Folk does — assets sit on `ordinaryfolk-assets.pages.dev` and `pub-….r2.dev`, entirely separate from the site.

> Cloudflare R2 is the alternative (10 GB free, free egress) but typically wants a card on file even inside the free tier. Pages avoids that. Verify current terms before committing.

---

## Job B — YouTube, via a facade

**YouTube's problem is the embed, not YouTube.** A standard iframe pulls ~1.3 MB of JavaScript and a dozen requests *before anyone clicks play*. That's what makes it feel cheap.

### The facade pattern

Render your own poster frame and your own play button. Instantiate the YouTube player **only on click**.

What it buys:

- Zero YouTube JS on page load
- Your poster art, your typography — no YouTube chrome until someone chooses to watch
- **Analytics preserved.** Views register when the real player loads. Arguably cleaner data: you're counting intent, not impressions.
- ~3 KB of code

Reference implementation: `lite-youtube-embed`. Wrap it as a React component.

Player URL on click:

```
https://www.youtube-nocookie.com/embed/{ID}?autoplay=1&controls=0&rel=0&playsinline=1
```

Drive playback with the IFrame API if you want a custom scrubber. Open it in a **95vw / 95vh lightbox** rather than navigating away — the Ordinary Folk pattern.

### Honest limitations

- `modestbranding` no longer does anything — YouTube deprecated its effect
- `rel=0` does **not** remove related videos; it only restricts them to your own channel
- The end screen still appears

A facade gets you most of the way, not all of it. The residual YouTube-ness only surfaces *after* a deliberate click to watch a full piece, which is an acceptable place for it.

### Already half-solved

Eight of the thirteen projects already carry a YouTube `externalLink`. Those masters are off-site already. YouTube is wrong for embedded hero content but fine as the "watch the full piece" outbound link it currently is.

---

## The hero problem

If the showreel lives behind a click, the homepage hero is a static image with a play button — precisely the "doesn't sell the work immediately" failure the audit called out.

**Fix:** cut a **6–10 second silent loop from the reel**, encode it hard, self-host it, autoplay it behind the hero type. "Watch the showreel" then opens the full YouTube piece in the lightbox facade.

~1 MB of owned, instant motion. This is the one video asset that genuinely belongs in the repo.

**Also export a poster frame from the reel.** Ordinary Folk's is literally named `OF_Reel-0-00-02-15.webp` — a WebP grabbed at timecode 0:00:02:15.

**Open question Q3** — this requires one export from you.

---

## Images

No CDN needed. Optimise at build with **sharp** → AVIF/WebP + `srcset`, served from Netlify's CDN.

| Task | From | To |
| --- | --- | --- |
| Convert 11 GIFs → muted MP4/WebM loops | 38 MB | ~3 MB |
| Resize + re-encode 69 JPGs | 109 MB | <10 MB |

**The GIFs are the single highest-leverage fix on the entire site.** GIF→video is 90–95% reduction at *better* quality. The GUISADO case study alone loads ~34 MB of animated GIF today.

### Consequence for the build

Because images are optimised at build rather than by a runtime service, **`next/image`'s built-in optimizer is not needed** — which means **static export works and there is no Vercel requirement**. Netlify's free tier (100 GB/month bandwidth) is sufficient.

---

## Final stack — total cost €0

| Layer | Solution |
| --- | --- |
| Hosting | Netlify free tier, Next.js static export |
| Images | sharp at build → AVIF/WebP + srcset, Netlify CDN |
| GIF replacements | muted MP4/WebM loops, in-repo |
| Cover loops | in-repo, ~8 MB total |
| Hero loop | in-repo, ~1 MB |
| Full pieces + showreel | YouTube via facade |
| Overflow (later) | Cloudflare Pages, free, unlimited bandwidth |

No new accounts required to start.

---

## Rendering note

Ordinary Folk's Play container carries `backface-visibility: hidden` and `transform: translate3d(0,0,0)` — forced GPU layer promotion, needed because dozens of videos decode simultaneously. **You will need the same trick** on any dense grid of autoplaying loops.

## Cleanup

Two files can be deleted outright — both are referenced nowhere ([01](01-audit-review.md#the-two-headline-performance-crises-are-dead-files)):

- `assets/img/OUTROS/PF_02_MakingOf_*.mp4` — 164 MB, local only
- `assets/video/OPENER.mov` — 40 MB, tracked in git

Note that deleting `OPENER.mov` from HEAD does not reclaim it from history — see the [`.git` size note](01-audit-review.md#4-git-is-355-mb).
