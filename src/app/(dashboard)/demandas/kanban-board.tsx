"use client";

import { useState, useTransition } from "react";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { updateDemandaStatus } from "./actions";
import {
  DEMANDA_STATUS_LABEL,
  DEMANDA_STATUS_ORDER,
  PRIORIDADE_BADGE,
  PRIORIDADE_LABEL,
} from "@/lib/status";
import type { Demanda, DemandaStatus } from "@/types/database";

type DemandaWithRelations = Demanda & {
  clients: { name: string } | null;
  projects: { name: string } | null;
};

export function KanbanBoard({ initialDemandas }: { initialDemandas: DemandaWithRelations[] }) {
  const [demandas, setDemandas] = useState(initialDemandas);
  const [, startTransition] = useTransition();

  function onDragEnd(result: DropResult) {
    const { destination, draggableId } = result;
    if (!destination) return;

    const newStatus = destination.droppableId as DemandaStatus;
    const demanda = demandas.find((d) => d.id === draggableId);
    if (!demanda || demanda.status === newStatus) return;

    setDemandas((prev) =>
      prev.map((d) => (d.id === draggableId ? { ...d, status: newStatus } : d))
    );

    startTransition(() => {
      updateDemandaStatus(draggableId, newStatus);
    });
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 gap-4 overflow-x-auto sm:grid-cols-2 lg:grid-cols-5">
        {DEMANDA_STATUS_ORDER.map((status) => {
          const columnDemandas = demandas.filter((d) => d.status === status);
          return (
            <div key={status} className="min-w-[240px] rounded-xl bg-neutral-100 p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold text-neutral-700">
                  {DEMANDA_STATUS_LABEL[status]}
                </h2>
                <span className="text-xs text-neutral-400">{columnDemandas.length}</span>
              </div>

              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[120px] space-y-2"
                  >
                    {columnDemandas.map((demanda, index) => (
                      <Draggable key={demanda.id} draggableId={demanda.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`rounded-lg border border-neutral-200 bg-white p-3 shadow-sm transition ${
                              snapshot.isDragging ? "ring-2 ring-neutral-300" : ""
                            }`}
                          >
                            <p className="mb-1 text-sm font-medium text-neutral-900">
                              {demanda.title}
                            </p>
                            <p className="mb-2 text-xs text-neutral-500">
                              {demanda.clients?.name}
                              {demanda.projects?.name ? ` · ${demanda.projects.name}` : ""}
                            </p>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORIDADE_BADGE[demanda.priority]}`}
                            >
                              {PRIORIDADE_LABEL[demanda.priority]}
                            </span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
