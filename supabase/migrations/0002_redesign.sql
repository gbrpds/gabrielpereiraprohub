-- Redesign: drop the Projects concept, rework the Demanda pipeline, and add
-- attachments (Cronograma deliverables) with Supabase Storage.
-- Safe to run on the dev database created from 0001_init.sql. If the
-- tables don't exist yet, the `if exists` guards make this a no-op for them.

drop table if exists demanda_attachments cascade;
drop table if exists demandas cascade;
drop table if exists projects cascade;
drop type if exists demanda_status;
drop type if exists projeto_status;
drop type if exists demanda_prioridade;

create type demanda_status as enum (
  'recebida',
  'em_producao',
  'em_aprovacao',
  'programar',
  'concluido'
);

create table demandas (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  title text not null,
  description text,
  status demanda_status not null default 'recebida',
  created_by_client boolean not null default false,
  due_date date,
  publish_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index demandas_client_id_idx on demandas (client_id);
create index demandas_status_idx on demandas (status);
create index demandas_publish_date_idx on demandas (publish_date);

create trigger demandas_set_updated_at before update on demandas
  for each row execute function set_updated_at();

create table demanda_attachments (
  id uuid primary key default gen_random_uuid(),
  demanda_id uuid not null references demandas (id) on delete cascade,
  file_path text not null,
  file_name text not null,
  file_type text not null,
  caption text,
  created_at timestamptz not null default now()
);

create index demanda_attachments_demanda_id_idx on demanda_attachments (demanda_id);

alter table demandas enable row level security;
alter table demanda_attachments enable row level security;

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

create policy "admin_full_access_attachments" on demanda_attachments
  for all using (is_admin()) with check (is_admin());

create policy "client_read_own_attachments" on demanda_attachments
  for select using (
    demanda_id in (
      select id from demandas where client_id in (
        select id from clients where auth_user_id = auth.uid()
      )
    )
  );

-- Storage bucket for deliverables (images/videos/pdfs attached to a demanda).
-- Kept private: the Hub reads/writes it through the service-role client, so
-- no public storage policies are needed yet. Revisit once the client Portal
-- needs direct read access.
insert into storage.buckets (id, name, public)
values ('demanda-attachments', 'demanda-attachments', false)
on conflict (id) do nothing;
