"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { DemandaDrawer } from "../demandas/demanda-drawer";
import { DEMANDA_STATUS_BADGE, DEMANDA_STATUS_LABEL } from "@/lib/status";
import type { Client, Demanda, DemandaStatus } from "@/types/database";

type DemandaWithClient = Demanda & { clients: { id: string; name: string } | null };

const WEEKDAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

export function CronogramaView({
  clients,
  demandas,
}: {
  clients: Pick<Client, "id" | "name">[];
  demandas: DemandaWithClient[];
}) {
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [month, setMonth] = useState(() => new Date());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const clientDemandas = useMemo(
    () => demandas.filter((d) => d.client_id === clientId && d.publish_date),
    [demandas, clientId]
  );

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-orange-600 focus:outline-none"
        >
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMonth((m) => subMonths(m, 1))}
            className="border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:border-orange-600 hover:text-white"
          >
            ←
          </button>
          <span className="text-sm font-medium capitalize text-white">
            {format(month, "MMMM yyyy", { locale: ptBR })}
          </span>
          <button
            onClick={() => setMonth((m) => addMonths(m, 1))}
            className="border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:border-orange-600 hover:text-white"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-l border-t border-neutral-800">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="border-b border-r border-neutral-800 bg-neutral-950 px-2 py-2 text-center text-xs font-semibold text-neutral-500"
          >
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dayDemandas = clientDemandas.filter((d) =>
            d.publish_date ? isSameDay(parseISO(d.publish_date), day) : false
          );
          const inMonth = isSameMonth(day, month);

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[110px] border-b border-r border-neutral-800 p-2 ${
                inMonth ? "bg-black" : "bg-neutral-950"
              }`}
            >
              <p className={`mb-1 text-xs ${inMonth ? "text-neutral-400" : "text-neutral-700"}`}>
                {format(day, "d")}
              </p>
              <div className="space-y-1">
                {dayDemandas.map((demanda) => (
                  <button
                    key={demanda.id}
                    onClick={() => setSelectedId(demanda.id)}
                    className={`block w-full truncate px-1.5 py-1 text-left text-xs ${DEMANDA_STATUS_BADGE[demanda.status as DemandaStatus]}`}
                    title={demanda.title}
                  >
                    {demanda.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-neutral-500">
        {Object.entries(DEMANDA_STATUS_LABEL).map(([status, label]) => (
          <span key={status} className="flex items-center gap-1">
            <span className={`inline-block h-2 w-2 ${DEMANDA_STATUS_BADGE[status as DemandaStatus]}`} />
            {label}
          </span>
        ))}
      </div>

      {selectedId && <DemandaDrawer id={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
