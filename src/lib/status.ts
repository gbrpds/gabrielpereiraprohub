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
  recebida: "border border-neutral-600 text-neutral-300",
  em_producao: "border border-orange-500 text-orange-400",
  em_aprovacao: "border border-yellow-500 text-yellow-300",
  programar: "border border-sky-500 text-sky-300",
  concluido: "border border-emerald-500 text-emerald-300",
};
