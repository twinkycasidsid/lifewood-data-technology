-- Admin dashboard data tables
create extension if not exists "pgcrypto";
create table if not exists public.job_listings (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  department text,
  location text,
  workplace text,
  work_type text,
  posted text,
  description text,
  overview text[],
  status text not null default 'Active',
  applicants_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.job_listings add column if not exists slug text;
alter table public.job_listings add column if not exists department text;
alter table public.job_listings add column if not exists location text;
alter table public.job_listings add column if not exists workplace text;
alter table public.job_listings add column if not exists work_type text;
alter table public.job_listings add column if not exists posted text;
alter table public.job_listings add column if not exists description text;
alter table public.job_listings add column if not exists overview text[];

create unique index if not exists job_listings_slug_key on public.job_listings (slug);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  stage text,
  status text,
  score integer,
  created_at timestamptz not null default now()
);

alter table public.job_applications add column if not exists first_name text;
alter table public.job_applications add column if not exists middle_name text;
alter table public.job_applications add column if not exists last_name text;
alter table public.job_applications add column if not exists email text;
alter table public.job_applications add column if not exists phone text;
alter table public.job_applications add column if not exists gender text;
alter table public.job_applications add column if not exists age integer;
alter table public.job_applications add column if not exists country text;
alter table public.job_applications add column if not exists current_address text;
alter table public.job_applications add column if not exists position_applied text;
alter table public.job_applications add column if not exists cv_url text;
alter table public.job_applications add column if not exists ai_analysis text;
alter table public.job_applications add column if not exists ai_recommendation text;
alter table public.job_applications add column if not exists pre_screening_results text;
alter table public.job_applications add column if not exists job_id uuid;

create table if not exists public.calendly_bookings (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  invitee text,
  start_time text,
  end_time text,
  location text,
  meeting_url text,
  status text,
  created_at timestamptz not null default now()
);

alter table public.calendly_bookings
  add column if not exists location text,
  add column if not exists meeting_url text;

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  project text,
  industry text,
  status text,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions
  add column if not exists full_name text,
  add column if not exists work_email text,
  add column if not exists company_website text,
  add column if not exists company_size text,
  add column if not exists data_type text,
  add column if not exists dataset_size text,
  add column if not exists timeline text,
  add column if not exists project_description text;

create table if not exists public.admin_activity_logs (
  id uuid primary key default gen_random_uuid(),
  activity text not null,
  actor text,
  created_at timestamptz not null default now()
);

alter table public.job_listings enable row level security;
alter table public.job_applications enable row level security;
alter table public.calendly_bookings enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.admin_activity_logs enable row level security;

-- NOTE: Add RLS policies based on your auth model.
