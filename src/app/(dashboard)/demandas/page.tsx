import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { KanbanBoard } from "./kanban-board";

export default async function DemandasPage() {
  const supabase = await createClient();
  const { data: demandas } = await supabase
    .from("demandas")
    .select("*, clients(name), projects(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Demandas</h1>
        <Link
          href="/demandas/nova"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Nova demanda
        </Link>
      </div>

      <KanbanBoard initialDemandas={demandas ?? []} />
    </div>
  );
}
