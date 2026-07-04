-- Hub schema: clients, projects, demandas
-- Admin (agency) users are managed via Supabase Auth directly (auth.users).
-- Client users are also Supabase Auth users, linked 1:1 to a row in `clients`
-- via `clients.auth_user_id`, so the Portal app can authenticate them with
-- the same Supabase project and RLS can scope their access to their own data.

create extension if not exists "pgcrypto";

create type demanda_status as enum (
  'aberta',
  'em_andamento',
  'aguardando_aprovacao',
  'aprovada_ajustes',
  'concluida'
);

create type projeto_status as enum (
  'planejamento',
  'em_andamento',
  'pausado',
  'concluido'
);

create type demanda_prioridade as enum ('baixa', 'media', 'alta', 'urgente');

-- Clients (companies/people the agency works for)
create table clients (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users (id) on delete set null,
  name text not null,
  company text,
  email text not null,
  phone text,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index clients_auth_user_id_idx on clients (auth_user_id) where auth_user_id is not null;

-- Projects, one client can have many
create table projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  name text not null,
  description text,
  status projeto_status not null default 'planejamento',
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_client_id_idx on projects (client_id);

-- Demandas (work requests), can optionally be tied to a project
create table demandas (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  project_id uuid references projects (id) on delete set null,
  title text not null,
  description text,
  status demanda_status not null default 'aberta',
  priority demanda_prioridade not null default 'media',
  created_by_client boolean not null default false,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index demandas_client_id_idx on demandas (client_id);
create index demandas_project_id_idx on demandas (project_id);
create index demandas_status_idx on demandas (status);

-- keep updated_at fresh
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger clients_set_updated_at before update on clients
  for each row execute function set_updated_at();
create trigger projects_set_updated_at before update on projects
  for each row execute function set_updated_at();
create trigger demandas_set_updated_at before update on demandas
  for each row execute function set_updated_at();

-- Row Level Security
alter table clients enable row level security;
alter table projects enable row level security;
alter table demandas enable row level security;

-- Admin (Hub) access: any authenticated user that is NOT linked to a client
-- row is treated as agency staff and gets full access. For the MVP there is
-- a single admin user, so this is intentionally simple.
create or replace function is_admin()
returns boolean as $$
  select auth.uid() is not null
    and not exists (
      select 1 from clients where auth_user_id = auth.uid()
    );
$$ language sql stable;

create policy "admin_full_access_clients" on clients
  for all using (is_admin()) with check (is_admin());

create policy "client_read_own_row" on clients
  for select using (auth_user_id = auth.uid());

create policy "admin_full_access_projects" on projects
  for all using (is_admin()) with check (is_admin());

create policy "client_read_own_projects" on projects
  for select using (
    client_id in (select id from clients where auth_user_id = auth.uid())
  );

create policy "admin_full_access_demandas" on demandas
  for all using (is_admin()) with check (is_admin());

create policy "client_read_own_demandas" on demandas
  for select using (
    client_id in (select id from clients where auth_user_id = auth.uid())
  );

create policy "client_create_own_demandas" on demandas
  for insert with check (
    client_id in (select id from clients where auth_user_id = auth.uid())
  );
