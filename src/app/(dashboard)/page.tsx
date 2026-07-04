import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DEMANDA_STATUS_LABEL } from "@/lib/status";
import type { DemandaStatus } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ count: clientesAtivos }, { count: projetosAndamento }, { data: demandas }] =
    await Promise.all([
      supabase.from("clients").select("*", { count: "exact", head: true }).eq("active", true),
      supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("status", "em_andamento"),
      supabase.from("demandas").select("status"),
    ]);

  const demandaCounts = (demandas ?? []).reduce<Record<string, number>>((acc, d) => {
    acc[d.status] = (acc[d.status] ?? 0) + 1;
    return acc;
  }, {});

  const abertas =
    (demandaCounts["aberta"] ?? 0) +
    (demandaCounts["em_andamento"] ?? 0) +
    (demandaCounts["aguardando_aprovacao"] ?? 0) +
    (demandaCounts["aprovada_ajustes"] ?? 0);

  const cards = [
    { label: "Clientes ativos", value: clientesAtivos ?? 0, href: "/clientes" },
    { label: "Projetos em andamento", value: projetosAndamento ?? 0, href: "/projetos" },
    { label: "Demandas em aberto", value: abertas, href: "/demandas" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900">Dashboard</h1>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-neutral-300"
          >
            <p className="text-sm text-neutral-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-neutral-900">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-neutral-900">Demandas por status</h2>
        <div className="space-y-2">
          {(Object.keys(DEMANDA_STATUS_LABEL) as DemandaStatus[]).map((status) => (
            <div key={status} className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">{DEMANDA_STATUS_LABEL[status]}</span>
              <span className="font-medium text-neutral-900">{demandaCounts[status] ?? 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
