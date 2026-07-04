import type { DemandaPrioridade, DemandaStatus, ProjetoStatus } from "@/types/database";

export const DEMANDA_STATUS_ORDER: DemandaStatus[] = [
  "aberta",
  "em_andamento",
  "aguardando_aprovacao",
  "aprovada_ajustes",
  "concluida",
];

export const DEMANDA_STATUS_LABEL: Record<DemandaStatus, string> = {
  aberta: "Aberta",
  em_andamento: "Em andamento",
  aguardando_aprovacao: "Aguardando aprovação",
  aprovada_ajustes: "Aprovada / Ajustes",
  concluida: "Concluída",
};

export const PROJETO_STATUS_LABEL: Record<ProjetoStatus, string> = {
  planejamento: "Planejamento",
  em_andamento: "Em andamento",
  pausado: "Pausado",
  concluido: "Concluído",
};

export const PROJETO_STATUS_BADGE: Record<ProjetoStatus, string> = {
  planejamento: "bg-blue-50 text-blue-700",
  em_andamento: "bg-amber-50 text-amber-700",
  pausado: "bg-neutral-100 text-neutral-600",
  concluido: "bg-emerald-50 text-emerald-700",
};

export const PRIORIDADE_LABEL: Record<DemandaPrioridade, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  urgente: "Urgente",
};

export const PRIORIDADE_BADGE: Record<DemandaPrioridade, string> = {
  baixa: "bg-neutral-100 text-neutral-600",
  media: "bg-blue-50 text-blue-700",
  alta: "bg-amber-50 text-amber-700",
  urgente: "bg-red-50 text-red-700",
};
