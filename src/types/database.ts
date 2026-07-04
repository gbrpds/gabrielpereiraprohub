export type DemandaStatus =
  | "aberta"
  | "em_andamento"
  | "aguardando_aprovacao"
  | "aprovada_ajustes"
  | "concluida";

export type ProjetoStatus = "planejamento" | "em_andamento" | "pausado" | "concluido";

export type DemandaPrioridade = "baixa" | "media" | "alta" | "urgente";

export interface Client {
  id: string;
  auth_user_id: string | null;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  notes: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  description: string | null;
  status: ProjetoStatus;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Demanda {
  id: string;
  client_id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  status: DemandaStatus;
  priority: DemandaPrioridade;
  created_by_client: boolean;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: Client;
        Insert: Partial<Client> & { name: string; email: string };
        Update: Partial<Client>;
      };
      projects: {
        Row: Project;
        Insert: Partial<Project> & { client_id: string; name: string };
        Update: Partial<Project>;
      };
      demandas: {
        Row: Demanda;
        Insert: Partial<Demanda> & { client_id: string; title: string };
        Update: Partial<Demanda>;
      };
    };
  };
}
