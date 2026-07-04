-- Only run this if the 0001_init.sql migration failed partway through and
-- you need to reset before retrying it. Safe to run even if some objects
-- don't exist yet.
drop table if exists demandas cascade;
drop table if exists projects cascade;
drop table if exists clients cascade;
drop function if exists is_admin();
drop function if exists set_updated_at();
drop type if exists demanda_status;
drop type if exists projeto_status;
drop type if exists demanda_prioridade;
