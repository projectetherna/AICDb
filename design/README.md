# Dreamwall — Design System

**Dreamwall** is a community ratings & discovery platform for **AI-generated film and series** — think Letterboxd's taste-driven social layer crossed with IMDb's structured catalog, but purpose-built for synthetic cinema. Users browse, rate (5 stars), review, build watchlists and lists, and explore an aggregate **AI Score** for every title. Content is organized by type: **Movie, Series, Short, Vertical**.

This repository is the brand + product design system: visual foundations (color, type, spacing), reusable CSS variables, brand assets, preview cards, and a high-fidelity UI kit recreation of the web app.

> **Status / provenance.** This system was created from a written brief — no existing codebase, Figma, or brand assets were provided. The brand direction (coral `#D85A30` primary, teal `#4ECDC4` secondary, dark `#0a0a0a` canvas, minimal/modern, Letterboxd + IMDb reference) was specified by the user; everything else (font selection, content-type colors, components, logo) is a first proposal to iterate on.

---

## Sources

- **Brief:** AI-generated film & series ratings platform. Dark background `#0a0a0a`, primary coral `#D85A30`, secondary teal `#4ECDC4`, minimal & modern. References: **Letterboxd**, **IMDb**.
- **Codebase / Figma:** none provided.
- Requested coverage: color palette, type scale, button styles, card components, nav bar, spacing rules, content-type badges (Movie / Series / Short / Vertical).

---

## Content fundamentals

How Dreamwall writes. Tone takes cues from Letterboxd: **witty, opinionated, film-literate, but never gatekeeping.** The product talks to a *you*; the brand refers to itself as *we* sparingly.

- **Voice:** second person, active, confident. "Rate this", "Add to your watchlist", "Your friends are watching". Verbs lead.
- **Casing:** Sentence case for UI labels and buttons ("Add to watchlist", not "Add To Watchlist"). **UPPERCASE** reserved for overlines, badges and content-type tags (`MOVIE`, `SERIES`, `SCORE`) — set with letter-spacing.
- **Numbers are first-class.** Scores, runtimes, years, rating counts always render in the mono face (JetBrains Mono) with tabular figures: `8.7`, `142 min`, `24.1k ratings`.
- **AI-native vocabulary:** "Generated", "Diffusion", "Text-to-Video", "Frame interpolation", "Hybrid live-action" appear as facets/genres — embrace the medium rather than hiding it.
- **Emoji:** not used in product UI. The star (★) is the one expressive glyph, and it's a rating primitive, not decoration.
- **Microcopy vibe:** short, dry, a little knowing. Empty states have personality ("No ratings yet. Be the first to call it.") without slipping into cutesy.

Examples:
- Button: `★ Rate this` · `+ Watchlist` · `Share`
- Overline: `TOP RATED THIS WEEK` · `GENERATED · 4K · 2025`
- Empty list: `Your watchlist is empty — go find something worth queuing.`

---

## Visual foundations

The feel: **a dark cinema lobby.** Content (posters, stills) supplies the color; the chrome stays quiet, warm-neutral, and out of the way. Minimal, confident, editorial.

- **Color & mood.** Canvas is a true near-black `#0a0a0a` with a warm-neutral surface stack (`#151514` → `#262624`). Text is a warm off-white (`#f5f3ef`) — **never pure `#fff`**. Coral is the single loud voice (actions, ratings, the Movie type); teal is the cool counterpoint (links, Series, positive status). Two accents, used sparingly — the posters are meant to be the color.
- **Typography.** Display = **Spectral** (a cinematic, literary serif — refined and editorial without being aggressive or overly classic) for headlines and film titles. UI/body = **DM Sans** (clean, slightly warm geometric sans). Data = **JetBrains Mono** for every number. See `colors_and_type.css`.
- **Spacing.** 4px base grid (`--space-1…10`). Generous gutters in content grids; tight, deliberate spacing inside cards. Layout via fl/grid + `gap`, never margin-stacking.
- **Backgrounds.** Flat dark surfaces — **no gradient backgrounds on chrome.** Gradients appear only as poster placeholders and as subtle scrims/protection gradients over imagery (e.g. bottom-of-poster darkening so a badge/score stays legible). Glassy translucent bars (`rgba(10,10,10,0.8)` + `backdrop-filter: blur(12px)`) for sticky nav.
- **Imagery.** Posters and stills are the heroes — 2:3 poster ratio for Movie/Series/Short, 9:16 for Vertical. Imagery runs warm and cinematic; let it bleed to card edges. Use a dark scrim behind any overlaid text/badges.
- **Cards.** Surface `--bg-1`, `1px` subtle alpha border, `--radius-lg` (12px), `--shadow-1` at rest lifting to `--shadow-2` on hover. Poster fills the top, metadata sits in a compact body. Posters themselves get `--shadow-poster`.
- **Borders.** Always alpha-on-dark (`rgba(245,243,239, .07/.12/.20)`), never a solid grey line. Accent borders (coral 55%) mark selected/active.
- **Corner radii.** 4 (chips/tags) · 8 (buttons/fields) · 12 (cards) · 16 (modals) · pill (toggles, avatars, badges).
- **Shadows.** Tuned dark and soft for the near-black canvas; elevation 1→3 plus a dedicated `--shadow-poster`. Focus = a 3px coral glow ring, not a hard outline.
- **Hover.** Accents *lighten* (coral→`#e8714a`, teal→`#6fdbd3`); surfaces step up one level (`bg-1`→`bg-2`); cards lift their shadow and the poster scales ~1.03 under `overflow:hidden`.
- **Press.** Accents *darken* (coral→`#bd4a24`) and the element scales to ~0.97. Quick and physical.
- **Transparency & blur.** Reserved for sticky nav, poster scrims, and score chips over imagery (`backdrop-filter: blur(4–12px)`). Not used decoratively on flat surfaces.
- **Motion.** Restrained. 120ms (fast: hovers, presses) / 200ms (base: most transitions) / 320ms (slow: overlays, page-level). Easing `--ease-out` for entrances; **no bounce, no springy overshoot.** Fades and short translate/scale only.
- **Layout rules.** Sticky translucent top nav. Content max-width with comfortable side gutters; full-bleed hero/backdrop on detail pages. Grids reflow responsively; poster aspect ratios are fixed.

