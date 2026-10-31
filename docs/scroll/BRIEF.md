# BRIEF: YMF home page (scroll-craft)

Build: `ymf-home`, 31 October 2026. Interviewed in part; remaining topics are authored decisions, labelled as such.

## The eight topics

1. **Vibe.** Calvin: "really make this new site more captivating and help envision things", in "the royal blue of Kitara, kind of like what we used for this deck we had put together for the library". Authored: royal, rooted, hopeful. References: the Kitara Heritage Library deck (navy, gold, cream, serif display, golden-hour photography), a printed coffee-table book about a place, a land title deed.
2. **Journey, section by section.** Calvin chose "Distinct chapters": the land today, the founder's story, the town rising, the projects, the invitation.
3. **Energy curve.** Authored: calm and grounded at the open, warm in the founder chapter, the largest surge at the town rising, generous and bright through the projects, quiet confidence at the close.
4. **The one moment.** Calvin: "The land becomes the town": scroll turns today's farm and forest into the full town, phase by phase, on the real hills.
5. **One thing no other site does.** Authored from the brief: every acre is accounted for as you read. See signature move.
6. **Distance from premium-minimal.** Authored: editorial and dignified, closer to a printed book than to a tech launch. No neon, no gradients on text.
7. **One world or distinct scenes.** Calvin: distinct chapters.
8. **Assets.** Founder portrait, founder seal logo (Calvin chose the seal as the brand mark), the 3D concept model, the library deck as a style reference. Photoreal depictions to be generated in the Gemini app, labelled as artist's impressions.

## Grammar

**Chaptered editorial.** The page is a printed feature: a title page, numbered chapters on their own grounds, media in columns with captions, a colophon close. Why the others lost:
- Filmic one-shot: Calvin chose distinct chapters, not one carried arc.
- Continuous world: same, he declined the unbroken flight.
- Split stage: the today-versus-tomorrow tension fits, but it holds one comparison for the whole page and cannot carry the founder story or the projects.
- Gallery / catalog: fits the projects chapter only, and its "no single hero claim" rule fights the founder story.
- Typographic poster: the brief asks to envision things, which needs pictures.
- Live surface: the town is not software; the 3D model lives on its own page.
- Rhythmic cutlist: the wrong energy for a family legacy.

Bans honoured: no continuous drift gradient (hard ground changes per chapter), no full-bleed scrub hero, no pinned crossfade type acts, no magnetic CTA, no centred hero copy, media never bleeds under type, `scrub` in one chapter only, no spotlight.

## Journey

1. Recognition: this is real land, a real family, near a real city.
2. Grounding: what is already here (farm, forest, wetland).
3. Warmth: a grandfather's promise and the family carrying it.
4. Wonder (peak): the land becomes the town.
5. Range: what will stand here, project by project.
6. Context: Hoima is rising around it.
7. Commitment: build it with us.

## Feeling curve

| Chapter | Feeling | What causes it |
| --- | --- | --- |
| Title page | Respect, curiosity | Large serif title on royal navy, the founder's seal, one line of dedication. Stillness. |
| I. The land today | Calm, rootedness | A photographic morning on the land; real figures (1,280 acres, 126 cows, 300 acres of forest) counting up inside prose. |
| II. A grandfather's promise | Warmth, pride | The portrait opens with an iris reveal; the family's words. Quieter than what follows. |
| III. The land becomes the town | Wonder (PEAK) | The 3D model under the reader's hand: farm and forest, then Phase 1, 2 and 3 rising on the real hills. Largest span on the page. |
| IV. What will stand here | Aspiration, generosity | Asymmetric spreads of photoreal depictions with captions, arriving with parallax inside their columns. |
| V. Hoima is rising | Confidence, urgency | Sourced figures counting on a gold ground. |
| Colophon | Resolve, invitation | Masthead plate; the ask set as a line of running text; the acre ledger complete. |

**The peak:** "You scroll and the farm turns into a whole town on the actual hills." Chapter III.

**Tell-someone sentence:** "It's the site where you watch your grandfather's land turn into a town, acre by acre."

