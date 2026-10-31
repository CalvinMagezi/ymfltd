# Yesero Mugenyi Foundation website

The public site for New Kikwite Town, the Foundation's planned satellite town on 1,280 acres southeast of Hoima, Uganda.

Next.js 16 (App Router), React 19, Tailwind CSS 4, three.js. Bun is the package manager.

```bash
bun install
bun run dev        # http://localhost:3000
bun run build
```

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: the vision, what exists today, the four project themes, phases, the family, partner call |
| `/explore` | Interactive 3D concept model of the town (public version) |
| `/projects`, `/projects/[slug]` | The 16 projects, each with an honest status |
| `/story` | The founder, the family, documented milestones, how we work |
| `/hoima` | Sourced facts about Hoima, each linked to its source |
| `/partner` | Who we want to hear from, how it works, enquiry form |

## Content rules

All copy lives in `lib/content/`. Before adding or changing a factual claim, read `docs/FACTS.md`:
every claim must trace to a family document or a cited public source, and plans are described as plans.
No investment figures (raise size, IRR, MOIC) on the public site; those go in the investor pack.

## The 3D model

`tools/concept-model/` holds the Python pipeline that builds the model from open data
(OpenStreetMap, SRTM terrain, Sentinel-2 cloudless imagery) and writes `public/explore/`.
The public export has no satellite photo, no site boundary line and no neighbouring buildings.
The family's detailed version, with imagery and the traced outline, is kept private.

`tools/concept-model/renders.py` regenerates the still images in `public/images/concept/` from a running build.

## Enquiries

The partner form stores enquiries in the Foundation's Sanity dataset. It needs `SANITY_API_TOKEN`
in the Vercel environment; without it the form tells visitors to email instead.
The old Sanity Studio config is kept in `sanity-studio/` for reference.
