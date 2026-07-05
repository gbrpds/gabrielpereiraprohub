"use client";

import { useTransition } from "react";
import { updateDemandaStatus } from "./actions";
import { DEMANDA_STATUS_LABEL, DEMANDA_STATUS_ORDER } from "@/lib/status";
import type { Demanda, DemandaStatus } from "@/types/database";

type DemandaWithClient = Demanda & { clients: { name: string } | null };

export function ListView({
  demandas,
  onSelect,
}: {
  demandas: DemandaWithClient[];
  onSelect: (id: string) => void;
}) {
  const [, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      {DEMANDA_STATUS_ORDER.map((status) => {
        const rows = demandas.filter((d) => d.status === status);
        if (rows.length === 0) return null;

        return (
          <div key={status} className="border border-neutral-800 bg-neutral-950">
            <div className="flex items-center gap-2 border-b border-neutral-800 bg-black px-4 py-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                {DEMANDA_STATUS_LABEL[status]}
              </span>
              <span className="text-xs text-neutral-600">{rows.length}</span>
            </div>
            <table className="w-full text-left text-sm">
              <tbody>
                {rows.map((demanda) => (
                  <tr key={demanda.id} className="border-t border-neutral-900 hover:bg-black">
                    <td className="w-full px-4 py-3">
                      <button
                        onClick={() => onSelect(demanda.id)}
                        className="font-medium text-white hover:underline"
                      >
                        {demanda.title}
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-neutral-400">
                      {demanda.clients?.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                      {demanda.due_date ? `Entrega ${demanda.due_date}` : ""}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-orange-300">
                      {demanda.publish_date ? `Publica ${demanda.publish_date}` : ""}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <select
                        value={demanda.status}
                        onChange={(e) =>
                          startTransition(() =>
                            updateDemandaStatus(demanda.id, e.target.value as DemandaStatus)
                          )
                        }
                        className="border border-neutral-700 bg-black px-2 py-1 text-xs text-white focus:border-orange-500 focus:outline-none"
                      >
                        {DEMANDA_STATUS_ORDER.map((s) => (
                          <option key={s} value={s}>
                            {DEMANDA_STATUS_LABEL[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
      {demandas.length === 0 && (
        <p className="border border-neutral-800 bg-neutral-950 px-4 py-8 text-center text-neutral-500">
          Nenhuma demanda ainda.
        </p>
      )}
    </div>
  );
}
