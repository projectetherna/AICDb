# AICDb

Discovery and rating platform for **AI-generated** films and series — community-driven, free, and open.

- **Ratings:** Visuals, Sound Design, Script (0–5, half-stars) → averaged main score
- **Social:** profiles, comments, watchlist, submissions
- **Catalog:** films + series (seasons/episodes), embed or external link only (no uploads)
- **Homepage:** engagement ranking + newest

## Stack

| Layer | Tech |
|-------|------|
| Database & auth | [Supabase](https://zvvkejehuludrsabsesd.supabase.co) |
| Hosting | Cloudflare Workers |
| Repo | [github.com/projectetherna/aicdb](https://github.com/projectetherna/aicdb) |

## Database setup

Schema lives in `supabase/migrations/`. See **[docs/database.md](docs/database.md)** for the full model, RLS, and how to apply migrations.

```bash
supabase link --project-ref zvvkejehuludrsabsesd
supabase db push
```

## Run the app

```bash
npm install
npm run dev
```

→ http://localhost:8787 (login, signup, Google OAuth, homepage)

See **[docs/auth-setup.md](docs/auth-setup.md)** for Supabase redirect URLs and Google OAuth.

## Cloudflare + Cursor

MCP ve plugin ayarları hazır: **[docs/cloudflare-cursor.md](docs/cloudflare-cursor.md)**

1. Cursor’da `/add-plugin cloudflare` veya Marketplace
2. Cursor’u yeniden başlat → Cloudflare OAuth
3. `npx wrangler login` → `npm run deploy`

## Status

- [x] Database schema live on Supabase (`aicdb` project)
- [x] RLS + security hardening
- [x] Auth UI (email + Google) on Cloudflare Workers
- [ ] Full homepage / discover from database
- [ ] Content pages & submission flow

## Local env

Workers use **`.dev.vars`** (copy from `.dev.vars.example`). Keys are injected at `/config.js` — never commit `.dev.vars`.

## License

Open — specify license in a follow-up commit (e.g. MIT / AGPL).
