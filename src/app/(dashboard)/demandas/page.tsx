import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DemandasView } from "./demandas-view";

export default async function DemandasPage() {
  const supabase = await createClient();
  const { data: demandas } = await supabase
    .from("demandas")
    .select("*, clients(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Demandas</h1>
        <Link
          href="/demandas/nova"
          className="bg-orange-500 px-4 py-2 text-sm font-medium text-black hover:bg-orange-400"
        >
          Nova demanda
        </Link>
      </div>

      <DemandasView demandas={demandas ?? []} />
    </div>
  );
}
