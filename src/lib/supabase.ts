import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.js';

const url = import.meta.env?.SUPABASE_URL ?? process.env.SUPABASE_URL;
const key =
  import.meta.env?.SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env?.SUPABASE_ANON_KEY ??
  process.env.SUPABASE_PUBLISHABLE_KEY ??
  process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error('Missing SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY (or SUPABASE_ANON_KEY)');
}

export const supabase = createClient<Database>(url, key);