**Authored silence:** the title page holds still with no motion beyond the seal settling; the space before Chapter III is a plain intertitle on its own ground. Both are intentional.

## Signature move: the acre ledger

A 1,280-cell grid (one cell per acre, 32 by 40) sits in the margin beside the folio. As each chapter is read, the acres that chapter is about fill in with their zone colour: forest, wetland and dairy in Chapter I; every remaining zone fills phase by phase in step with the 3D model in Chapter III; the colophon shows the ledger complete with the draft land budget beside it. Hover or tap a colour to name the zone and its acres. On phones it collapses into a thin bar under the folio. Driven by the page's own scroll progress and the real draft land budget; the engine is untouched.

## Score

| Beat | Chapter | Device | Why |
| --- | --- | --- | --- |
| Recognition | Title page | `in` (flow) | A title page arrives once and holds; no media above the fold. |
| Grounding | I | `parallax` in the media column + `count` in prose | Depth inside the picture; real figures, not counters for show. |
| Warmth | II | `reveal` (iris) | A portrait opening is a change of state. |
| Wonder (peak) | III | `scrub` image sequence, span 3.6 | The reader's hand builds the town. Largest span. |
| Range | IV | `in` with stagger + `parallax` | Spreads arriving like turned pages. |
| Context | V | `count` | Real, sourced figures only. |
| Commitment | Colophon | `reveal` (up) | The plate wipes in and holds. |

Families: in, parallax, reveal, scrub, count (5). No family twice in a row at the act level. One scrub act.

## Fingerprint gate

The registry lives on Calvin's laptop and was not reachable from this session. Checked by hand against the Berea site (`site/index.html`), which uses pinned acts with kinetic lines, a magnetic CTA, pan, count and continuous drift:
grammar differs (chaptered editorial), nav differs (margin folio, no fixed bar), hero differs (title page, no media), sequence differs (one image-sequence scrub, no pins), close differs (colophon with running-text CTA, no magnet), signature differs (acre ledger). 6 of 6 against Berea. Not checked against chamuka-edge-widgets.

## Build notes (31 October 2026)

- **Brand.** Royal navy `#14223f` / `#1d2d51`, cream `#f5efe1`, burnished gold `#d3a74a`, from the Kitara Heritage Library deck. Royal blue `#2346a8` for links on cream. Cormorant Garamond for display, Nunito for text. The founder seal stays the mark. The diagonal gold band from the deck sits under the header and over the footer.
- **Engine.** `public/vendor/scrollcraft/` is scroll-craft 0.3.1, unmodified. `components/home/ScrollCraftRoot.tsx` loads and mounts it on the home page only and calls `destroy()` on navigation. The stylesheet is imported into the CSS base layer so the site's own rules win.
- **The peak.** 72 frames rendered from the real 3D model (`tools/film/render-frames.cjs`), 1440x810 for desktop and 900x900 for phones, about 5.6 MB and 3.9 MB, loaded once the reader is into chapter I. `components/home/FilmPlayer.tsx` draws them: the playhead eases toward the scroll position (140 ms time constant) and neighbouring frames are cross-faded, so the town rises smoothly instead of stepping. The phase legend and the acre ledger follow the same eased playhead (`filmPhase()` in `components/home/film-timing.ts`). The pin is still scroll-craft's.
- **Pictures.** Photoreal scenes made in the Gemini app (`public/images/city/`, `lib/content/scenes.ts`) in a modern smart-town style: paved streets, contemporary brick, stone and glass, green roofs and solar. The land-today picture stays rural on purpose. Every one is labelled "Artist's impression" where it appears, and the colophon and model credits say how they were made.
- **Honesty rules kept.** Counters only on figures the family or a cited source gave (1,280 acres, 126 cows, 300 acres of forest; the Hoima figures with their sources). Land budget acres are labelled as a draft. No investment figures.

## Verification

Checked on the production build with headless Chromium at 1440x900 and 390x844, and with reduced motion: title page, every chapter, four points through the film, the colophon, and the inner pages. No console errors. The film legend and ledger were checked against the frame shown at 10%, 35%, 62% and 95% of the pin. Not yet checked on a real phone or in Safari.
