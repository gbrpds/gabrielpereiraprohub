import { createClient } from "@/lib/supabase/server";
import { FinanceiroView } from "./financeiro-view";
import { formatBRL } from "@/lib/format";

export default async function FinanceiroPage() {
  const supabase = await createClient();

  const [{ data: transactions }, { data: clients }, { data: activeClients }] = await Promise.all([
    supabase
      .from("transactions")
      .select("*, clients(name)")
      .order("due_date", { ascending: false, nullsFirst: false }),
    supabase.from("clients").select("id, name").order("name"),
    supabase
      .from("clients")
      .select("contract_value, contract_cycle")
      .eq("active", true),
  ]);

  const txs = transactions ?? [];
  const monthPrefix = new Date().toISOString().slice(0, 7); // YYYY-MM

  const receitaMes = txs
    .filter((t) => t.type === "receita" && t.status === "pago" && t.paid_date?.startsWith(monthPrefix))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const despesaMes = txs
    .filter((t) => t.type === "despesa" && t.status === "pago" && t.paid_date?.startsWith(monthPrefix))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const aReceber = txs
    .filter((t) => t.type === "receita" && t.status !== "pago")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const mrr = (activeClients ?? [])
    .filter((c) => c.contract_cycle === "mensal" && c.contract_value)
    .reduce((sum, c) => sum + Number(c.contract_value), 0);

  const cards = [
    { label: "Receita recebida (mês)", value: formatBRL(receitaMes), tone: "text-emerald-300" },
    { label: "A receber", value: formatBRL(aReceber), tone: "text-yellow-300" },
    { label: "Despesas (mês)", value: formatBRL(despesaMes), tone: "text-red-300" },
    { label: "Saldo do mês", value: formatBRL(receitaMes - despesaMes), tone: "text-white" },
    { label: "Receita recorrente (MRR)", value: formatBRL(mrr), tone: "text-orange-300" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-white">Financeiro</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="border border-neutral-800 bg-neutral-950 p-4">
            <p className="text-xs text-neutral-500">{card.label}</p>
            <p className={`mt-2 text-xl font-semibold ${card.tone}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <FinanceiroView transactions={txs} clients={clients ?? []} />
    </div>
  );
}
