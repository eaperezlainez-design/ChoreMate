-- db/02_seed.sql
-- Seed data for ChoreMate (Cairo project for Kent)

-- USERS
insert into users (email, full_name) values
  ('alice@example.com', 'Alice Johnson'),
  ('bob@example.com', 'Bob Martinez')
on conflict (email) do nothing;

-- HOUSEHOLD
insert into households (name) values
  ('Campus Apartment')
on conflict (name) do nothing;

-- HOUSEHOLD MEMBERS
insert into household_members (household_id, user_id, role)
select h.id, u.id, 'member'
from households h, users u
where h.name = 'Campus Apartment';

-- CHORES
insert into chores (household_id, name, description, frequency)
select h.id,
  'Take out trash',
  'Remove trash bags and place in outside bin',
  'weekly'
from households h
where h.name = 'Campus Apartment';

insert into chores (household_id, name, description, frequency)
select h.id,
  'Wash dishes',
  'Wash all dirty dishes in the sink',
  'daily'
from households h
where h.name = 'Campus Apartment';

insert into chores (household_id, name, description, frequency)
select h.id,
  'Vacuum living room',
  'Vacuum carpet and remove dust',
  'weekly'
from households h
where h.name = 'Campus Apartment';

-- CHORE ASSIGNMENTS
-- Assign trash chore to Alice
insert into chore_assignments (chore_id, assigned_to, due_date, status)
select c.id, u.id, current_date + interval '1 day', 'pending'
from chores c
join users u on u.email = 'alice@example.com'
where c.name = 'Take out trash';

-- Assign dishes chore to Bob
insert into chore_assignments (chore_id, assigned_to, due_date, status)
select c.id, u.id, current_date, 'pending'
from chores c
join users u on u.email = 'bob@example.com'
where c.name = 'Wash dishes';
