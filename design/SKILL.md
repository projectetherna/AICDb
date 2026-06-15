---
name: aicdb-design
description: Use this skill to generate well-branded interfaces and assets for Dreamwall (an AI-generated film & series rating platform), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick map
- `README.md` — product context, content + visual foundations, iconography, index. **Start here.**
- `colors_and_type.css` — the single source of truth: CSS variables for fonts, colors, spacing, radii, shadows, motion, and semantic type tokens. Import it and build with the vars.
- `fonts/` — self-hosted Spectral (display) `.ttf` files.
- `assets/aicdb-mark.png` — the primary logo (chrome flower medallion).
- `preview/` — small spec cards for every foundation + component.
- `ui_kits/web-app/` — interactive, modular React/JSX recreation of the product. Copy components from here.

## Essentials
- Dark-first: canvas `#0a0a0a`; warm off-white text (never pure white).
- Coral `#D85A30` = primary action; teal `#4ECDC4` = secondary. Two accents, used sparingly — let posters/imagery carry the color.
- Type: **Spectral** (display serif, cinematic/editorial), **DM Sans** (body/UI), **JetBrains Mono** (all numbers).
- Icons: **Phosphor** (Fill default), colored by meaning, sparingly.
- Content types: Movie (coral), Series (teal), Short (gold), Vertical (lavender).
