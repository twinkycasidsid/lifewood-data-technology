create extension if not exists "pgcrypto";

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  inquiry_type text not null,
  message text not null,
  reply_message text,
  replied_at timestamptz,
  status text not null default 'New',
  created_at timestamptz not null default now()
);

alter table public.contact_inquiries
  add column if not exists reply_message text,
  add column if not exists replied_at timestamptz;

alter table public.contact_inquiries enable row level security;

-- NOTE: Add RLS policies based on your auth model.
