"use client";

import { useState } from "react";
import { KanbanBoard } from "./kanban-board";
import { ListView } from "./list-view";
import { DemandaDrawer } from "./demanda-drawer";
import type { Demanda } from "@/types/database";

type DemandaWithClient = Demanda & { clients: { name: string } | null };

export function DemandasView({ demandas }: { demandas: DemandaWithClient[] }) {
  const [view, setView] = useState<"lista" | "kanban">("lista");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-4 flex border border-neutral-800 text-xs font-medium">
        <button
          onClick={() => setView("lista")}
          className={`px-4 py-2 ${
            view === "lista" ? "bg-orange-500 text-black" : "bg-neutral-950 text-neutral-400 hover:text-white"
          }`}
        >
          Lista
        </button>
        <button
          onClick={() => setView("kanban")}
          className={`px-4 py-2 ${
            view === "kanban" ? "bg-orange-500 text-black" : "bg-neutral-950 text-neutral-400 hover:text-white"
          }`}
        >
          Kanban
        </button>
      </div>

      {view === "lista" ? (
        <ListView demandas={demandas} onSelect={setSelectedId} />
      ) : (
        <KanbanBoard demandas={demandas} onSelect={setSelectedId} />
      )}

      {selectedId && <DemandaDrawer id={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
