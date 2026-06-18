# Dreamwall — Database Migrations

## The Rule

**Every schema or RLS change must be a new committed `.sql` migration file applied to Supabase.**  
Never make untracked manual changes in the Supabase Dashboard SQL editor without immediately capturing them here.

---

## File Naming

```
YYYYMMDDHHMMSS_short_description.sql
```

Examples:
- `20260618000000_add_follows_table.sql`
- `20260618000001_rls_follows.sql`
- `20260619120000_add_originality_score_to_ratings.sql`

The timestamp prefix ensures migrations are applied in the correct order.  
The first two files (`00000000_*`, `00000001_*`) are the authoritative initial snapshot of the schema as it existed on 2026-06-18 — they are the source of truth if the Supabase project ever needs to be rebuilt from scratch.

---

## Migration Files

| File | Description |
|---|---|
| `00000000_initial_schema.sql` | Complete schema snapshot: enums, tables, indexes, functions, triggers, views, storage bucket |
| `00000001_rls_policies.sql` | All RLS policies for every table + `storage.objects` |
| `20250601000000_drop_legacy_prototype.sql` | Dropped old prototype tables |
| `20250601000003_security_hardening.sql` | security_invoker views, search_path hardening |
| `20260617000001_profile_rich_fields.sql` | Added banner_url, quote, quote_from to profiles |
| `20260617000002_backfill_missing_profiles.sql` | Backfilled profiles rows for users missing trigger-created rows |

---

## How to Apply a Migration

### Option A — Supabase MCP (from Cursor Agent)
```
use the apply_migration MCP tool with project_id and the SQL content
```

### Option B — Supabase Dashboard
1. Open **SQL Editor** in the Supabase Dashboard
2. Paste the migration SQL
3. Click **Run**
4. Commit the file to the repo

### Option C — Supabase CLI
```bash
# Link to project (first time)
supabase link --project-ref zvvkejehuludrsabsesd

# Push all pending migrations
supabase db push

# Or apply a specific file
supabase db query --file supabase/migrations/20260618000000_my_change.sql
```

---

## How to Create a New Migration

1. **Write the SQL** in a new file with a timestamped name.
2. **Test it** against the live project with `execute_sql` (MCP) or the Dashboard SQL editor.
3. **Review security**: if the change involves functions, views, or RLS, go through the [Supabase security checklist](https://supabase.com/docs/guides/security/product-security).
4. **Commit the file** to the repo in the same PR as the code that depends on it.
5. **Apply it** to the live Supabase project via one of the methods above.

> **NEVER** apply a schema change without a corresponding migration file in this folder.  
> **NEVER** edit `00000000_initial_schema.sql` or `00000001_rls_policies.sql` after the fact — write a new migration instead.

---

## Key Design Notes

- **Rating scale**: `visuals`, `sound_design`, `script` are `numeric(2,1)` — values **0.0 to 5.0 in 0.5 steps** (validated by `is_half_step_rating()`).  The UI must convert to/from this scale before writing to the DB.
- **`main_score`**: a `GENERATED ALWAYS AS` column — `round((visuals + sound_design + script) / 3.0, 2)`. Never set it directly.
- **`is_admin`**: lives in `profiles`, not `auth.users.user_metadata`. Never use `user_metadata` for authorization.
- **`handle_new_user`**: a `SECURITY DEFINER` trigger function on `auth.users`. Creates the `profiles` row on sign-up. Do not remove it.
- **`is_admin()` function**: used directly in RLS policies. `SECURITY DEFINER` to avoid RLS recursion.
- **`content_stats`**: maintained by triggers — never write to it directly from the app.
- **Views (`homepage_trending`, `homepage_newest`)**: use `security_invoker = true` so the caller's RLS is applied.
