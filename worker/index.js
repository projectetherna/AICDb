/**
 * Serves static assets and injects Supabase public config (no secrets in the repo).
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/config.js') {
      const config = {
        supabaseUrl: env.SUPABASE_URL ?? '',
        supabaseAnonKey: env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY || '',
      };

      return new Response(`window.__AICDB_CONFIG__=${JSON.stringify(config)};`, {
        headers: {
          'content-type': 'application/javascript; charset=utf-8',
          'cache-control': 'no-store',
        },
      });
    }

    let response = await env.ASSETS.fetch(request);

    if (response.status === 404 && !url.pathname.includes('.')) {
      const fallback = await env.ASSETS.fetch(new URL('/index.html', url.origin));
      if (fallback.ok) response = fallback;
    }

    return response;
  },
};
