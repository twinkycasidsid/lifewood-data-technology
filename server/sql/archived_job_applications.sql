create extension if not exists "pgcrypto";

create table if not exists public.archived_job_applications (
  id uuid primary key default gen_random_uuid(),
  original_application_id uuid not null unique,
  name text not null,
  role text,
  stage text,
  status text,
  score integer,
  created_at timestamptz,
  first_name text,
  middle_name text,
  last_name text,
  email text,
  phone text,
  gender text,
  age integer,
  country text,
  current_address text,
  position_applied text,
  cv_url text,
  ai_analysis text,
  ai_recommendation text,
  pre_screening_results text,
  job_id uuid,
  archived_at timestamptz not null default now()
);

alter table public.archived_job_applications
  add column if not exists original_application_id uuid,
  add column if not exists name text,
  add column if not exists role text,
  add column if not exists stage text,
  add column if not exists status text,
  add column if not exists score integer,
  add column if not exists created_at timestamptz,
  add column if not exists first_name text,
  add column if not exists middle_name text,
  add column if not exists last_name text,
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists gender text,
  add column if not exists age integer,
  add column if not exists country text,
  add column if not exists current_address text,
  add column if not exists position_applied text,
  add column if not exists cv_url text,
  add column if not exists ai_analysis text,
  add column if not exists ai_recommendation text,
  add column if not exists pre_screening_results text,
  add column if not exists job_id uuid,
  add column if not exists archived_at timestamptz not null default now();

create unique index if not exists archived_job_applications_original_application_id_key
  on public.archived_job_applications (original_application_id);

alter table public.archived_job_applications enable row level security;

-- NOTE: Add RLS policies based on your auth model.
