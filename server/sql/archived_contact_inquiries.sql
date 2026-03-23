create extension if not exists "pgcrypto";

create table if not exists public.archived_contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  original_inquiry_id uuid not null unique,
  full_name text not null,
  email text,
  inquiry_type text,
  message text,
  reply_message text,
  replied_at timestamptz,
  status text,
  created_at timestamptz,
  archived_at timestamptz not null default now()
);

alter table public.archived_contact_inquiries
  add column if not exists original_inquiry_id uuid,
  add column if not exists full_name text,
  add column if not exists email text,
  add column if not exists inquiry_type text,
  add column if not exists message text,
  add column if not exists reply_message text,
  add column if not exists replied_at timestamptz,
  add column if not exists status text,
  add column if not exists created_at timestamptz,
  add column if not exists archived_at timestamptz not null default now();

create unique index if not exists archived_contact_inquiries_original_inquiry_id_key
  on public.archived_contact_inquiries (original_inquiry_id);

alter table public.archived_contact_inquiries enable row level security;

-- NOTE: Add RLS policies based on your auth model.
