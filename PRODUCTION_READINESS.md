# DzeNhare Production Readiness Checklist

This checklist is the deployment gate for the DzeNhare Next.js build.

DzeNhare is not a generic construction website. It is the decision-control and financial operating system for construction in Zimbabwe. Production readiness must protect the trust claim: proof before payment, admin accountability, and no casual data exposure.

## 1. Environment and secrets

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_TABLE`
- `SUPABASE_SERVICE_ROLE_KEY`

Rules:

- `.env.local` must never be committed.
- `SUPABASE_SERVICE_ROLE_KEY` must only exist server-side.
- Rotate the service-role key if it has ever been pasted into an unsafe location.
- Use platform secret management on deployment, not plaintext files.

Reference file:

- `.env.example`

## 2. Supabase database setup

Run these SQL files in Supabase SQL editor, in order:

1. `supabase_schema.sql`
2. `supabase_auth_upgrade.sql`

Expected tables:

- `public.intake_submissions`
- `public.intake_submissions_activity`

Expected `intake_submissions` columns:

- `id`
- `name`
- `email`
- `role`
- `details`
- `status`
- `notes`
- `submitted_at`
- `updated_at`
- `updated_by`

Expected `intake_submissions_activity` columns:

- `id`
- `submission_id`
- `event_type`
- `actor_email`
- `created_at`
- `summary`
- `status_from`
- `status_to`
- `notes_before`
- `notes_after`
- `metadata`

## 3. Supabase RLS policy gate

Required policy posture:

- Public anonymous users may insert intake submissions.
- Public anonymous users must not select submissions.
- Only authenticated allowlisted admins may read submissions.
- Only authenticated allowlisted admins may update submissions.
- Only authenticated allowlisted admins may read activity history.
- Only authenticated allowlisted admins may append activity history.

Current allowlist is duplicated in:

- `lib/admin-config.js`
- `supabase_auth_upgrade.sql`

Before production, replace placeholder emails:

- `bradleymugiyo@gmail.com`
- `securequalitybuilders@gmail.com`

with real operational admin emails.

## 4. Supabase Auth setup

Required:

- Enable email/password auth.
- Create admin users for every allowlisted email.
- Disable open signups unless there is a deliberate invite process.
- Require strong passwords.
- Prefer MFA if Supabase plan supports it.

Admin routes:

- `/admin/login`
- `/admin/submissions`
- `/admin/submissions/[id]`

## 5. Admin behavior to test

Before launch, verify:

- Non-admin users are blocked from `/admin/submissions`.
- Non-admin users are blocked from `/admin/submissions/[id]`.
- Admin users can sign in.
- Admin users can sign out.
- Admin submissions load from Supabase.
- Fallback warning appears if Supabase service-role access is unavailable.
- Admin can update lead status.
- Admin can update internal notes.
- Every save appends a timeline event.
- Detail page timeline updates after save.
- CSV export works on filtered submissions.

## 6. Build and quality gate

Run before deployment:

```bash
npm install
npm run lint
npm run build
```

Current verified baseline:

- Next.js `14.2.35`
- React `18.3.1`
- App Router build passes
- ESLint passes

## 7. Deployment notes

Recommended deployment path:

- Vercel or another Node-compatible host
- Node runtime compatible with Next `14.2.35`
- Environment variables configured in deployment dashboard
- Preview deployments protected or connected to non-production Supabase project

Do not deploy with:

- placeholder `SUPABASE_SERVICE_ROLE_KEY`
- unapproved admin emails
- anon select policy still active
- untested SQL migrations

## 8. Known limitations before enterprise-grade production

These are acceptable for controlled prototype/pilot, but should be addressed for serious production use:

1. Middleware checks for the Supabase auth cookie presence, while protected pages perform the stronger server-side session verification.
2. Admin allowlist is maintained in code and SQL, not in a dedicated admin table.
3. Intake form still permits anonymous inserts by design.
4. Local JSON backup exists for prototype resilience, but production should use managed persistence only.
5. Activity history is append-only at application level; database triggers could make it harder to bypass.
6. Next 16 migration should be planned separately when Node `>=20.9.0` is available.

## 9. Final launch gate

Launch only when all of these are true:

- [ ] Real Supabase service-role key is configured server-side.
- [ ] Approved admin emails are configured in code fallback, SQL seed, and Supabase Auth.
- [ ] Admin users exist in Supabase Auth.
- [ ] SQL migrations have been run successfully.
- [ ] Anonymous select is removed.
- [ ] Lint passes.
- [ ] Build passes.
- [ ] Admin lead update creates timeline event.
- [ ] `/admin/submissions/[id]` renders full lead timeline.
- [ ] No secrets are committed.
