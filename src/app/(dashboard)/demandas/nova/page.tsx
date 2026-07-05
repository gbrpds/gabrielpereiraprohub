import { createClient } from "@/lib/supabase/server";
import { createDemanda } from "../actions";

export default async function NovaDemandaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; client_id?: string }>;
}) {
  const { error, client_id } = await searchParams;
  const supabase = await createClient();

  const { data: clients } = await supabase.from("clients").select("id, name").order("name");

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold text-white">Nova demanda</h1>

      {error && (
        <p className="mb-4 border border-red-800 bg-red-950 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <form
        action={createDemanda}
        className="space-y-4 border border-neutral-800 bg-neutral-950 p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">Cliente</label>
          <select
            name="client_id"
            required
            defaultValue={client_id ?? ""}
            className="w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
          >
            <option value="" disabled>
              Selecione um cliente
            </option>
            {(clients ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">Título</label>
          <input
            name="title"
            required
            className="w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">Descrição</label>
          <textarea
            name="description"
            rows={4}
            className="w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-300">
              Data de entrega
            </label>
            <input
              type="date"
              name="due_date"
              className="w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-300">
              Data de publicação
            </label>
            <input
              type="date"
              name="publish_date"
              className="w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>
        <p className="text-xs text-neutral-500">
          Ao definir a data de publicação, a demanda aparece automaticamente no Cronograma nessa
          data.
        </p>
        <button
          type="submit"
          className="w-full bg-orange-500 px-3 py-2 text-sm font-medium text-black hover:bg-orange-400"
        >
          Criar demanda
        </button>
      </form>
    </div>
  );
}
