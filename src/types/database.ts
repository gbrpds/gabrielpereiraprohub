export type DemandaStatus =
  | "recebida"
  | "em_producao"
  | "em_aprovacao"
  | "programar"
  | "concluido";

export type ContractCycle = "mensal" | "trimestral" | "semestral" | "anual" | "pontual";

export type TransactionType = "receita" | "despesa";

export type TransactionStatus = "pendente" | "pago" | "atrasado";

export interface Client {
  id: string;
  auth_user_id: string | null;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  document: string | null;
  instagram: string | null;
  address: string | null;
  package: string | null;
  contract_value: number | null;
  contract_cycle: ContractCycle;
  billing_day: number | null;
  contract_start: string | null;
  contract_end: string | null;
  contract_file_path: string | null;
  payment_method: string | null;
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

export interface Transaction {
  id: string;
  client_id: string | null;
  type: TransactionType;
  description: string;
  category: string | null;
  amount: number;
  status: TransactionStatus;
  due_date: string | null;
  paid_date: string | null;
  created_at: string;
  updated_at: string;
}
