-- db/01_schema.sql
-- Schema for ChoreMate (Cairo project for Kent)

create extension if not exists "uuid-ossp";

-- USERS
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  full_name text,
  created_at timestamptz not null default now()
);

-- HOUSEHOLDS
create table if not exists households (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz not null default now()
);

-- HOUSEHOLD MEMBERS (M:N user <-> household)
create table if not exists household_members (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid not null references households(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text default 'member', -- admin / member
  unique (household_id, user_id)
);

-- CHORES
create table if not exists chores (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid not null references households(id) on delete cascade,
  name text not null,
  description text,
  frequency text, -- daily, weekly, monthly
  created_at timestamptz not null default now()
);

-- CHORE ASSIGNMENTS
create table if not exists chore_assignments (
  id uuid primary key default uuid_generate_v4(),
  chore_id uuid not null references chores(id) on delete cascade,
  assigned_to uuid references users(id) on delete set null,
  due_date date not null,
  status text default 'pending', -- pending / completed / missed
  created_at timestamptz not null default now()
);
