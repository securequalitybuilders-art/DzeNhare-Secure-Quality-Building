create table if not exists public.admin_users (
  email text primary key,
  role text not null default 'admin',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by text
);

create table if not exists public.intake_submissions (
  id text primary key,
  name text not null,
  email text not null,
  role text not null,
  details text not null,
  status text not null default 'new',
  notes text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz,
  updated_by text
);

create table if not exists public.intake_submissions_activity (
  id text primary key,
  submission_id text not null references public.intake_submissions(id) on delete cascade,
  event_type text not null,
  actor_email text,
  created_at timestamptz not null default now(),
  summary text,
  status_from text,
  status_to text,
  notes_before text,
  notes_after text,
  metadata jsonb
);

create index if not exists intake_submissions_activity_submission_id_idx
  on public.intake_submissions_activity(submission_id, created_at desc);

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where email = lower(auth.jwt() ->> 'email')
      and active = true
  );
$$;

create or replace function public.log_intake_submission_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor text;
  changed_summary text;
begin
  actor := coalesce(new.updated_by, auth.jwt() ->> 'email', 'system');

  if coalesce(old.status, '') is distinct from coalesce(new.status, '')
     or coalesce(old.notes, '') is distinct from coalesce(new.notes, '') then

    changed_summary := concat_ws(
      ' · ',
      case when coalesce(old.status, '') is distinct from coalesce(new.status, '')
        then 'Status changed from ' || coalesce(old.status, '—') || ' to ' || coalesce(new.status, '—')
      end,
      case when coalesce(old.notes, '') is distinct from coalesce(new.notes, '')
        then case when coalesce(old.notes, '') = '' then 'Notes added' else 'Notes updated' end
      end
    );

    insert into public.intake_submissions_activity (
      id,
      submission_id,
      event_type,
      actor_email,
      created_at,
      summary,
      status_from,
      status_to,
      notes_before,
      notes_after,
      metadata
    ) values (
      'activity_db_' || extract(epoch from clock_timestamp())::bigint || '_' || substr(md5(random()::text), 1, 8),
      new.id,
      'lead_updated_db_trigger',
      actor,
      coalesce(new.updated_at, now()),
      changed_summary,
      old.status,
      new.status,
      old.notes,
      new.notes,
      jsonb_build_object('source', 'database_trigger')
    );
  end if;

  return new;
end;
$$;

alter table public.admin_users enable row level security;
alter table public.intake_submissions enable row level security;
alter table public.intake_submissions_activity enable row level security;

create policy "Allow anon inserts on intake_submissions"
on public.intake_submissions
for insert
to anon
with check (true);
