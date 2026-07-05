"use client";

import { useState, useTransition } from "react";
import { createTransaction, setTransactionStatus, deleteTransaction } from "./actions";
import { formatBRL } from "@/lib/format";
import type { Client, Transaction, TransactionStatus } from "@/types/database";

type TransactionWithClient = Transaction & { clients: { name: string } | null };

const STATUS_LABEL: Record<TransactionStatus, string> = {
  pendente: "Pendente",
  pago: "Pago",
  atrasado: "Atrasado",
};

const STATUS_BADGE: Record<TransactionStatus, string> = {
  pendente: "border border-yellow-500 text-yellow-300",
  pago: "border border-emerald-500 text-emerald-300",
  atrasado: "border border-red-500 text-red-300",
};

const input =
  "w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none";

export function FinanceiroView({
  transactions,
  clients,
}: {
  transactions: TransactionWithClient[];
  clients: Pick<Client, "id" | "name">[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [, startTransition] = useTransition();

  async function handleCreate(formData: FormData) {
    await createTransaction(formData);
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-orange-500 px-4 py-2 text-sm font-medium text-black hover:bg-orange-400"
        >
          {showForm ? "Cancelar" : "Novo lançamento"}
        </button>
      </div>

      {showForm && (
        <form action={handleCreate} className="border border-neutral-800 bg-neutral-950 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-300">Tipo</label>
              <select name="type" defaultValue="receita" className={input}>
                <option value="receita">Receita (entrada)</option>
                <option value="despesa">Despesa (saída)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-300">Valor (R$)</label>
              <input name="amount" inputMode="decimal" placeholder="0,00" required className={input} />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-neutral-300">Descrição</label>
              <input name="description" required className={input} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-300">Categoria</label>
              <input name="category" placeholder="Ex: Mensalidade, Tráfego..." className={input} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-300">Cliente</label>
              <select name="client_id" defaultValue="" className={input}>
                <option value="">— Nenhum —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-300">Vencimento</label>
              <input type="date" name="due_date" className={input} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-300">Situação</label>
              <select name="status" defaultValue="pendente" className={input}>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="atrasado">Atrasado</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-orange-500 px-4 py-2 text-sm font-medium text-black hover:bg-orange-400"
          >
            Salvar lançamento
          </button>
        </form>
      )}

      <div className="overflow-hidden border border-neutral-800 bg-neutral-950">
        <table className="w-full text-left text-sm">
          <thead className="bg-black text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Descrição</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Vencimento</th>
              <th className="px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Situação</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-t border-neutral-900 hover:bg-black">
                <td className="px-4 py-3 text-white">{t.description}</td>
                <td className="px-4 py-3 text-neutral-400">{t.clients?.name ?? "—"}</td>
                <td className="px-4 py-3 text-neutral-400">{t.category ?? "—"}</td>
                <td className="px-4 py-3 text-neutral-400">{t.due_date ?? "—"}</td>
                <td
                  className={`px-4 py-3 font-medium ${
                    t.type === "receita" ? "text-emerald-300" : "text-red-300"
                  }`}
                >
                  {t.type === "receita" ? "+" : "−"} {formatBRL(Number(t.amount))}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[t.status]}`}>
                    {STATUS_LABEL[t.status]}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  {t.status !== "pago" && (
                    <button
                      onClick={() => startTransition(() => setTransactionStatus(t.id, "pago"))}
                      className="mr-3 text-xs text-emerald-300 hover:underline"
                    >
                      Marcar pago
                    </button>
                  )}
                  <button
                    onClick={() => startTransition(() => deleteTransaction(t.id))}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                  Nenhum lançamento ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
