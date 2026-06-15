# Cloudflare + Cursor (AICDb)

Bu proje Cloudflare Workers üzerinde çalışır. Cursor’dan deploy ve debug için aşağıdaki bağlantıları kurun.

## 1. Cloudflare eklentisi (önerilen)

Cursor’da **bir kez**:

1. Komut paleti (`Ctrl+Shift+P`) → **“Add Plugin”** veya sohbette:
   ```
   /add-plugin cloudflare
   ```
2. Alternatif: [Cursor Marketplace → Cloudflare](https://cursor.com/marketplace?q=cloudflare)
3. **Cursor’u tamamen kapatıp yeniden açın**

İlk MCP aracı çağrısında **Cloudflare OAuth** ile giriş yapın ve izinleri onaylayın.

## 2. Proje MCP yapılandırması (hazır)

`.cursor/mcp.json` dosyası şu sunucuları içerir:

| Sunucu | Ne işe yarar |
|--------|----------------|
| `cloudflare-api` | Tüm Cloudflare API (deploy, DNS, R2, …) |
| `cloudflare-docs` | Güncel dokümantasyon |
| `cloudflare-builds` | Workers build / deploy durumu |
| `cloudflare-bindings` | KV, D1, secrets, asset binding |
| `cloudflare-observability` | Loglar ve analytics |

Kontrol: **Cursor Settings → Features → MCP** — sunucuların yanında yeşil nokta olmalı.

## 3. Wrangler CLI (terminal)

MCP’ye ek olarak yerel geliştirme ve deploy için:

```bash
npm install
npx wrangler login
npm run dev
```

Deploy:

```bash
npm run deploy
```

Worker secret’ları (production):

```bash
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_ANON_KEY
```

## 4. Supabase redirect (deploy sonrası)

Workers URL’niz `https://aicdb.<subdomain>.workers.dev` olduğunda Supabase’e ekleyin:

- Site URL: `https://aicdb.<subdomain>.workers.dev`
- Redirect: `https://aicdb.<subdomain>.workers.dev/auth/callback.html`

## 5. Cursor ipuçları

- Prompt’larda `@wrangler.jsonc` kullanın — binding’ler görünür.
- Deploy: *“AICDb Worker’ı Cloudflare’a deploy et”*
- Loglar: *“aicdb worker loglarını göster”* (observability MCP veya `wrangler tail`)

## Sorun giderme

| Sorun | Çözüm |
|-------|--------|
| MCP kırmızı | `.cursor/mcp.json` geçerli mi? Cursor’u yeniden başlatın |
| OAuth açılmıyor | Marketplace’ten Cloudflare plugin’i tekrar kurun |
| `wrangler` bulunamadı | `npm install` sonra `npx wrangler` |
| Deploy account hatası | `npx wrangler whoami` → `account_id`’yi `wrangler.jsonc` içine yazın |

Resmi rehber: [Cursor + Cloudflare](https://developers.cloudflare.com/agent-setup/cursor/)
