# Dreamwall — Web App UI Kit

A high-fidelity, interactive recreation of the Dreamwall web app (discovery + ratings). These are **cosmetic, modular components** — not production code — built to be pieced together into mockups and prototypes.

Open `index.html` for the click-through prototype:
- **Discover** — featured hero + rows of film cards (top rated, new & trending, shorts & verticals).
- **Browse** — Films / Series / Lists views (filtered grids).
- **Search** — type in the nav bar to filter titles, creators, genres live.
- **Film detail** — backdrop, poster, Score ring, **interactive star rating** (click to rate), watchlist toggle, reviews with likes.

## Files
| File | Exports | Notes |
|---|---|---|
| `data.js` | `AICDB_TYPES`, `AICDB_FILMS`, `AICDB_REVIEWS` | Sample catalog (fictional titles). Posters are CSS gradients — drop in real images later. |
| `Primitives.jsx` | `Icon`, `Logo`, `Button`, `ContentBadge`, `StarRating`, `ScoreRing`, `Avatar`, `scoreColor` | Shared building blocks. `Icon` wraps Phosphor; `Logo` uses `assets/aicdb-mark.png`. |
| `NavBar.jsx` | `NavBar` | Sticky translucent top nav. |
| `FilmCard.jsx` | `FilmCard`, `FilmRow` | Minimal YTS-style card: poster only, hover reveals score + type badge. |
| `Discover.jsx` | `Discover`, `Hero` | Home screen. |
| `FilmDetail.jsx` | `FilmDetail`, `ReviewItem` | Title page + reviews. |
| `App.jsx` | mounts `<App/>` | Routing + search/browse state. |

## Conventions
- All color/type/spacing comes from the root `../../colors_and_type.css` variables — no hard-coded hexes except poster gradients.
- Each `.jsx` file exports its components to `window` (Babel scripts don't share scope otherwise).
- Icons are Phosphor (Fill/Bold) via jsDelivr stylesheets loaded in `index.html`.

## Coverage / cut corners
Recreates the core discovery + rating loop and detail page. Omitted (intentionally, as no source product was provided): auth, account/settings, list-builder, real data, and pagination. Posters/backdrops are gradient placeholders.
