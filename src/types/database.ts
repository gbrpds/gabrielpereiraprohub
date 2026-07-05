export type DemandaStatus =
  | "recebida"
  | "em_producao"
  | "em_aprovacao"
  | "programar"
  | "concluido";

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

export interface Demanda {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  status: DemandaStatus;
  created_by_client: boolean;
  due_date: string | null;
  publish_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface DemandaAttachment {
  id: string;
  demanda_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  caption: string | null;
  created_at: string;
}
