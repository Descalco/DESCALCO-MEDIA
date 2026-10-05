# 00 — Brief

**What the revamp is for.** Every other document serves this one.
**Written 2026-10-05** as an intent check across the audit, docs 01–07, and your Notion (Brain, Independent, Master's Thesis).

The verdict: **the *how* was well established; the *for whom* and *to what end* never were.** Docs 01–07 are rigorous about stack, media, taxonomy and visual craft. None of them stated who the site is for or what a visitor should do. **Resolved the same day — see [Answers](#answers--locked-2026-10-05).**

---

## Established — you said it

| Intent | Source |
| --- | --- |
| **Motion design first**, with room for UX/Web and other areas | Original audit — "Tu queres que o site comunique *motion design first*" |
| **"Make people really see what I am about even as a junior"** | [D9](02-decisions.md#d9--the-site-is-a-work-sample) — your words |
| **Raise the level, not polish** — a rebuild, not another pass of effects | Original audit — "o teu objetivo é subir o nível" |
| English only | [D3](02-decisions.md#d3--language-english-only) — chosen, then reversed from bilingual |
| €0 media budget | [D4](02-decisions.md#d4--zero-budget-for-media-hosting) |
| React/Next.js because you'll own and grow it; software case studies (Money Trail, Arkive, Cull) are coming | [D1](02-decisions.md#d1--framework-nextjs-app-router), [D7](02-decisions.md#d7--uxweb-pillar-ships-intentionally-thin) |
| Long-term growth is an explicit priority | [D7](02-decisions.md#d7--uxweb-pillar-ships-intentionally-thin) |
| Hero set: SOF WEEK · GUISADO · MOTION JAM · Cidade do Futuro | [D5](02-decisions.md#d5--hero-set-4-projects) |
| Aspirational references: Richprjcts, murilo.me, Vucko (+ Ordinary Folk as blueprint) | [05](05-references.md) |

## Inferred — written for you, never confirmed

| Claim | Where it came from |
| --- | --- |
| What to preserve: dark + red identity, the opener / "scene" feeling, My Story's personal tone, the backoffice | The auditor's list ("O Que Eu Preservaria"). Plausible, but not your statement. |
| The success definition — "understands within 10 seconds… strongest three pieces in two clicks" | Proposed in [06](06-roadmap.md#what-done-means), marked *to be confirmed* since August |
| Descalco Media is the name the site sells | Assumed everywhere, never discussed |

---

## Gaps — not established

### 1. Who is the site for? — *the big one*

The docs implicitly write for **a junior looking for work** (D9). Your Notion says you are:

- **Full-time Multimedia Designer** at AlbumTeller / LabsForge
- **Master's in Digital Design** at IPCA — and `descalcomedia.pt` is linked from your thesis supervisors' hub
- **NAU Collective** Studio Coordinator
- **Solo freelancer** (Limifield)

That's four possible readers, and they want different sites:

| Reader | Homepage leads with | Primary action | Hero set skews |
| --- | --- | --- | --- |
| Studios hiring (next job) | Reel + range | Email / CV / LinkedIn | Craft & process — current set fits |
| Direct freelance clients | Outcomes, services, clients | Brief / quote form | Client work — Limifield moves *up* |
| Academic (supervisors, jury, future research) | Thinking, motion language | Read the case study | Process-heavy work, thesis |
| Peers / community | Personal voice, experiments | Follow / Play | Play, NAU |

Every downstream decision — CTA, About copy, hero set, whether Limifield ×4 is a weakness or the selling point — depends on this.

### 2. What should a visitor *do*?

No primary action is defined. A contact form exists (Netlify Forms) but nothing says it's the goal. Without one, "done" can't be measured.

### 3. Descalco Media or Pedro Costa?

"Descalco Media" reads as a studio; "even as a junior" reads as a person. Those pull opposite ways — on the logo/opener, on "I" vs "we" in the copy, on whether NAU appears. Pick which one the site is *about*.

### 4. The positioning sentence was never written

Phase 1 of the original audit opens with *"definir o posicionamento central em 1 frase."* It's the only Phase 1 task never done. D9's quote is a goal, not a line that goes on the homepage.

### 5. What is the signature?

The success definition promises "a motion designer **with a signature**". Nothing says what it is.

Your thesis may already be the answer: the **Motion Personality Matrix** — motion as parameters, tokens and rules — plus generative motion software as the practical component. That is the same idea as the [motion tokens](07-visual-language.md#motion-as-a-system--the-vucko-pattern) in 07, which the docs took from Vucko. **None of the docs connect them.** If the site's motion system *is* your thesis work applied, the site stops borrowing a signature and starts demonstrating one — and the deferred Play section gets its content source.

### 6. Can employer work be shown?

[D7](02-decisions.md#d7--uxweb-pillar-ships-intentionally-thin) says zero UX/Web work exists. Notion records the **LabsForge company website** (full design, launched) and you've built the **AlbumTeller culling UI**. If either is showable, the UX/Web pillar launches with real work instead of a statement.

### 7. When, and how much?

No launch target anywhere. With a full-time job, a Master's and NAU, capacity is the real constraint — and the plan currently has no scope ceiling. A date forces the cut between launch and post-launch.

---

## Answers — locked 2026-10-05

| # | Gap | Answer | Consequence |
| --- | --- | --- | --- |
| 1 | Audience | **Studios hiring me.** Freelance clients, academia and peers are secondary. | D9 ("even as a junior") is **confirmed**, not reopened. The current hero set fits. Limifield stays low in the order. |
| 2 | Primary action | Follows from #1: **get in touch about a role** | Email, CV and LinkedIn reachable from every page; a quote/brief form is *not* needed. |
| 3 | Identity | **Pedro, as Descalco** — Descalco Media is your personal practice name | First person ("I") throughout. Your name visible, not hidden behind the brand. NAU appears as a credit, not as "us". |
| 6 | Employer work | **Not shown.** AlbumTeller's final product can't be shown yet; the online Cull is a Master's *study*; LabsForge site isn't work you're proud of | [D7](02-decisions.md#d7--uxweb-pillar-ships-intentionally-thin) holds: UX/Web launches as a capability statement. The Cull study may appear later, labelled as a study — not at launch. |
| 7 | Timeline | **Launch by end of 2026** (~12 weeks from today) | Forces a launch scope — below. |

### Brief, in one paragraph

A personal portfolio for **Pedro Costa, working as Descalco Media**, built to make **motion studios want to hire him**. Motion design first, range second. The site is itself a work sample: one coherent motion system, not accumulated effects. Visitors should see the reel, reach the strongest work, and find a way to contact him — fast. Launches by **31 Dec 2026**.

### Success definition — proposed from the answers

> A creative director at a motion studio who has never heard of Pedro understands **within 10 seconds** that he is a motion designer with a signature and range, reaches the **reel or a hero case study in one click**, and finds **email / CV / LinkedIn in one more**.

### Launch scope (by 31 Dec) vs post-launch

| Launch | Post-launch |
| --- | --- |
| Home: reel loop hero, selected work (4 heroes), capability statement, contact | Play (needs ~15 pieces — [D6](02-decisions.md#d6--play-deferred-to-post-launch)) |
| `/work` curated index (13 entries) + `/work/{slug}` | Capability pages (Burocratik `/branding` pattern) |
| 4 hero case studies migrated; 9 simple entries | Dedicated `/recognition` page — **awards and credits go on cards and in About at launch** |
| `/reel/2026` (YouTube facade) | Backoffice adapted to the new schema — launch reads the generated data file as-is |
| About (first person, with CV link), Contact | Software case studies (Money Trail, Arkive) |
| Media pass (GIF → video, JPG resize), OG/SEO basics, reduced-motion | Themed page transitions, custom cursor-level polish |

### Still open

- **#4 Positioning sentence** — write it now that the audience is fixed. It goes on the homepage.
- **#5 Signature** — does the site's motion system come from your thesis's Motion Personality Matrix? Recommended: yes. It turns borrowed tokens into your own, and for a studio audience it's the strongest proof of "signature".
- **Q3** hero loop export, **Q4** typeface — see [06](06-roadmap.md#open-questions). Q4 now has a deadline: Phase 3 can't start without it.
