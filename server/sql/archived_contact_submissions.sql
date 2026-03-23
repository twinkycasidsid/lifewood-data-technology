create extension if not exists "pgcrypto";

create table if not exists public.archived_contact_submissions (
  id uuid primary key default gen_random_uuid(),
  original_submission_id uuid not null unique,
  company text not null,
  project text,
  industry text,
  status text,
  created_at timestamptz,
  full_name text,
  work_email text,
  company_website text,
  company_size text,
  data_type text,
  dataset_size text,
  timeline text,
  project_description text,
  archived_at timestamptz not null default now()
);

alter table public.archived_contact_submissions
  add column if not exists original_submission_id uuid,
  add column if not exists company text,
  add column if not exists project text,
  add column if not exists industry text,
  add column if not exists status text,
  add column if not exists created_at timestamptz,
  add column if not exists full_name text,
  add column if not exists work_email text,
  add column if not exists company_website text,
  add column if not exists company_size text,
  add column if not exists data_type text,
  add column if not exists dataset_size text,
  add column if not exists timeline text,
  add column if not exists project_description text,
  add column if not exists archived_at timestamptz not null default now();

create unique index if not exists archived_contact_submissions_original_submission_id_key
  on public.archived_contact_submissions (original_submission_id);

alter table public.archived_contact_submissions enable row level security;

-- NOTE: Add RLS policies based on your auth model.
