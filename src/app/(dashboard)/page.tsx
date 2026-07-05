import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DEMANDA_STATUS_LABEL } from "@/lib/status";
import type { DemandaStatus } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ count: clientesAtivos }, { data: demandas }] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }).eq("active", true),
    supabase.from("demandas").select("status"),
  ]);

  const demandaCounts = (demandas ?? []).reduce<Record<string, number>>((acc, d) => {
    acc[d.status] = (acc[d.status] ?? 0) + 1;
    return acc;
  }, {});

  const abertas =
    (demandaCounts["recebida"] ?? 0) +
    (demandaCounts["em_producao"] ?? 0) +
    (demandaCounts["em_aprovacao"] ?? 0) +
    (demandaCounts["programar"] ?? 0);

  const cards = [
    { label: "Clientes ativos", value: clientesAtivos ?? 0, href: "/clientes" },
    { label: "Demandas em aberto", value: abertas, href: "/demandas" },
    { label: "Concluídas", value: demandaCounts["concluido"] ?? 0, href: "/demandas" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-white">Dashboard</h1>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="border border-neutral-800 bg-neutral-950 p-5 shadow-sm transition hover:border-orange-700"
          >
            <p className="text-sm text-neutral-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="border border-neutral-800 bg-neutral-950 p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-white">Demandas por status</h2>
        <div className="space-y-2">
          {(Object.keys(DEMANDA_STATUS_LABEL) as DemandaStatus[]).map((status) => (
            <div key={status} className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">{DEMANDA_STATUS_LABEL[status]}</span>
              <span className="font-medium text-white">{demandaCounts[status] ?? 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
