-- Profiles table to store roles linked to Supabase Auth users.
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can view their own profile.
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile (excluding role).
create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);
