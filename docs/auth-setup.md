# Auth setup (Supabase + Cloudflare Workers)

## Run locally

```bash
cp .dev.vars.example .dev.vars   # if needed
npm install
npm run dev
```

Open http://localhost:8787

## Supabase Dashboard

### 1. URL configuration

**Authentication → URL Configuration**

| Setting | Value (local) |
|---------|----------------|
| Site URL | `http://localhost:8787` |
| Redirect URLs | `http://localhost:8787/auth/callback.html` |

Add production URLs when you deploy (e.g. `https://aicdb.yourdomain.com/auth/callback.html`).

### 2. Email auth

**Authentication → Providers → Email** — enabled (default).

If **Confirm email** is on, new sign-ups must click the link before signing in.

### 3. Google OAuth

**Authentication → Providers → Google** — enable and add Client ID / Secret from [Google Cloud Console](https://console.cloud.google.com/).

Authorized redirect URI in Google must include:

```
https://zvvkejehuludrsabsesd.supabase.co/auth/v1/callback
```

Supabase handles the Google redirect; your app only uses `/auth/callback.html` as the final `redirectTo`.

## Deploy (Cloudflare)

```bash
npm run deploy
```

Set secrets in the Cloudflare dashboard (or `wrangler secret put`):

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` (or `SUPABASE_PUBLISHABLE_KEY`)

Update Supabase redirect URLs with your Workers URL.
