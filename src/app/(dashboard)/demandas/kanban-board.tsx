"use client";

import { useState, useTransition } from "react";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { updateDemandaStatus } from "./actions";
import { DEMANDA_STATUS_LABEL, DEMANDA_STATUS_ORDER } from "@/lib/status";
import type { Demanda, DemandaStatus } from "@/types/database";

type DemandaWithClient = Demanda & { clients: { name: string } | null };

export function KanbanBoard({
  demandas,
  onSelect,
}: {
  demandas: DemandaWithClient[];
  onSelect: (id: string) => void;
}) {
  const [items, setItems] = useState(demandas);
  const [prevDemandas, setPrevDemandas] = useState(demandas);
  const [, startTransition] = useTransition();

  if (demandas !== prevDemandas) {
    setPrevDemandas(demandas);
    setItems(demandas);
  }

  function onDragEnd(result: DropResult) {
    const { destination, draggableId } = result;
    if (!destination) return;

    const newStatus = destination.droppableId as DemandaStatus;
    const demanda = items.find((d) => d.id === draggableId);
    if (!demanda || demanda.status === newStatus) return;

    setItems((prev) => prev.map((d) => (d.id === draggableId ? { ...d, status: newStatus } : d)));

    startTransition(() => {
      updateDemandaStatus(draggableId, newStatus);
    });
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 gap-4 overflow-x-auto sm:grid-cols-2 lg:grid-cols-5">
        {DEMANDA_STATUS_ORDER.map((status) => {
          const columnDemandas = items.filter((d) => d.status === status);
          return (
            <div key={status} className="min-w-[240px] border border-neutral-800 bg-neutral-950 p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold text-neutral-300">
                  {DEMANDA_STATUS_LABEL[status]}
                </h2>
                <span className="text-xs text-neutral-600">{columnDemandas.length}</span>
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
                            onClick={() => onSelect(demanda.id)}
                            className={`cursor-pointer border border-neutral-800 bg-black p-3 shadow-sm transition hover:border-orange-700 ${
                              snapshot.isDragging ? "ring-1 ring-orange-600" : ""
                            }`}
                          >
                            <p className="mb-1 text-sm font-medium text-white">{demanda.title}</p>
                            <p className="text-xs text-neutral-500">{demanda.clients?.name}</p>
                            {demanda.publish_date && (
                              <p className="mt-2 text-xs text-orange-400">
                                Publica em {demanda.publish_date}
                              </p>
                            )}
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
