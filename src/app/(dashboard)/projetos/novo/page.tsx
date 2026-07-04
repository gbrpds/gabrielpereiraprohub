import { createClient } from "@/lib/supabase/server";
import { createProject } from "../actions";

export default async function NovoProjetoPage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string; error?: string }>;
}) {
  const { client_id, error } = await searchParams;
  const supabase = await createClient();
  const { data: clients } = await supabase.from("clients").select("id, name").order("name");

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900">Novo projeto</h1>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <form action={createProject} className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">Cliente</label>
          <select
            name="client_id"
            defaultValue={client_id ?? ""}
            required
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
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
          <label className="mb-1 block text-sm font-medium text-neutral-700">Nome do projeto</label>
          <input
            name="name"
            required
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">Descrição</label>
          <textarea
            name="description"
            rows={3}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Início</label>
            <input
              type="date"
              name="start_date"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Fim previsto</label>
            <input
              type="date"
              name="end_date"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Salvar projeto
        </button>
      </form>
    </div>
  );
}
