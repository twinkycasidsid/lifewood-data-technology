create extension if not exists "pgcrypto";

create table if not exists public.archived_job_listings (
  id uuid primary key default gen_random_uuid(),
  original_listing_id uuid not null unique,
  slug text,
  title text not null,
  department text,
  location text,
  workplace text,
  work_type text,
  posted text,
  description text,
  overview text[],
  status text,
  applicants_count integer,
  created_at timestamptz,
  archived_at timestamptz not null default now()
);

alter table public.archived_job_listings
  add column if not exists original_listing_id uuid,
  add column if not exists slug text,
  add column if not exists title text,
  add column if not exists department text,
  add column if not exists location text,
  add column if not exists workplace text,
  add column if not exists work_type text,
  add column if not exists posted text,
  add column if not exists description text,
  add column if not exists overview text[],
  add column if not exists status text,
  add column if not exists applicants_count integer,
  add column if not exists created_at timestamptz,
  add column if not exists archived_at timestamptz not null default now();

create unique index if not exists archived_job_listings_original_listing_id_key
  on public.archived_job_listings (original_listing_id);

alter table public.archived_job_listings enable row level security;

-- NOTE: Add RLS policies based on your auth model.
