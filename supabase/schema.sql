-- Wednesday private memory schema (run in your Supabase SQL editor).
-- Row Level Security ensures each signed-in user can access only their own rows.
create table if not exists public.memory_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '',
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.memory_items enable row level security;

create policy "Users can read their own memories"
  on public.memory_items for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own memories"
  on public.memory_items for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own memories"
  on public.memory_items for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own memories"
  on public.memory_items for delete to authenticated
  using (auth.uid() = user_id);

-- Do not add a service-role key to the app. Keep RLS enabled.
