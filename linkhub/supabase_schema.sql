-- LinkHub Supabase Schema (Idempotent/Flexible)
-- =====================================
-- Tumbuh Ide - Linktree Clone
--
-- Jalankan di Supabase SQL editor (bisa diulang tanpa error policy exists)

-- 1. USERS TABLE (linked to auth.users)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  username text unique,
  account_type text check (account_type in ('brand', 'creator')) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. PROFILES TABLE
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  display_name text not null,
  bio text,
  avatar_url text,
  background_image text,
  theme_color text default '#000000',
  custom_domain text,
  is_public boolean default true,
  seo_title text,
  seo_description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. LINKS TABLE
create table if not exists links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  url text not null,
  description text,
  thumbnail_url text,
  is_active boolean default true,
  click_count integer default 0,
  order_index integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 4. PORTFOLIO ITEMS (CREATOR ONLY)
create table if not exists portfolio_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  description text,
  image_url text,
  project_url text,
  category text,
  technologies text[],
  order_index integer default 0,
  is_featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 5. ANALYTICS TABLE
create table if not exists analytics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  link_id uuid references links(id) on delete cascade,
  visitor_ip text,
  user_agent text,
  referrer text,
  country text,
  created_at timestamp with time zone default now()
);

-- 6. INDEXES
create unique index if not exists idx_users_username on users(username);
create unique index if not exists idx_users_email on users(email);
create index if not exists idx_profiles_user_id on profiles(user_id);
create index if not exists idx_links_user_id on links(user_id);
create index if not exists idx_portfolio_user_id on portfolio_items(user_id);
create index if not exists idx_analytics_user_id on analytics(user_id);

-- 7. RLS (Row Level Security) POLICIES
-- Enable RLS for all tables
alter table users enable row level security;
alter table profiles enable row level security;
alter table links enable row level security;
alter table portfolio_items enable row level security;
alter table analytics enable row level security;

-- 8. DROP ALL POLICIES (so this file is idempotent)
do $$
begin
  -- USERS
  if exists (select 1 from pg_policies where policyname = 'Users: Self read' and tablename = 'users') then
    execute 'drop policy "Users: Self read" on users';
  end if;
  if exists (select 1 from pg_policies where policyname = 'Users: Self update' and tablename = 'users') then
    execute 'drop policy "Users: Self update" on users';
  end if;
  if exists (select 1 from pg_policies where policyname = 'Users: Self insert' and tablename = 'users') then
    execute 'drop policy "Users: Self insert" on users';
  end if;
  -- PROFILES
  if exists (select 1 from pg_policies where policyname = 'Profiles: Self read' and tablename = 'profiles') then
    execute 'drop policy "Profiles: Self read" on profiles';
  end if;
  if exists (select 1 from pg_policies where policyname = 'Profiles: Self update' and tablename = 'profiles') then
    execute 'drop policy "Profiles: Self update" on profiles';
  end if;
  if exists (select 1 from pg_policies where policyname = 'Profiles: Public read' and tablename = 'profiles') then
    execute 'drop policy "Profiles: Public read" on profiles';
  end if;
  if exists (select 1 from pg_policies where policyname = 'Profiles: Self insert' and tablename = 'profiles') then
    execute 'drop policy "Profiles: Self insert" on profiles';
  end if;
  -- LINKS
  if exists (select 1 from pg_policies where policyname = 'Links: Self all' and tablename = 'links') then
    execute 'drop policy "Links: Self all" on links';
  end if;
  if exists (select 1 from pg_policies where policyname = 'Links: Public read' and tablename = 'links') then
    execute 'drop policy "Links: Public read" on links';
  end if;
  if exists (select 1 from pg_policies where policyname = 'Links: Self insert' and tablename = 'links') then
    execute 'drop policy "Links: Self insert" on links';
  end if;
  -- PORTFOLIO
  if exists (select 1 from pg_policies where policyname = 'Portfolio: Self all' and tablename = 'portfolio_items') then
    execute 'drop policy "Portfolio: Self all" on portfolio_items';
  end if;
  if exists (select 1 from pg_policies where policyname = 'Portfolio: Public read' and tablename = 'portfolio_items') then
    execute 'drop policy "Portfolio: Public read" on portfolio_items';
  end if;
  if exists (select 1 from pg_policies where policyname = 'Portfolio: Self insert' and tablename = 'portfolio_items') then
    execute 'drop policy "Portfolio: Self insert" on portfolio_items';
  end if;
  -- ANALYTICS
  if exists (select 1 from pg_policies where policyname = 'Analytics: Self read' and tablename = 'analytics') then
    execute 'drop policy "Analytics: Self read" on analytics';
  end if;
  if exists (select 1 from pg_policies where policyname = 'Analytics: Self insert' and tablename = 'analytics') then
    execute 'drop policy "Analytics: Self insert" on analytics';
  end if;
end $$;

-- 9. CREATE POLICIES (safe to re-run)
-- USERS: Only allow user to see/update/insert their own row
create policy "Users: Self read" on users
  for select using (auth.uid()::uuid = id);
create policy "Users: Self update" on users
  for update using (auth.uid()::uuid = id);
create policy "Users: Self insert" on users
  for insert with check (auth.uid()::uuid = id);

-- PROFILES: Only owner can read/update/insert
create policy "Profiles: Self read" on profiles
  for select using (auth.uid()::uuid = user_id);
create policy "Profiles: Self update" on profiles
  for update using (auth.uid()::uuid = user_id);
create policy "Profiles: Self insert" on profiles
  for insert with check (auth.uid()::uuid = user_id);

-- PROFILES: Public read
create policy "Profiles: Public read" on profiles
  for select using (is_public = true);

-- LINKS: Only owner can CRUD/insert
create policy "Links: Self all" on links
  for all using (auth.uid()::uuid = user_id);
create policy "Links: Self insert" on links
  for insert with check (auth.uid()::uuid = user_id);

-- LINKS: Public read
create policy "Links: Public read" on links
  for select using (is_active = true);

-- PORTFOLIO: Only owner can CRUD/insert
create policy "Portfolio: Self all" on portfolio_items
  for all using (auth.uid()::uuid = user_id);
create policy "Portfolio: Self insert" on portfolio_items
  for insert with check (auth.uid()::uuid = user_id);

-- PORTFOLIO: Public read
create policy "Portfolio: Public read" on portfolio_items
  for select using (is_featured = true);

-- ANALYTICS: Only owner can read/insert
create policy "Analytics: Self read" on analytics
  for select using (auth.uid()::uuid = user_id);
create policy "Analytics: Self insert" on analytics
  for insert with check (auth.uid()::uuid = user_id);

-- 10. (Optional) Admin role can access all
-- You can add a role/claim check for admin if needed
-- Example:
-- create policy "Admin: Full access" on users
--   for all using (auth.role() = 'service_role');

-- END OF SCHEMA