---

## Iconography

- **Set:** **[Phosphor](https://phosphoricons.com)** — a flexible icon family with real visual weight. We use the **Fill** weight as the system default (it reads richer than thin line icons on the dark canvas), with **Bold** for utility/UI affordances. Loaded via jsDelivr stylesheets, one per weight:
  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/fill/style.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/bold/style.css">
  ```
  then `<i class="ph-fill ph-star"></i>`.
- **Spec:** 24–28px in tiles, ~20px inline. **Color by meaning, sparingly:** icons sit silver/neutral by default; **coral** is reserved for the primary action (rate), **lavender** for AI (echoing the mark's holographic reflections). Avoid rainbow icon sets.
- **Common glyphs:** `star` (rate), `bookmark-simple` (watchlist), `play`, `magnifying-glass` (search), `sparkle` (AI), `film-slate` (Movie), `television-simple` (Series), `device-mobile` (Vertical), `scissors`/`film-slate` (Short), `chat-centered-text` (review), `share-network`, `list-bullets`, `trophy`, `fire`, `clock`.
- **The star (★)** is used as a literal Unicode glyph in the *rating control* so half-fills clip crisply; elsewhere use `ph-fill ph-star`.
- **Emoji:** never in product UI.
- **No PNG icons.** (Substitution flag: Phosphor was chosen as a CDN match since no in-house icon set was provided.)
- **Capture note:** icon-font glyphs may render blank in automated DOM screenshots but display correctly in a real browser/Design-System tab.

---

## Index — what's in this folder

| Path | What it is |
|---|---|
| `README.md` | This file — context, content & visual foundations, iconography, index. |
| `colors_and_type.css` | **Single source of truth** for CSS variables: fonts, colors, spacing, radii, shadows, motion, and semantic type tokens. Import this everywhere. |
| `SKILL.md` | Agent Skill manifest — makes this system usable as a Claude Skill. |
| `preview/` | 25 Design-System-tab cards (type, color, spacing, components, brand). |
| `ui_kits/web-app/` | High-fidelity recreation of the Dreamwall web app — JSX components + interactive `index.html`. See its own README. |
| `assets/` | Brand/visual assets — `aicdb-mark.png`, the primary logo (a polished-chrome flower medallion). |
| `fonts/` | Self-hosted **Spectral** `.ttf` files (display face), wired via `@font-face` in `colors_and_type.css`. |

### Logo / mark
The primary mark is `assets/aicdb-mark.png` — an abstract, symmetrical **chrome flower medallion**: a blooming metallic flower with pearled accents set inside a circular chrome ring, rendered in polished silver with faint iridescent blue/violet reflections like light through a prism. Use it on its own, or in a horizontal lockup beside the `Dreamwall` wordmark (coral `b`). It carries its own circular frame, so place it on dark or light backgrounds without an added container; a monochrome-silver treatment is available via CSS desaturation. For tiny placements (browser tabs, app icons) use **`assets/aicdb-favicon.png`** — a simplified app-icon tile featuring just the central flame-and-pearl motif on a dark rounded square, which stays legible down to 16–20px where the full medallion's filigree blurs. It's wired into the web-app pages via `<link rel="icon">`.

### Fonts
Display **Spectral** is **self-hosted** from `fonts/` (uploaded `.ttf` files) via `@font-face`. Body **DM Sans** and data **JetBrains Mono** load from **Google Fonts CDN** (no local files — CDN delivery is fine). To self-host those too, drop their files into `fonts/`, add `@font-face` rules, and remove them from the `@import`.

### How to use
Import the foundations and build with the variables:
```html
<link rel="stylesheet" href="colors_and_type.css">
```
```css
.card { background: var(--bg-1); border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg); box-shadow: var(--shadow-1); }
.btn-primary { background: var(--coral); color: var(--fg-on-accent); }
.score { font: var(--text-data); color: var(--score-high); }
```
