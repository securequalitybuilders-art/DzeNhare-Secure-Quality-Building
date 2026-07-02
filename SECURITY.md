# Security Notes

## Admin access model

DzeNhare admin access currently uses Supabase email/password authentication plus a hard allowlist.

Server-side checks happen in protected admin pages through `getAdminUser()` from:

- `lib/admin-auth.js`

The allowlist lives in:

- `lib/admin-config.js`

The SQL RLS allowlist lives in:

- `supabase_auth_upgrade.sql`

Keep these aligned until the allowlist is moved into a database-backed admin users table.

## Service-role key handling

`SUPABASE_SERVICE_ROLE_KEY` is required for privileged server-side reads and updates. It must never be exposed to browser code.

Safe usage:

- server actions
- server components
- server-only helper functions
- deployment platform secret manager

Unsafe usage:

- client components
- `NEXT_PUBLIC_*` variables
- committed `.env.local`
- browser-accessible API responses

## RLS stance

Production RLS should permit:

- anonymous inserts into `intake_submissions`
- authenticated allowlisted admin select/update on `intake_submissions`
- authenticated allowlisted admin select/insert on `intake_submissions_activity`

Production RLS should block:

- anonymous select of submissions
- anonymous update of submissions
- anonymous access to activity history

## Activity history

Admin lead saves append activity events to:

- `intake_submissions_activity`

This gives DzeNhare a timeline of who changed what and when. For a stricter future version, move audit logging into database triggers so activity logging cannot be bypassed by application bugs.

## Known hardening backlog

1. Replace hardcoded allowlist with `admin_users` table and RLS helper function.
2. Add Supabase MFA for admin accounts.
3. Improve middleware session refresh/validation beyond cookie-presence gating.
4. Add rate limiting to public intake submissions.
5. Add bot protection to public intake form.
6. Remove local JSON fallback in production deployments.
7. Add database trigger-backed audit logging.
8. Plan Next 16 migration when runtime supports Node `>=20.9.0`.
