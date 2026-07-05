-- Fix RLS recursion + expand clients with contract/financial data + add a
-- financial ledger (transactions) and a private bucket for contract files.

-- 1) FIX: `is_admin()` queried `clients`, but the RLS policies on `clients`
-- call `is_admin()` — this recursed until Postgres hit "stack depth limit
-- exceeded", breaking client inserts and slowing every query. Running the
-- function as SECURITY DEFINER makes its internal lookup bypass RLS, cutting
-- the recursion. `set search_path` keeps it safe.
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() is not null
    and not exists (
      select 1 from clients where auth_user_id = auth.uid()
    );
$$;

-- 2) Expand clients with financial / contract fields.
create type contract_cycle as enum ('mensal', 'trimestral', 'semestral', 'anual', 'pontual');

alter table clients add column if not exists document text;
alter table clients add column if not exists instagram text;
alter table clients add column if not exists address text;
alter table clients add column if not exists package text;
alter table clients add column if not exists contract_value numeric(12, 2);
alter table clients add column if not exists contract_cycle contract_cycle not null default 'mensal';
alter table clients add column if not exists billing_day integer;
alter table clients add column if not exists contract_start date;
alter table clients add column if not exists contract_end date;
alter table clients add column if not exists contract_file_path text;
alter table clients add column if not exists payment_method text;

-- 3) Financial ledger. Internal only (no client-facing RLS).
create type transaction_type as enum ('receita', 'despesa');
create type transaction_status as enum ('pendente', 'pago', 'atrasado');

create table transactions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients (id) on delete set null,
  type transaction_type not null default 'receita',
  description text not null,
  category text,
  amount numeric(12, 2) not null default 0,
  status transaction_status not null default 'pendente',
  due_date date,
  paid_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index transactions_client_id_idx on transactions (client_id);
create index transactions_status_idx on transactions (status);
create index transactions_due_date_idx on transactions (due_date);

create trigger transactions_set_updated_at before update on transactions
  for each row execute function set_updated_at();

alter table transactions enable row level security;

create policy "admin_full_access_transactions" on transactions
  for all using (is_admin()) with check (is_admin());

-- 4) Private bucket for contract files (accessed via the service-role client).
insert into storage.buckets (id, name, public)
values ('client-contracts', 'client-contracts', false)
on conflict (id) do nothing;
