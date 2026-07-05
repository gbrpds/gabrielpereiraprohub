import type { DemandaStatus } from "@/types/database";

export const DEMANDA_STATUS_ORDER: DemandaStatus[] = [
  "recebida",
  "em_producao",
  "em_aprovacao",
  "programar",
  "concluido",
];

export const DEMANDA_STATUS_LABEL: Record<DemandaStatus, string> = {
  recebida: "Demanda recebida",
  em_producao: "Em produção",
  em_aprovacao: "Em aprovação",
  programar: "Programar",
  concluido: "Concluído",
};

export const DEMANDA_STATUS_BADGE: Record<DemandaStatus, string> = {
  recebida: "border border-neutral-700 text-neutral-300",
  em_producao: "border border-orange-700 text-orange-400",
  em_aprovacao: "border border-yellow-700 text-yellow-400",
  programar: "border border-blue-700 text-blue-400",
  concluido: "border border-emerald-700 text-emerald-400",
};
