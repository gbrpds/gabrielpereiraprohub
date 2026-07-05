import { createClient } from "@/lib/supabase/server";
import { CronogramaView } from "./cronograma-view";

export default async function CronogramaPage() {
  const supabase = await createClient();

  const [{ data: clients }, { data: demandas }] = await Promise.all([
    supabase.from("clients").select("id, name").eq("active", true).order("name"),
    supabase
      .from("demandas")
      .select("*, clients(id, name)")
      .not("publish_date", "is", null)
      .order("publish_date"),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-white">Cronograma</h1>

      {(clients ?? []).length === 0 ? (
        <p className="border border-neutral-800 bg-neutral-950 px-4 py-8 text-center text-neutral-500">
          Cadastre um cliente ativo para ver o cronograma.
        </p>
      ) : (
        <CronogramaView clients={clients ?? []} demandas={demandas ?? []} />
      )}
    </div>
  );
}
