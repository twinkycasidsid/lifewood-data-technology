create extension if not exists "pgcrypto";

alter table public.contact_submissions
  add column if not exists company text,
  add column if not exists project text,
  add column if not exists industry text,
  add column if not exists status text,
  add column if not exists created_at timestamptz not null default now();

-- If "company" was turned into a generated column, convert it back to a normal text column.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'contact_submissions'
      and column_name = 'company'
      and is_generated = 'ALWAYS'
  ) then
    execute 'alter table public.contact_submissions alter column company drop expression';
  end if;
end $$;

alter table public.contact_submissions
  alter column company set not null;

alter table public.contact_submissions
  drop column if exists full_name,
  drop column if exists email,
  drop column if exists inquiry_type,
  drop column if exists message,
  drop column if exists submission_type,
  drop column if exists company_name,
  drop column if exists company_website,
  drop column if exists company_size,
  drop column if exists project_type,
  drop column if exists data_type,
  drop column if exists dataset_size,
  drop column if exists timeline,
  drop column if exists project_description;

alter table public.contact_submissions enable row level security;

-- NOTE: Recreate any required RLS policies after running this migration.
