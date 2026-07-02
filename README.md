# DzeNhare Next.js Prototype

## Intake submission persistence
The prototype intake form now persists submissions locally to:

`data/intake-submissions.json`

Each entry includes:
- id
- name
- email
- role
- details
- submittedAt

## Supabase integration
Environment variables are expected in:

`.env.local`

Current variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_TABLE`
- `SUPABASE_SERVICE_ROLE_KEY`

A starter schema is included in:
- `supabase_schema.sql`
- `supabase_auth_upgrade.sql`

Current behavior:
- submissions are attempted in Supabase first
- submissions are also stored locally in `data/intake-submissions.json`
- if Supabase insert fails, local persistence still succeeds

## Admin auth
The admin route now uses Supabase email/password auth, middleware checks for a Supabase auth cookie, and the server verifies the live Supabase user session before rendering protected data.

Expected admin emails:
- `bradleymugiyo@gmail.com`
- `securequalitybuilders@gmail.com`

Current admin routes:
- `/admin/login`
- `/admin/submissions`
- `/admin/submissions/[id]`

Current behavior:
- middleware checks for a Supabase auth cookie before allowing `/admin/*`
- login page signs in via Supabase auth
- protected admin page verifies the actual Supabase user server-side
- only allowlisted admin emails are permitted
- admin data reads now prefer a server-side service-role fetch
- local JSON remains the fallback if privileged admin reads are unavailable

### Lead management features
- role filtering
- text search across name, email, role, details, status, notes, source, id, and activity history
- CSV export of the currently filtered result set
- editable status values
- editable internal admin notes
- save action for lead updates
- visible source mode / fallback warning in the admin UI
- append-only activity history per lead
- dedicated lead detail page with full timeline
- audit trail showing who changed what and when

## Activity history
A new Supabase table is now expected:

`intake_submissions_activity`

Each admin update appends an activity event with:
- submission_id
- event_type
- actor_email
- created_at
- summary
- status_from
- status_to
- notes_before
- notes_after
- metadata

The admin submissions screen now loads and displays history per lead. Each row links to `/admin/submissions/[id]`, a dedicated lead detail page with editable pipeline status, internal notes, and the full activity timeline.

## Required setup
1. Copy `.env.example` to `.env.local` and fill in the real Supabase values.
2. In Supabase Auth, create the allowed admin users with email/password.
3. Run `supabase_schema.sql` if you have not already.
4. Run `supabase_auth_upgrade.sql` to create the activity table and enforce admin-only read/update access.
5. Add your real `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` or your deployment secret manager.
6. If your table already exists, make sure `status`, `notes`, `updated_at`, and `updated_by` columns are added.

## Production readiness
Before launch, read:

- `PRODUCTION_READINESS.md`
- `SECURITY.md`

## Deployment
A Vercel config is included in:

- `vercel.json`

Required Vercel environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_TABLE`
- `SUPABASE_SERVICE_ROLE_KEY`

## Notes
- This is materially stronger than the earlier app-managed cookie gate.
- Admin session identity is verified server-side.
- Admin authorization now prefers the database-backed `admin_users` table, with the code allowlist only as a local fallback.
- Admin reads are now designed to use a privileged server path instead of relying on public anon reads.
- Activity logging is now enforced by a database trigger when the updated SQL is applied.
- The intake form includes a local rate limit, honeypot field, and simple spam-content checks.
